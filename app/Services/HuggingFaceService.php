<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;

class HuggingFaceService
{
    private $apiKey;
    private $modelUrl;
    private $groqService;
    private $geminiService;

    public function __construct()
    {
        $this->apiKey = env('HUGGINGFACE_API_KEY');
        $this->modelUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
        $this->groqService = new GroqService(); // Primary fast service
        $this->geminiService = new GeminiService(); // Final fallback
    }

    public function classifyEmailsConcurrent($emails, $chunkSize = 10)
    {
        // Try Groq first (fastest)
        try {
            return $this->groqService->classifyEmailsConcurrent($emails, $chunkSize);
        } catch (Exception $e) {
            // Groq failed, try HuggingFace
        }

        // Fallback to HuggingFace
        try {
            $classifiedEmails = $this->processWithHuggingFace($emails, $chunkSize);
            
            // If we got results for all emails, return them
            if (count($classifiedEmails) === count($emails)) {
                return $classifiedEmails;
            }
        } catch (Exception $e) {
            // HuggingFace failed too
        }

        // Final fallback to Gemini
        try {
            return $this->geminiService->classifyEmailsConcurrent($emails, 5);
        } catch (Exception $e) {
            // All services failed, return fallback results
            return $this->fallbackResults($emails);
        }
    }

    private function processWithHuggingFace($emails, $chunkSize)
    {
        $chunks = array_chunk($emails, $chunkSize);
        
        // Create concurrent requests using Laravel's Http::pool
        $responses = Http::pool(fn ($pool) => 
            array_map(function ($chunk) use ($pool) {
                // For each chunk, we'll process emails individually but concurrently
                return array_map(function ($email) use ($pool) {
                    $emailText = "Subject: {$email['subject']}, From: {$email['from']}";
                    
                    return $pool->withHeaders([
                        'Authorization' => "Bearer {$this->apiKey}",
                        'Content-Type' => 'application/json'
                    ])->timeout(30)->post($this->modelUrl, [
                        'inputs' => $emailText,
                        'parameters' => [
                            'candidate_labels' => ['promotion', 'social', 'update', 'important']
                        ]
                    ]);
                }, $chunk);
            }, $chunks)
        );

        $classifiedEmails = [];

        // Process responses
        foreach ($responses as $chunkIndex => $chunkResponses) {
            foreach ($chunkResponses as $emailIndex => $response) {
                $email = $chunks[$chunkIndex][$emailIndex];
                
                if ($response instanceof \Illuminate\Http\Client\ConnectionException || !$response->successful()) {
                    // Skip failed emails - they'll be handled by fallback
                    continue;
                }

                $result = $response->json();
                
                // Extract top classification
                $topLabel = $result['labels'][0] ?? 'Unknown';
                $topScore = ($result['scores'][0] ?? 0) * 100;

                $classifiedEmails[] = [
                    'id' => $email['id'],
                    'subject' => $email['subject'],
                    'from' => $email['from'],
                    'category' => ucfirst($topLabel),
                    'confidence' => (int) round($topScore),
                ];
            }
        }

        return $classifiedEmails;
    }

    private function fallbackResults($emails)
    {
        $fallbackResult = [];
        foreach ($emails as $email) {
            $fallbackResult[] = [
                'id' => $email['id'],
                'subject' => $email['subject'],
                'from' => $email['from'],
                'category' => 'Unknown',
                'confidence' => 0,
            ];
        }
        return $fallbackResult;
    }
}