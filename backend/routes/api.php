<?php

declare(strict_types=1);

use App\Http\Controllers\API\RegisterController;
use App\Http\Middleware\VerifyRequestSignature;
use Illuminate\Support\Facades\Route;

Route::controller(RegisterController::class)->middleware(VerifyRequestSignature::class)->group(function () {
    Route::post('login', 'login')->name('login');
    Route::post('register', 'register')->name('register');
});


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
