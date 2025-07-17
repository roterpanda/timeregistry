<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PHPUnit\Event\Runtime\PHP;

class BaseController extends Controller
{

    public function verifyRequest(Request $request): void
    {
        $timestamp = $request->header('X-Request-Timestamp');
        $signature = $request->header('X-Request-Signature');
        $secret = env('FRONTEND_WEB_SECRET');

        $payload = $request->method() . $request->path() . $timestamp;

        $expected_signature = hash_hmac('sha256', $payload, $secret);

        if (is_null($timestamp) || is_null($signature) || !hash_equals($expected_signature, $signature)) {
            abort(403, 'Invalid signature');
        }
    }

    public function sendResponse($result, $message, $code = 200): JsonResponse
    {
        $response = [
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];

        return response()->json($response, $code);
    }

    // return error response
    public function sendError($error, $errorMessages = [], $code = 404): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if(!empty($errorMessages)){
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }
}
