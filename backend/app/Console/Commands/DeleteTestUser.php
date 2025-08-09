<?php

namespace App\Console\Commands;
use App\Models\User;
use Illuminate\Console\Command;

class DeleteTestUser extends Command
{
    protected $signature = 'test:cleanup-users {email}';
    protected $description = 'Delete test users by email';

    public function handle(): void
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if ($user) {
            $user->delete();
            $this->info("Test user deleted: {$email}");
        } else {
            $this->info("Test user not found: {$email}");
        }
    }
}
