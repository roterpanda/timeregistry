<?php

declare(strict_types=1);

use App\Http\Controllers\API\AuthController;
use App\Http\Middleware\VerifyRequestSignature;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])
    ->middleware(['verify.signature', 'throttle:60,1'])
    ->name('login');

Route::post('register', [AuthController::class, 'register'])
    ->middleware(['verify.signature', 'throttle:60,1'])
    ->name('register');

Route::post('logout', [AuthController::class, 'logout'])
    ->middleware(['auth:sanctum', 'verify.signature', 'throttle:60,1'])
    ->name('logout');


Route::prefix('v1')->group(function () {
    Route::get('test', function () {
        return response()->json(['message' => 'API is working!']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('protected', function () {
            return response()->json(['message' => 'This is a protected route!']);
        });
    });
});
