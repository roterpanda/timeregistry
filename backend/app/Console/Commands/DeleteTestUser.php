<?php

namespace App\Console\Commands;
use App\Models\User;
use Illuminate\Console\Command;

class DeleteTestUser extends Command
{
    protected $signature = 'test:cleanup-users';
    protected $description = 'Delete test users';

    public function handle(): void
    {
        User::where('email', 'test@example.com')->delete();
        $this->info('Test users deleted.');
    }
}
