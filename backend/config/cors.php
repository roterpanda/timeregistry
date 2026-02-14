<?php


// config/cors.php

return [

    'paths' => ['api/*', 'api/v1/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'email/verify/*', 'email/resend', 'password/change', 'password/email', 'password/reset'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Authorization', 'X-CSRF-TOKEN', 'X-XSRF-TOKEN', 'X-Requested-With', 'Accept'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
