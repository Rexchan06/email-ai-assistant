<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\EmailService;
use App\Services\HuggingFaceService;

class EmailController extends Controller
{
    public function processEmail(Request $request)
    {
        set_time_limit(120);
        $startTime = microtime(true);
        $timings = [];
        $user = auth()->user();
        $data = $request->validate([
            'daysOld' => 'required|integer|min:1|max:365',
            'category' => 'required|string',
            'confidenceThreshold' => 'required|integer|min:50|max:100'
        ]);
        $category = data_get($data, 'category');
        $confidenceThreshold = data_get($data, 'confidenceThreshold');

        if (is_null($user->google_token)) {
            $message = ['status' => 'unauthenticated'];
            return response()->json($message);
        } else {
            $emailService = new EmailService($user->google_token);
        }
        $aiService = new HuggingFaceService(); // Uses HuggingFace with Gemini fallback

        $fetchStart = microtime(true);
        $emails = $emailService->fetchEmails(data_get($data, 'daysOld'), 50);
        $messages = $emails['messages'];
        $timings['fetch_emails'] = round((microtime(true) - $fetchStart) * 1000, 2);
        
        // DEBUG: Check if emails are being fetched
        if (empty($messages)) {
            error_log("No emails fetched. Email response: " . json_encode($emails));
        } else {
            error_log("Fetched " . count($messages) . " emails successfully");
        }

        $detailsStart = microtime(true);
        $messageIds = [];
        foreach ($messages as $message) {
            $messageIds[] = $message['id'];
        }
        
        $emailDetails = $emailService->getConcurrentEmailDetails($messageIds);
        $timings['get_email_details'] = round((microtime(true) - $detailsStart) * 1000, 2);

        $classifyStart = microtime(true);
        $classifiedEmails = $this->getClassifiedEmailsConcurrent($aiService, $emailDetails);
        $timings['ai_classification'] = round((microtime(true) - $classifyStart) * 1000, 2);
        
        // DEBUG: Check Gemini classification
        error_log("Email details count: " . count($emailDetails));
        error_log("Classified emails count: " . count($classifiedEmails));
        if (empty($classifiedEmails) && !empty($emailDetails)) {
            error_log("GEMINI FAILURE: Got email details but no classifications");
            error_log("Sample email detail: " . json_encode($emailDetails[0] ?? null));
        }

        $autoDelete = $this->getAutoDeleteEmails($classifiedEmails, $category, $confidenceThreshold);
        $uncertainEmails = $this->getUncertainEmails($classifiedEmails, $category, $confidenceThreshold);
        
        // DEBUG: Check what's in autoDelete before deletion
        error_log("AutoDelete sample structure: " . json_encode($autoDelete[0] ?? null));
        
        // DEBUG: Let's trace what's happening - add to response
        $debugInfo = [
            'emailsFetched' => count($messages),
            'fetchResponse' => empty($messages) ? $emails : 'OK',
            'emailDetailsCount' => count($emailDetails),
            'sampleEmailDetail' => $emailDetails[0] ?? null,
            'totalClassified' => count($classifiedEmails),
            'lookingForCategory' => $category,
            'confidenceThreshold' => $confidenceThreshold,
            'sampleClassifications' => array_slice($classifiedEmails, 0, 5),
            'autoDeleteCount' => count($autoDelete),
            'autoDeleteSample' => array_slice($autoDelete, 0, 3),
            'categoryBreakdown' => collect($classifiedEmails)->groupBy('category')->map->count()->toArray()
        ];

        $deleteStart = microtime(true);
        
        $successfulDeletion = [];
        $failedDeletion = [];
        $response = null;
        
        if (count($autoDelete) > 0) {
            $response = $emailService->batchMoveToTrash($autoDelete);
            $successfulObjects = data_get($response, 'succeeded', []);
            $failedObjects = data_get($response, 'failed', []);
            
            // Extract IDs from the response objects
            $successfulIds = [];
            $failedIds = [];
            
            if (is_array($successfulObjects)) {
                $successfulIds = array_column($successfulObjects, 'id');
            }
            
            if (is_array($failedObjects)) {
                $failedIds = array_column($failedObjects, 'id');
            }
            
            // Map IDs back to full email objects for display
            $successfulDeletion = collect($autoDelete)->filter(function($email) use ($successfulIds) {
                return in_array($email['id'], $successfulIds);
            })->values()->toArray();
            
            $failedDeletion = collect($autoDelete)->filter(function($email) use ($failedIds) {
                return in_array($email['id'], $failedIds);
            })->values()->toArray();
        }
        
        // DEBUG: Add to debugInfo after the if block  
        $debugInfo['batchResponse'] = $response;
        $debugInfo['autoDeleteIds'] = array_column($autoDelete, 'id');
        $debugInfo['autoDeleteSample'] = $autoDelete[0] ?? null;
        $debugInfo['successfulDeletionSample'] = $successfulDeletion[0] ?? null;
        
        $timings['batch_delete'] = round((microtime(true) - $deleteStart) * 1000, 2);

        $timings['total_time'] = round((microtime(true) - $startTime) * 1000, 2);

        $summaryMessage = $this->generateSummary($classifiedEmails, $successfulDeletion, $uncertainEmails, $category, $confidenceThreshold);
        $payload = [
            // Primary data (what users care about)
            'summary' => $summaryMessage,
            'metrics' => [
                'totalProcessed' => count($classifiedEmails),
                'deletedCount' => count($successfulDeletion),
                'uncertainCount' => count($uncertainEmails),
                'failedCount' => count($failedDeletion),
                'processingTimeMs' => $timings['total_time']
            ],
            'emails' => [
                'deleted' => $successfulDeletion,
                'uncertain' => $uncertainEmails,
                'failed' => $failedDeletion
            ],
            // Debug info (for developers)
            'debug' => [
                'sampleClassified' => array_slice($classifiedEmails, 0, 2),
                'requestedCategory' => $category,
                'requestedConfidence' => $confidenceThreshold,
                'detailedTimings' => $timings,
                'errorMessage' => data_get($response, 'error'),
                'deletionDebug' => $debugInfo
            ]
        ];

        return $payload;
    }

