<?php

use App\Http\Controllers\EmailController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/google/', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
Route::get('auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth')->name('dashboard');

// Route::get('/test-gmail', [GoogleAuthController::class, 'testGmail'])->middleware('auth');
// Route::get('/test-gmail-details', [GoogleAuthController::class, 'testGmailDetails'])->middleware('auth');
// Route::get('/test-gemini', [GoogleAuthController::class, 'testGemini'])->middleware('auth');

// Route::post('/process-email', [EmailController::class, 'processEmail'])->middleware('auth')->name('email.process');
Route::post('/logout', [GoogleAuthController::class, 'logout'])->middleware('auth')->name('logout');

