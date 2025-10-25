<?php

use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/register', [AuthController::class, 'register']);

});

Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification link');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect(rtrim(env('FRONTEND_URL', '/'), '/') . '/email-verified');
    }

    $user->markEmailAsVerified();

    return redirect(env(rtrim('FRONTEND_URL', '/'), '/') . '/email-verified');

})->middleware(['signed'])->name('verification.verify');
