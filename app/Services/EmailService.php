<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;

class EmailService
{

    private $token;

    public function __construct($googleToken)
    {
        $this->token = $googleToken;
    }

    public function fetchEmails($daysOld, $maxResults = 100, $pageToken = null) 
    {
        $query = "older_than:{$daysOld}d";

        $params = [
            'q' => $query,
            'maxResults' => $maxResults,
        ];

        if ($pageToken) {
            $params['pageToken'] = $pageToken;
        }

        try {
            $response = Http::withToken($this->token)
                ->timeout(30)
                ->get('https://gmail.googleapis.com/gmail/v1/users/me/messages', $params);

            if (!$response->successful()) {
                return $this->handleApiError($response);
            }

            $data = $response->json();

            return [
                'messages' => $data['messages'] ?? [],
                'nextPageToken' => $data['nextPageToken'] ?? null,
                'resultSizeEstimate' => $data['resultSizeEstimate'] ?? 0
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Network error: ' . $e->getMessage(),
                'messages' => [],
                'nextPageToken' => null,
                'resultSizeEstimate' => 0
            ];
        }
    }

    public function getEmailDetails($messageId)
    {
        try {
            $detailResponse = Http::withToken($this->token)
                ->timeout(30)
                ->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$messageId}");

            if (!$detailResponse->successful()) {
                return $this->handleApiError($detailResponse);
            }

            $emailData = $detailResponse->json();

            $headers = $emailData['payload']['headers'] ?? [];
            $subject = collect($headers)->firstWhere('name', 'Subject')['value'] ?? 'No Subject';
            $from = collect($headers)->firstWhere('name', 'From')['value'] ?? 'Unknown Sender';

            return [
                'id' => $messageId,
                'subject' => $subject,
                'from' => $from,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Network error: ' . $e->getMessage(),
                'id' => null,
                'subject' => null,
                'from' => null,
            ];
        }
    }

    // public function getBatchEmailDetails($messageIds)
    // {
    //     file_put_contents('debug.txt', "=== Batch method called with " . count($messageIds) . " IDs ===\n", FILE_APPEND);
        
    //     try {
    //         $boundary = 'batch_' . uniqid();
    //         $batchBody = '';
            
    //         foreach ($messageIds as $index => $messageId) {
    //             $batchBody .= "--{$boundary}\r\n";
    //             $batchBody .= "Content-Type: application/http\r\n";
    //             $batchBody .= "Content-ID: <item" . ($index + 1) . ":request@gmail.googleapis.com>\r\n\r\n";
    //             $batchBody .= "GET /gmail/v1/users/me/messages/{$messageId}?format=metadata\r\n\r\n";
    //         }

    //         $batchBody .= "--{$boundary}--";

    //         file_put_contents('debug.txt', "Request body preview:\n" . substr($batchBody, 0, 500) . "\n===END PREVIEW===\n", FILE_APPEND);

    //         $responses = Http::withHeaders([
    //             'Authorization' => 'Bearer ' . $this->token,
    //             'Host' => 'gmail.googleapis.com',
    //             'Content-Type' => 'multipart/mixed; boundary=' . $boundary
    //             ])->timeout(30)
    //             ->post('https://gmail.googleapis.com/batch', $batchBody);

    //         file_put_contents('debug.txt', "Batch API call completed. Status: " . $responses->status() . "\n", FILE_APPEND);
            
    //         if (!$responses->successful()) {
    //             file_put_contents('debug.txt', "API call failed with status: " . $responses->status() . "\n", FILE_APPEND);
    //             file_put_contents('debug.txt', "Error response: " . $responses->body() . "\n", FILE_APPEND);
    //             return $this->handleApiError($responses);
    //         }
                        
    //         $responseBody = $responses->body();
    //         file_put_contents('debug.txt', "Response body length: " . strlen($responseBody) . "\n", FILE_APPEND);

    //         $pattern = '/\{"id":"[^"]+",.*?\}/s';
    //         preg_match_all($pattern, $responseBody, $matches);
    //         file_put_contents('debug.txt', "Regex found " . count($matches[0]) . " potential JSON matches\n", FILE_APPEND);
            
    //         $emailDatas = [];

    //         foreach ($matches[0] as $potentialJson) {
    //             $decoded = json_decode($potentialJson, true);
    //             if ($decoded && isset($decoded['id'])) {
    //                 $emailDatas[] = $decoded;
    //             }
    //         }

    //         $emailDetails = [];

    //         foreach ($emailDatas as $emailData) {
    //             $headers = $emailData['payload']['headers'] ?? [];
    //             $subject = collect($headers)->firstWhere('name', 'Subject')['value'] ?? 'No Subject';
    //             $from = collect($headers)->firstWhere('name', 'From')['value'] ?? 'Unknown Sender';
    //             $emailDetails[] = [
    //                 'id' => $emailData['id'],
    //                 'subject' => $subject,
    //                 'from' => $from,
    //             ];
    //         }
            
    //         file_put_contents('debug.txt', "Final result: " . count($emailDetails) . " email details created\n", FILE_APPEND);
    //         return $emailDetails;
    //     } catch (Exception $e) {
    //         file_put_contents('debug.txt', "EXCEPTION: " . $e->getMessage() . " in " . $e->getFile() . " at line " . $e->getLine() . "\n", FILE_APPEND);
    //         $emailDetails = [];

    //         foreach ($messageIds as $message) {
    //             $emailDetails[] = [
    //                 'success' => false,
    //                 'error' => 'Network error: ' . $e->getMessage(),
    //                 'id' => null,
    //                 'subject' => null,
    //                 'from' => null,
    //             ];
    //         }

    //         // Add this to see what went wrong:
    //         return [
    //             'emails' => $emailDetails,
    //             'debug' => [
    //                 'error' => true,
    //                 'exception_message' => $e->getMessage(),
    //                 'exception_file' => $e->getFile(),
    //                 'exception_line' => $e->getLine()
    //             ]
    //         ];
    //     }
    // }

    public function getConcurrentEmailDetails($messageIds, $chunkSize = 15)
    {
        $chunks = array_chunk($messageIds, $chunkSize);
        $allEmailDetails = [];
        
        foreach ($chunks as $chunk) {
            // Make concurrent calls for this chunk
            $responses = Http::pool(fn ($pool) => [
                // Use array_map to create requests for each messageId
                ...array_map(function($messageId) use ($pool) {
                    return $pool->withToken($this->token)
                                ->timeout(30)
                                ->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$messageId}");
                }, $chunk)
            ]);
            
            // Process the responses for this chunk
            $chunkResults = $this->processChunkResponses($responses, $chunk);
            $allEmailDetails = array_merge($allEmailDetails, $chunkResults);
        }
        
        return $allEmailDetails;
    }

    private function processChunkResponses($responses, $chunk)
    {
        $chunkResults = [];
        
        foreach ($responses as $index => $response) {
            $messageId = $chunk[$index]; // Match response to message ID
            
            if ($response->successful()) {
                // Extract email details like in getEmailDetails()
                $emailData = $response->json();
                $headers = $emailData['payload']['headers'] ?? [];
                $subject = collect($headers)->firstWhere('name', 'Subject')['value'] ?? 'No Subject';
                $from = collect($headers)->firstWhere('name', 'From')['value'] ?? 'Unknown Sender';
                
                $chunkResults[] = [
                    'id' => $messageId,
                    'subject' => $subject,
                    'from' => $from,
                ];
            } else {
                // Handle failed requests
                $chunkResults[] = [
                    'success' => false,
                    'error' => 'API call failed',
                    'id' => $messageId,
                    'subject' => null,
                    'from' => null,
                ];
            }
        }
        
        return $chunkResults;
    }

    public function deleteEmail($messageId) 
    {
        try {
            $response = Http::withToken($this->token)
                ->timeout(30)
                ->post("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$messageId}/trash");
            
            if (!$response->successful()) {
                return $this->handleApiError($response);
            }

            return [
                'success' => true,
                'message' => 'Email deleted successfully'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Network error: ' . $e->getMessage()
            ];
        }
    }

    public function batchMoveToTrash($emails) 
    {
        $messageIds = array_column($emails, 'id');

        try {
            $response = Http::withToken($this->token)
                ->timeout(60)
                ->post('https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify', [
                    'ids' => $messageIds,
                    'addLabelIds' => ['TRASH'],
                    'removeLabelIds' => ['INBOX']
                ]);

            if (!$response->successful()) {
                return [
                    'succeeded' => [],
                    'failed' => $emails,
                    'error' => 'Error: ' . $response->body()
                ];
            }

            return [
                'succeeded' => $emails,
                'failed' => [],
                'message' => 'Batch operation completed'
            ];
        } catch (Exception $e) {
            return [
                'succeeded' => [],
                'failed' => $emails,
                'error' => 'Network error: ' . $e->getMessage()
            ];
        }
    }

    private function handleApiError($response) 
    {
        $errorMessages = [
            401 => 'Google token expired. Please login again',
            403 => 'Gmail access denied. Check permissions.',
            429 => 'Rate limit exceeded. Please wait before retrying.',
            500 => 'Gmail service temporarily unavailable.',
        ];

        $status = $response->status();
        $message = $errorMessages[$status] ?? "Gmail API error (HTTP {$status})";

        return [
            'success' => false,
            'error' => $message,
            'messages' => [],
            'nextPageToken' => null,
            'resultSizeEstimate' => 0
        ];
    }
}
