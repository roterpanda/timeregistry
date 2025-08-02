<?php

namespace App\Http\Controllers;


use App\Services\RegisterUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function register(Request $request, RegisterUserService $registerUserService): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'password_c' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json('Validation error during registration.', 422);
        }

        try {
            $input = $request->all();
            $user = $registerUserService->register($input);
            $data['name'] = $user->name;
            $data['message'] = 'User successfully registered';

            return response()->json($data, 201);
        } catch (\Exception $e) {
            return response()->json('Error while registering user', 500);
        }

    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $credentials = $request->only('email', 'password');
        if (!Auth::guard('web')->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        $request->session()->regenerate();
        return response()->json(['message' => 'Logged in', 'name' => Auth::guard('web')->user()->name]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out']);
    }

}
