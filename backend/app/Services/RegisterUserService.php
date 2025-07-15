<?php

namespace App\Services;

use App\Models\User;

class RegisterUserService
{

    public function register(array $validatedData): User
    {
        return User::create($validatedData);
    }

}
