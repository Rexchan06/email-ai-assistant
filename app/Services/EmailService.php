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


    public function getConcurrentEmailDetails($messageIds, $chunkSize = 25)
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

    public function fetchEmailsWithDetails($daysOld, $maxResults = 100, $pageToken = null)
    {
        $query = "older_than:{$daysOld}d";
        $fields = "messages(id,payload(headers)),nextPageToken";

        $params = [
            'q' => $query,
            'maxResults' => $maxResults,
            'fields' => $fields
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
            $messages = $data['messages'] ?? [];

            $emailDetails = [];

            foreach ($messages as $message) {
                $headers = $message['payload']['headers'] ?? [];
                $subject = collect($headers)->firstWhere('name', 'Subject')['value'] ?? 'No Subject';
                $from = collect($headers)->firstWhere('name', 'From')['value'] ?? 'Unknown Sender';

                $emailDetails[] = [
                    'id' => $message['id'],
                    'subject' => $subject,
                    'from' => $from
                ];
            }

            return [
                'emailDetails' => $emailDetails,
                'nextPageToken' => null,
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
