<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Models\User;
use App\Services\RegisterUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends BaseController
{

    public function register(Request $request, RegisterUserService $registerUserService): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
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

            $data['token'] = $user->createToken('TimeApp')->plainTextToken;
            $data['name'] = $user->name;

            return $this->sendResponse($data, 'User registered successfully.', 201);
        }
        catch (\Exception $e) {
            return $this->sendError('User registration failed.', [$e->getMessage()], 500);
        }

    }


    public function login(Request $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {
            /** @var User $user */
            $user = auth()->user();
            $data = [
                'token' => $user->createToken('TimeApp')->plainTextToken,
                'name' => $user->name,
            ];
            return $this->sendResponse($data, 'User logged in successfully.');
        }
        else {
            return $this->sendError('Unauthorised', ['error' => 'Invalid credentials'], 401);
        }
    }

}
