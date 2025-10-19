<?php

namespace App\Services;

use App\Models\User;

class TimeRegistrationService
{

    public function getRegistrationCount(User $user): int
    {
        return $user->timeRegistrations()->count();
    }

    public function getTotalTime(User $user): float
    {
        return $user->timeRegistrations()->sum('duration');
    }

}
