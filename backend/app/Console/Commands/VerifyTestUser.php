<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class VerifyTestUser extends Command
{
    protected $signature = 'test:verify-user {email}';
    protected $description = 'Verify a test user email';

    public function handle()
    {
        $user = User::where('email', $this->argument('email'))->first();

        if (!$user) {
            $this->error('User not found');
            return 1;
        }

        $user->markEmailAsVerified();
        $this->info("User {$user->email} verified");
        return 0;
    }
}
