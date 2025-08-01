<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\EmailController;

Route::get('/auth/google', [GoogleAuthController::class, 'apiRedirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'apiCallback']);
Route::post('logout', [GoogleAuthController::class, 'apiLogout'])->middleware('auth:sanctum');
Route::post('/process-email', [EmailController::class, 'processEmail'])->middleware('auth:sanctum');

Route::get('/user', function () {
    return response()->json([
        'name' => auth()->user()->name,
        'email' => auth()->user()->email,
    ]);
})->middleware('auth:sanctum');