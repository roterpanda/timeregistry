<?php

namespace App\Http\Controllers;


use App\Models\User;
use App\Services\RegisterUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
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

            $user->sendEmailVerificationNotification();

            return response()->json($data, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error while registering user', 'errors' => $e->getMessage()], 500);
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

        if (!Auth::guard('web')->user()->hasVerifiedEmail()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            return response()->json([
                'message' => 'Please verify your email address.',
                'verified' => false,
            ], 403);
        }

        $request->session()->regenerate();
        return response()->json(['message' => 'Logged in', 'name' => Auth::guard('web')->user()->name]);
    }

    public function verifyEmail(Request $request, int $id, string $hash): RedirectResponse
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string)$hash, sha1($user->getEmailForVerification()))) {
            return redirect(to: rtrim(config('app.frontend_url'), '/') . '/verify-email?status=invalid');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect(to: rtrim(config('app.frontend_url'), '/') . '/verify-email?status=already_verified');
        }

        $user->markEmailAsVerified();

        return redirect(to: rtrim(config('app.frontend_url'), '/') . '/email-verified');
    }

    public function resendVerificationEmail(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();
        $user?->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification email sent if user exists.']);

    }

    public function changePassword(Request $request): JsonResponse
    {
        $validator = Validator::make(['password' => $request->password], [
            'password' => 'required|min:10',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $user = Auth::guard('web')->user();
        if (!$user) {
            return response()->json('User not recognized or unauthorized', 403);
        }
        $user->password = bcrypt($request->password);
        $user->save();
        return response()->json(['message' => 'Password changed successfully.']);
    }


    public function sendPasswordResetLink(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT ?
            response()->json(['message' => __($status)])
            : response()->json(['error' => __($status)], 422);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:10|confirmed:password_confirmation',
        ]);

        $response = Password::reset($request->only('email', 'password', 'token'), function ($user, $password) {
            $user->forceFill([
                'password' => bcrypt($password),
            ])->save();
        });

        if ($response == Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully.']);
        }

        return response()->json(['message' => 'Invalid token or email.'], 422);
   }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out']);
    }

}
