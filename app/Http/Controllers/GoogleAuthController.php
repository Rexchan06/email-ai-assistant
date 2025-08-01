<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Http\Request;

class GoogleAuthController extends Controller
{
    public function testGmail() {
        $user = auth()->user();

        if (!$user->google_token) {
            return "No Google token found. Please login with Google first.";
        }

        $response = Http::withToken($user->google_token)
            ->get('https://gmail.googleapis.com/gmail/v1/users/me/messages', [
                'maxResults' => 5
            ]);

        return response()->json($response->json());
    }

    public function testGmailDetails() {
        $user = auth()->user();

        $messagesResponse = Http::withToken($user->google_token)
            ->get('https://gmail.googleapis.com/gmail/v1/users/me/messages', [
                'maxResults' => 10
            ]);

        $messages = $messagesResponse->json()['messages'] ?? [];
        $emailDetails = [];

        foreach ($messages as $message) {
            $messageId = $message['id'];

            $detailResponse = Http::withToken($user->google_token)
                ->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$messageId}");

            $emailData = $detailResponse->json();

            $headers = $emailData['payload']['headers'] ?? [];
            $subject = collect($headers)->firstWhere('name', 'Subject')['value'] ?? 'No Subject';
            $from = collect($headers)->firstWhere('name', 'From')['value'] ?? 'Unknown Sender';

            $emailDetails[] = [
                'id' => $messageId,
                'subject' => $subject,
                'from' => $from,
            ];
        }
        
        return response()->json($emailDetails);
    }

    public function redirect() {
        return Socialite::driver('google')
            ->scopes(['email', 'profile', 'https://www.googleapis.com/auth/gmail.modify'])
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function callback() {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('email', $googleUser->email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'google_token' => $googleUser->token,
            ]);
        } else {
            $user->update([
                'google_id' => $googleUser->id,
                'google_token' => $googleUser->token,
            ]);
        }

        Auth::login($user);

        return redirect('http://localhost:5173/dashboard');
    }

    public function logout() {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect('/');
    }

    public function apiRedirect() 
    {
        $url = Socialite::driver('google')
            ->stateless()
            ->redirectUrl('http://localhost:8000/api/auth/google/callback')
            ->scopes(['email', 'profile', 'https://www.googleapis.com/auth/gmail.modify'])
            ->with(['prompt' => 'select_account'])
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function apiCallback() 
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
              $user = User::create([
                  'name' => $googleUser->name,
                  'email' => $googleUser->email,
                  'google_id' => $googleUser->id,
                  'google_token' => $googleUser->token,
              ]);  
            } else {
              $user->update([
                  'google_id' => $googleUser->id,
                  'google_token' => $googleUser->token,
              ]);
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            $redirectUrl = 'http://localhost:5173/auth/callback?' . http_build_query([
                'token' => $token,
                'name' => $user->name,
                'email' => $user->email,
            ]);

            return redirect($redirectUrl);
        } catch (\Exception $e) {
            // Add detailed error logging
            \Log::error('OAuth Callback Error: ' . $e->getMessage());
            \Log::error('OAuth Callback Trace: ' . $e->getTraceAsString());
            return redirect('http://localhost:5173/auth/error?message=' . urlencode('Authentication failed'));
        }
    }

    public function apiLogout(Request $request) {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Logout failed'], 500);
        }
    }
}
