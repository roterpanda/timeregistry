<?php

declare(strict_types=1);

use App\Http\Controllers\API\UserResourcesController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TimeRegistrationController;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {
    Route::get('test', function () {
        return response()->json(['message' => 'API is working!']);
    });

    Route::get('user', [UserResourcesController::class, 'getUserName'])
        ->middleware('auth:sanctum');

    Route::apiResource('project', ProjectController::class)->middleware('auth:sanctum');

    Route::apiResource('timeregistration', TimeRegistrationController::class)->middleware('auth:sanctum');


});


