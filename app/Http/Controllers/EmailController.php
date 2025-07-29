<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\EmailService;
use App\Services\GeminiService;

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
        $geminiService = new GeminiService();

        $fetchStart = microtime(true);
        $emails = $emailService->fetchEmails(data_get($data, 'daysOld'), 50);
        $messages = data_get($emails, 'messages');
        $timings['fetch_emails'] = round((microtime(true) - $fetchStart) * 1000, 2);

        $detailsStart = microtime(true);
        $messageIds = [];
        foreach ($messages as $message) {
            $messageIds[] = $message['id'];
        }
        
        $emailDetails = $emailService->getConcurrentEmailDetails($messageIds);
        $timings['get_email_details'] = round((microtime(true) - $detailsStart) * 1000, 2);

        $classifyStart = microtime(true);
        $classifiedEmails = $this->getClassifiedEmailsConcurrent($geminiService, $emailDetails);
        $timings['ai_classification'] = round((microtime(true) - $classifyStart) * 1000, 2);

        $autoDelete = $this->getAutoDeleteEmails($classifiedEmails, $category, $confidenceThreshold);
        $uncertainEmails = $this->getUncertainEmails($classifiedEmails, $category, $confidenceThreshold);

        // $successfulDeletion = [];
        // $failedDeletion = [];
        // foreach ($autoDelete as $email) {
        //     $response = $emailService->deleteEmail(data_get($email, 'id'));
        //     if (data_get($response, 'success') == false) {
        //         $failedDeletion[] = $email;
        //     } else {
        //         $successfulDeletion[] = $email;
        //     }
        // }

        $deleteStart = microtime(true);
        $response = $emailService->batchMoveToTrash($autoDelete);
        $successfulDeletion = data_get($response, 'succeeded');
        $failedDeletion = data_get($response, 'failed');
        $timings['batch_delete'] = round((microtime(true) - $deleteStart) * 1000, 2);

        $timings['total_time'] = round((microtime(true) - $startTime) * 1000, 2);

        $summaryMessage = $this->generateSummary($classifiedEmails, $successfulDeletion, $uncertainEmails, $category, $confidenceThreshold);
        $payload = [
            'summaryMessage' => $summaryMessage,
            'autoDeletedEmails' => $autoDelete,
            'uncertainEmails' => $uncertainEmails,
            'failedDeletion' => $failedDeletion,
            'failedDeletionReason' => data_get($response, 'error'),
            'successfulDeletion' => $successfulDeletion,
            'debug' => [
                'totalClassified' => count($classifiedEmails),
                'sampleClassified' => array_slice($classifiedEmails, 0, 2),
                'requestedCategory' => $category,
                'requestedConfidence' => $confidenceThreshold,
                'timings' => $timings
            ]
        ];

        return $payload;
    }

    private function getClassifiedEmails($geminiService, $emailDetails) 
    {
        $geminiResponse = $geminiService->classifyEmailsBatch($emailDetails);
        $classifiedEmails = [];
        foreach ($emailDetails as $index => $emailDetail) {
            $geminiResult = $geminiResponse[$index] ?? ['category' => 'Unknown', 'confidence' => 0];
            $classifiedEmails[] = [
                'id' => $emailDetail['id'],
                'subject' => $emailDetail['subject'],
                'from' => $emailDetail['from'],
                'category' => $geminiResult['category'],
                'confidence' => $geminiResult['confidence'],
            ];
        }
        // foreach ($emailDetails as $emailDetail) {
        //     if (data_get($emailDetail, 'success') === false) {
        //         // Failed to get email details
        //         $classifiedEmails[] = [
        //             'id' => data_get($emailDetail, 'id'),
        //             'subject' => data_get($emailDetail, 'subject'),
        //             'from' => data_get($emailDetail, 'from'),
        //             'category' => null,
        //             'confidence' => null,
        //         ];
        //     } else {
        //         // Successfully got email details, classify with AI
        //         $geminiResponse = $geminiService->classifyEmail(data_get($emailDetail, 'subject'), data_get($emailDetail, 'from'));
        //         $category = data_get($geminiResponse, 'category');
        //         $confidence = data_get($geminiResponse, 'confidence');  

        //         $classifiedEmails[] = [
        //             'id' => data_get($emailDetail, 'id'),
        //             'subject' => data_get($emailDetail, 'subject'),
        //             'from' => data_get($emailDetail, 'from'),
        //             'category' => $category,
        //             'confidence' => $confidence,
        //         ];
        //     }
        // }
        return $classifiedEmails;
    }

    private function getClassifiedEmailsConcurrent($geminiService, $emailDetails) 
    {
        return $geminiService->classifyEmailsConcurrent($emailDetails);
    }

    private function getAutoDeleteEmails($classifiedEmails, $category, $confidenceThreshold) 
    {
        return collect($classifiedEmails)->filter(function($email) use ($category, $confidenceThreshold) {
            return $email['category'] == $category && $email['confidence'] >= $confidenceThreshold;
        })->toArray();
    }

    private function getUncertainEmails($classifiedEmails, $category, $confidenceThreshold) 
    {
        return collect($classifiedEmails)->filter(function($email) use ($category, $confidenceThreshold) {
            return $email['category'] == $category && $email['confidence'] >= ($confidenceThreshold - 10) && $email['confidence'] < $confidenceThreshold;
        })->toArray();
    }

    private function generateSummary($classifiedEmails, $successfulDeletion, $uncertainEmails, $category, $confidenceThreshold)
    {
        $totalProcessed = count($classifiedEmails);
        $totalDeleted = count($successfulDeletion);
        $uncertainCount = count($uncertainEmails);

        $message = "Processed {$totalProcessed} emails older than your specified days. ";
        $message .= "Found {$totalDeleted} '{$category}' emails with {$confidenceThreshold}%+ confidence that has been auto-deleted.";

        if ($uncertainCount > 0) {
            $message .= "{$uncertainCount} emails need your confirmation (confidence between " . ($confidenceThreshold - 10) . 
            "%-{$confidenceThreshold}%.";
        } else {
            $message .= "No emails need manual confirmation.";
        }

        return $message;
    }
}