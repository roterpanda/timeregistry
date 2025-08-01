<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Models\User;
use App\Services\RegisterUserService;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Cookie;

class AuthController extends BaseController
{

    public function register(Request $request, RegisterUserService $registerUserService): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'password_c' => 'required|same:password',
        ]);

        if($validator->fails()){
            return $this->sendError('Validation failed. Please check your details.', code: 422);
        }

        try {
            $input = $request->all();
            $user = $registerUserService->register($input);
            $data['name'] = $user->name;

            return $this->sendResponse($data, 'User registered successfully.', 201);
        }
        catch (\Exception $e) {
            return $this->sendError('User registration failed.', [$e->getMessage()], 500);
        }

    }


    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if($validator->fails()){
            return $this->sendError('Validation failed. Please check your details.', code: 422);
        }

        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return $this->sendError('Unauthorized', [], 401);
        }

        if (password_verify($credentials['password'], $user->password)) {
            $expiry = now()->addHours(4);
            $data = [
                'token' => $user->createToken('TimeAppLogin', ['access_protected'], $expiry)->plainTextToken,
                'name' => $user->name,
            ];
            return response()->json($data)->withCookie(cookie('token', $data['token'], $expiry->diffInMinutes(), null, null, false, true, false, 'Lax'));
        }
        else {
            return $this->sendError('Unauthorized', [], 401);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->sendResponse([], 'User logged out successfully.');
    }

}
