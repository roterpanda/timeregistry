<?php

declare(strict_types=1);

use App\Http\Controllers\API\UserResourcesController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {
    Route::get('test', function () {
        return response()->json(['message' => 'API is working!']);
    });

    Route::get('user', [UserResourcesController::class, 'getUserName'])
        ->middleware(['verify.signature', 'auth:sanctum']);

    Route::apiResource('project', ProjectController::class)->middleware(['verify.signature', 'auth:sanctum']);

});


