<?php

declare(strict_types=1);

use App\Http\Controllers\API\UserResourcesController;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {
    Route::get('test', function () {
        return response()->json(['message' => 'API is working!']);
    });

    Route::get('protected', [UserResourcesController::class, 'getUserName'])
        ->middleware(['verify.signature', 'auth:sanctum']);

});


