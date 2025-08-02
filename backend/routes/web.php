<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/register', [AuthController::class, 'register']);

});
