<?php

declare(strict_types=1);

use App\Http\Controllers\API\UserResourcesController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TimeRegistrationController;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {
    Route::get('user', [UserResourcesController::class, 'getUserData'])
        ->middleware(['auth:sanctum', 'throttle:60,1']);

    Route::apiResource('project', ProjectController::class)->middleware(['auth:sanctum', 'verified', 'throttle:60,1']);

    Route::get('timeregistration/stats', [TimeRegistrationController::class, 'getStats'])->middleware(['auth:sanctum', 'verified', 'throttle:60,1']);

    Route::apiResource('timeregistration', TimeRegistrationController::class)->middleware(['auth:sanctum', 'verified', 'throttle:60,1']);

});

Route::get('export_timereg.csv', [TimeRegistrationController::class, 'streamExport'])->middleware(['auth:sanctum', 'verified', 'throttle:5,1']);


