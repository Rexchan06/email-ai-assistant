<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;

class GeminiService
{

    private $apiKey;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
    }

    public function classifyEmail($subject, $from) {
        try {
            $prompt = "Classify this email as Promotion, Social, Update or Important. Email: Subject: {$subject}, From: {$from}. Reply with just the category and confidence (0-100).";

            $response = $this->callGemini($prompt);
            
            if (!$response->successful()) {
                return ['category' => 'Unknown', 'confidence' => 0];
            }

            $result = $response->json();
            $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? 'Unknown, 0';

            [$category, $confidence] = explode(',', $text);

            return [
                'category' => trim($category),
                'confidence' => (int) trim($confidence)
            ];
        } catch (\Exception $e) {
            return ['category' => 'Unknown', 'confidence' => 0];
        }
    }

    public function classifyEmailsBatch($emails) {
        $maxAttempts = 2;
        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                $emailCount = count($emails);
                $prompt = "Classify {$emailCount} of these emails into either (Promotion, Social, Update or Important) and also your confidence (1-100).";
                foreach ($emails as $index => $email) {
                    $prompt .= "\nEmail " . ((int) $index + 1) . ": Subject: \"{$email['subject']}\", From: \"{$email['from']}\"\n";
                }

                $prompt .= "\nReturn format: category,confidence|category,confidence|... (one per email in order)";

                $response = $this->callGemini($prompt);

                if (!$response->successful()) {
                    if ($attempt == $maxAttempts) {
                        return $this->fallbackResults($emails);
                    }
                    continue;
                };

                $result = $response->json();
                $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? 'Unknown, 0';

                $responses = explode('|', $text);
                
                if (count($responses) == $emailCount) {
                    return $this->parseResponses($responses);
                }
                
                if ($attempt == $maxAttempts) {
                    return $this->fallbackResults($emails);
                }
            } catch (Exception $e) {
                if ($attempt == $maxAttempts) {
                    return $this->fallbackResults($emails);
                }
            }
        }
    }

    public function classifyEmailsConcurrent($emails, $chunkSize = 5)
    {
        $chunks = array_chunk($emails, $chunkSize);

        $prompts = array_map(function ($chunk) {
            $emailCount = count($chunk);
            $prompt = "Classify as promotions/social/updates/important with confidence 1-100:";
            foreach ($chunk as $index => $email) {
                $prompt .= "Subject: \"{$email['subject']}\", From: \"{$email['from']}\"\n";
            }
            $prompt .= "\nReturn format: category,confidence|category,confidence|... (one per email in order)";
            return $prompt;
        }, $chunks);

        $responses = Http::pool(fn ($pool) => [
            ...array_map(function ($prompt) use ($pool) {
                return $pool->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$this->apiKey}", [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]);
            }, $prompts)
        ]);

        $classifiedEmails = [];

        foreach ($responses as $index => $response) {
            if ($response instanceof \Illuminate\Http\Client\ConnectionException) {
              // Handle connection error - add fallback classifications for this chunk
              foreach ($chunks[$index] as $email) {
                  $classifiedEmails[] = [
                      'id' => $email['id'],
                      'subject' => $email['subject'],
                      'from' => $email['from'],
                      'category' => 'Unknown',
                      'confidence' => 0,
                  ];
              }
              continue;
            }
            if ($response->successful()) {
                // Extract the text from Gemini response (same as your batch method)
                $result = $response->json();
                $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
                
                // Split the response by | to get individual classifications
                $responseArray = explode('|', $text);
                
                // Parse each classification and add to results
                $parsedChunk = $this->parseResponses($responseArray, $chunks[$index]);
                $classifiedEmails = array_merge($classifiedEmails, $parsedChunk);
            }
        }

        return $classifiedEmails;
    }

    private function parseResponses($responses, $chunk) 
    {
        $finalResponse = [];
        foreach ($responses as $index => $response) {
            $part = explode(',', $response);
            if (count($part) >= 2) {
                $finalResponse[] = [
                    'id' => $chunk[$index]['id'],
                    'subject' => $chunk[$index]['subject'],  // ✅ Preserve original subject
                    'from' => $chunk[$index]['from'],        // ✅ Preserve original from
                    'category' => trim($part[0]),
                    'confidence' => (int) trim($part[1]),
                ];
            } else {
                $finalResponse[] = [
                    'id' => $chunk[$index]['id'],
                    'subject' => $chunk[$index]['subject'],  // ✅ Preserve original subject
                    'from' => $chunk[$index]['from'],        // ✅ Preserve original from
                    'category' => 'Unknown',
                    'confidence' => 0,
                ];
            }
        }
        return $finalResponse;
    }

    private function fallbackResults($emails)
    {
        $fallbackResult = [];
        foreach ($emails as $email) {
            $fallbackResult[] = [
                'category' => 'Unknown',
                'confidence' => 0,
            ];
        }
        return $fallbackResult;
    }

    // public function generateSummary($autoDeleted, $needsConfirmation) {
    //     $prompt = "Summarize this email cleaning session. I automatically deleted " . count($autoDeleted) . " emails and need confirmation for "
    //     . count($needsConfirmation) . " emails. Create a friendly summary for the user.";

    //     $response = $this->callGemini($prompt);
    //     $result = $response->json();
        
    //     return $result['candidates'][0]['content']['parts'][0]['text'] ?? 'Summary unavailable';
    // }

    private function callGemini($prompt) {
        return Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$this->apiKey}", [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);
    }
}