    private function getClassifiedEmailsConcurrent($aiService, $emailDetails) 
    {
        return $aiService->classifyEmailsConcurrent($emailDetails);
    }

    private function getAutoDeleteEmails($classifiedEmails, $category, $confidenceThreshold) 
    {
        return collect($classifiedEmails)->filter(function($email) use ($category, $confidenceThreshold) {
            return strtolower($email['category']) == strtolower($category) && $email['confidence'] >= $confidenceThreshold;
        })->toArray();
    }

    private function getUncertainEmails($classifiedEmails, $category, $confidenceThreshold) 
    {
        return collect($classifiedEmails)->filter(function($email) use ($category, $confidenceThreshold) {
            return strtolower($email['category']) == strtolower($category) && $email['confidence'] >= ($confidenceThreshold - 10) && $email['confidence'] < $confidenceThreshold;
        })->toArray();
    }

    private function generateSummary($classifiedEmails, $successfulDeletion, $uncertainEmails, $category, $confidenceThreshold)
    {
        $totalProcessed = count($classifiedEmails);
        $totalDeleted = count($successfulDeletion);
        // $uncertainCount = count($uncertainEmails);

        $message = "Processed {$totalProcessed} emails older than your specified days. ";
        $message .= "Found {$totalDeleted} '{$category}' emails with {$confidenceThreshold}%+ confidence that has been moved to trash";

        // if ($uncertainCount > 0) {
        //     $message .= "{$uncertainCount} emails need your confirmation (confidence between " . ($confidenceThreshold - 10) . 
        //     "%-{$confidenceThreshold}%.";
        // } else {
        //     $message .= "No emails need manual confirmation.";
        // }

        return $message;
    }
}