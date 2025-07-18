<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyRequestSignature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $timestamp = $request->header('X-Request-Timestamp');
        $signature = $request->header('X-Request-Signature');
        $secret = env('FRONTEND_WEB_SECRET');

        if (is_null($secret)) {
            abort(500, 'Server configuration error.');
        }

        $payload = $request->method() . $request->path() . $timestamp;

        $expected_signature = hash_hmac('sha256', $payload, $secret);

        if (is_null($timestamp) || is_null($signature) || !hash_equals($expected_signature, $signature)) {
            abort(403, 'Request denied.');
        }
        return $next($request);
    }
}
