<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::middleware('web')->group(function () {
    Route::post('/login', function (Request $request) {
        $credentials = $request->only('email', 'password');
        if (!Auth::guard('web')->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        $request->session()->regenerate();
        return response()->json(['message' => 'Logged in', 'name' => Auth::guard('web')->user()->name]);
    });

    Route::post('/logout', function (Request $request) {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out']);
    });

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
});
