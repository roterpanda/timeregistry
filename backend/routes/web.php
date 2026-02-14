<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TimeRegistrationController;
use App\Models\User;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/register', [AuthController::class, 'register']);

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['signed'])->name('verification.verify');

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])->middleware(['throttle:6,1'])->name('verification.send');

Route::post('/password/change', [AuthController::class, 'changePassword'])->middleware(['throttle:6,1'])->name('password.change');

Route::post('/password/email', [AuthController::class, 'sendPasswordResetLink'])->middleware(['throttle:6,1'])->name('password.email');

Route::post('/password/reset', [AuthController::class, 'resetPassword'])->middleware(['throttle:6,1'])->name('password.reset');

Route::delete('/account', [AuthController::class, 'deleteAccount'])->middleware(['auth:sanctum']);
