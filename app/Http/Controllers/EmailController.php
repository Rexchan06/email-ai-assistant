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
        set_time_limit(600);
        $startTime = microtime(true);
        $user = auth()->user();
        $data = $request->validate([
            'daysOld' => 'required|integer|min:1',
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

        $cumulativeTimings = [
            'fetch_emails' => 0,
            'get_email_details' => 0,
            'ai_classification' => 0,
            'batch_delete' => 0,
            'total_time' => 0
        ];

        $totalClassifiedEmails = [];
        $totalSuccessfulDeletions = [];
        $totalUncertainEmails = [];
        $totalFailedDeletions = [];
        $nextPageToken = null;
        $batchNumber = 1;

        do {
            $fetchStart = microtime(true);
            $emails = $emailService->fetchEmails(data_get($data, 'daysOld'), 50, $nextPageToken);
            $messages = $emails['messages'];
            $nextPageToken = $emails['nextPageToken'];
            $cumulativeTimings['fetch_emails'] += round((microtime(true) - $fetchStart) * 1000, 2);
            
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
            $cumulativeTimings['get_email_details'] += round((microtime(true) - $detailsStart) * 1000, 2);

            $classifyStart = microtime(true);
            $classifiedEmails = $this->getClassifiedEmailsConcurrent($aiService, $emailDetails);
            $cumulativeTimings['ai_classification'] += round((microtime(true) - $classifyStart) * 1000, 2);
            
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

            $totalClassifiedEmails = array_merge($totalClassifiedEmails, $classifiedEmails);
            $totalSuccessfulDeletions = array_merge($totalSuccessfulDeletions, $successfulDeletion);
            $totalUncertainEmails = array_merge($totalUncertainEmails, $uncertainEmails);   
            $totalFailedDeletions = array_merge($totalFailedDeletions, $failedDeletion);
            
            // DEBUG: Add to debugInfo after the if block  
            $debugInfo['batchResponse'] = $response;
            $debugInfo['autoDeleteIds'] = array_column($autoDelete, 'id');
            $debugInfo['autoDeleteSample'] = $autoDelete[0] ?? null;
            $debugInfo['successfulDeletionSample'] = $successfulDeletion[0] ?? null;
            
            $cumulativeTimings['batch_delete'] += round((microtime(true) - $deleteStart) * 1000, 2);
            $batchNumber++;

        } while ($nextPageToken && $batchNumber < 41);
        
        $cumulativeTimings['total_time'] += round((microtime(true) - $startTime) * 1000, 2);

        $summaryMessage = $this->generateSummary($totalClassifiedEmails, $totalSuccessfulDeletions, $totalUncertainEmails, $category, $confidenceThreshold);
        $payload = [
            // Primary data (what users care about)
            'summary' => $summaryMessage,
            'metrics' => [
                'totalProcessed' => count($totalClassifiedEmails),
                'deletedCount' => count($totalSuccessfulDeletions),
                'uncertainCount' => count($totalUncertainEmails),
                'failedCount' => count($totalFailedDeletions),
                'processingTimeMs' => $cumulativeTimings['total_time']
            ],
            'emails' => [
                'deleted' => $totalSuccessfulDeletions,
                'uncertain' => $totalUncertainEmails,
                'failed' => $totalFailedDeletions
            ],
            // Debug info (for developers)
            'debug' => [
                'sampleClassified' => array_slice($totalClassifiedEmails, 0, 2),
                'requestedCategory' => $category,
                'requestedConfidence' => $confidenceThreshold,
                'detailedTimings' => $cumulativeTimings,
                'errorMessage' => data_get($response, 'error'),
                'deletionDebug' => $debugInfo,
                'classifiedEmails' => $totalClassifiedEmails
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
            $matchesCategory = strtolower($email['category']) == strtolower($category);
            $meetsConfidence = $email['confidence'] >= $confidenceThreshold;

            $isSafe = $this->isSafeToDelete($email); 

            return $matchesCategory && $meetsConfidence && $isSafe;
        })->values()->toArray();
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

    private function isSafeToDelete($email)
    {
        $subject = strtolower($email['subject'] ?? '');
        $from = strtolower($email['from'] ?? '');

        $criticalKeywords = [
          // Security & Authentication
          'security', 'alert', 'verification', 'verify', 'suspicious', 'login', 'password',
          'account locked', 'account suspended', 'unauthorized', 'breach', 'compromised',
          'phishing', 'fraud', 'scam', '2fa', 'two-factor', 'authentication', 'otp',
          'reset', 'recovery', 'backup codes', 'device', 'location', 'ip address',

          // Financial & Legal
          'statement', 'invoice', 'receipt', 'tax', 'refund', 'payment', 'billing',
          'legal', 'court', 'lawsuit', 'contract', 'agreement', 'terms', 'policy',
          'bank', 'credit', 'debit', 'transaction', 'balance', 'overdraft', 'loan',
          'mortgage', 'insurance', 'claim', 'premium', 'renewal', 'cryptocurrency',
          'crypto', 'wallet', 'withdrawal', 'deposit', 'irs', 'audit',

          // System & Technical
          'delivery failure', 'undelivered', 'bounce', 'mailer-daemon', 'postmaster',
          'error', 'failed', 'exception', 'system', 'server', 'maintenance',
          'downtime', 'backup', 'sync', 'update required', 'upgrade',

          // Urgent & Time-sensitive
          'urgent', 'immediate action', 'expire', 'deadline', 'due', 'overdue',
          'reminder', 'final notice', 'last chance', 'expires today', 'act now',
          'time sensitive', 'asap', 'emergency', 'critical',

          // Work & Professional
          'interview', 'job', 'offer', 'application', 'resume', 'cv', 'hiring',
          'meeting', 'conference', 'zoom', 'teams', 'calendar', 'appointment',
          'deadline', 'project', 'client', 'contract', 'proposal',

          // Health & Medical
          'medical', 'doctor', 'appointment', 'health', 'prescription', 'pharmacy',
          'lab results', 'test results', 'vaccination', 'vaccine', 'hospital',
          'clinic', 'dental', 'insurance', 'medicare', 'medicaid',

          // Personal Important
          'family', 'emergency', 'travel', 'flight', 'booking', 'reservation',
          'confirmation', 'ticket', 'visa', 'passport', 'immigration',
          'shipping', 'delivery', 'package', 'order', 'return',

          // Education & Government
          'university', 'college', 'school', 'grade', 'transcript', 'diploma',
          'government', 'irs', 'tax', 'dmv', 'social security', 'visa', 'permit'
        ];

        foreach ($criticalKeywords as $keyword) {
            if (strpos($subject, $keyword) !== false || strpos($from, $keyword) !== false) {
                return false;
            }
        }

        $trustedDomains = [
            // Major Tech Companies
          'google.com', 'gmail.com', 'accounts.google.com', 'googlemail.com',
          'apple.com', 'icloud.com', 'me.com', 'microsoft.com', 'outlook.com',
          'amazon.com', 'aws.amazon.com',

          // Financial Services
          'paypal.com', 'stripe.com', 'square.com', 'venmo.com', 'zelle.com',
          'bank', 'banking', 'credit', 'visa.com', 'mastercard.com',
          'americanexpress.com', 'discover.com', 'chase.com', 'wellsfargo.com',
          'bankofamerica.com', 'citi.com', 'capitalone.com',

          // Government & Official
          'gov', '.gov.', 'irs.gov', 'usps.com', 'fedex.com', 'ups.com',
          'dhl.com', 'government', 'official',

          // Healthcare & Insurance
          'insurance', 'healthcare', 'medical', 'pharmacy', 'cvs.com',
          'walgreens.com', 'medicare.gov', 'medicaid',

          // Education
          'edu', '.edu.', 'university', 'college', 'school',

          // Utilities & Services
          'electric', 'gas', 'water', 'internet', 'phone', 'cellular',
          'verizon.com', 'att.com', 't-mobile.com', 'sprint.com',

          // Travel & Transportation
          'airline', 'airport', 'hotel', 'booking.com', 'expedia.com',
          'airbnb.com', 'uber.com', 'lyft.com', 'grab.com'
        ];

        foreach ($trustedDomains as $domain) {
            if (strpos($from, $domain) !== false) {
                return false;
            }
        }

        return true;
    }
}