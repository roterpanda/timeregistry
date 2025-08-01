<?php

declare(strict_types=1);

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserResourcesController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])
    ->middleware(['verify.signature'])
    ->name('login');

Route::post('register', [AuthController::class, 'register'])
    ->middleware(['verify.signature'])
    ->name('register');

Route::post('logout', [AuthController::class, 'logout'])
    ->middleware(['auth:sanctum', 'verify.signature'])
    ->name('logout');


Route::prefix('v1')->group(function () {
    Route::get('test', function () {
        return response()->json(['message' => 'API is working!']);
    });

    Route::get('protected', [UserResourcesController::class, 'getUserName'])
        ->middleware(['verify.signature', 'auth:sanctum']);

});


