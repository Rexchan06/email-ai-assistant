<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GroqService
{
    private $apiKey;
    private $apiUrl;

    public function __construct()
    {
        $this->apiKey = env('GROQ_API_KEY');
        $this->apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    }

    public function classifyEmailsConcurrent($emails, $chunkSize = 5)
    {
        $chunks = array_chunk($emails, $chunkSize);

        $prompts = array_map(function ($chunk) {
            $emailCount = count($chunk);
            $prompt = "ONLY respond with the exact format: category,confidence|category,confidence|...\n";
            $prompt .= "Classify {$emailCount} emails as:\n";
            $prompt .= "- promotions (marketing, sales, deals)\n";
            $prompt .= "- social (social media)\n";
            $prompt .= "- updates (statements, receipts, notifications)\n";
            $prompt .= "- important (security, urgent, financial)\n";
            $prompt .= "with confidence 1-100:\n";
            foreach ($chunk as $index => $email) {
                $prompt .= "Email " . ($index + 1) . ": Subject: \"{$email['subject']}\", From: \"{$email['from']}\"\n";
            }
            $prompt .= "\nReturn format: category,confidence|category,confidence|... (one per email in order)";
            $prompt .= "\nEXAMPLE OUTPUT: promotions,85|social,92|updates,78\n";
            $prompt .= "NO explanations. ONLY the format above:";
            return $prompt;
        }, $chunks);

        $responses = Http::pool(fn ($pool) => 
            array_map(function ($prompt) use ($pool) {
                return $pool->withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json'
                ])->timeout(30)->post($this->apiUrl, [
                    'model' => 'llama-3.1-8b-instant', // Super fast model
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => 0.1,
                    'max_tokens' => 500
                ]);
            }, $prompts)
        );

        $classifiedEmails = [];

        foreach ($responses as $index => $response) {
            if ($response instanceof \Illuminate\Http\Client\ConnectionException || !$response->successful()) {
                // Handle failed requests
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

            $result = $response->json();
            $text = $result['choices'][0]['message']['content'] ?? '';

            // Split the response by | to get individual classifications
            $responseArray = explode('|', $text);

            // Parse each classification and add to results
            $parsedChunk = $this->parseResponses($responseArray, $chunks[$index]);
            $classifiedEmails = array_merge($classifiedEmails, $parsedChunk);
        }

        return $classifiedEmails;
    }

    private function parseResponses($responses, $chunk)
    {
        $finalResponse = [];
        foreach ($responses as $index => $response) {
            $part = explode(',', $response);
            if (count($part) >= 2 && isset($chunk[$index])) {
                $finalResponse[] = [
                    'id' => $chunk[$index]['id'],
                    'subject' => $chunk[$index]['subject'],
                    'from' => $chunk[$index]['from'],
                    'category' => trim($part[0]),
                    'confidence' => (int) trim($part[1]),
                ];
            } else if (isset($chunk[$index])) {
                $finalResponse[] = [
                    'id' => $chunk[$index]['id'],
                    'subject' => $chunk[$index]['subject'],
                    'from' => $chunk[$index]['from'],
                    'category' => 'Unknown',
                    'confidence' => 0,
                ];
            }
        }
        return $finalResponse;
    }
}