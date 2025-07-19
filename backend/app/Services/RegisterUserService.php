<?php

namespace App\Services;

use App\Models\User;

class RegisterUserService
{

    /**
     * @param array $validatedData
     * @return User
     * @throws \Exception
     */
    public function register(array $validatedData): User
    {
        $validatedData['password'] = bcrypt($validatedData['password']);
        $validatedData['name'] = strip_tags($validatedData['name']);
        if (empty($validatedData['name'])) {
            throw new \Exception('User name cannot be empty');
        }
        return User::create($validatedData);
    }

}
