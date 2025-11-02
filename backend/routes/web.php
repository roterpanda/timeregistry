<?php

use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/register', [AuthController::class, 'register']);

Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification link');
    }

    if ($user->hasVerifiedEmail()) {
        return json_encode(['message' => 'Email already verified']);
    }

    $user->markEmailAsVerified();

    return json_encode(['message' => 'Email verified successfully']);

})->middleware(['signed'])->name('verification.verify');


Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])->middleware(['throttle:6,1'])->name('verification.send');
