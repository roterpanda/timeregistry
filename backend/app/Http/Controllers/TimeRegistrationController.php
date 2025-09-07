<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TimeRegistrationController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::guard('web')->user();
        if (!$user) {
            return response()->json('Unauthorized', 401);
        }
        $timeRegistrations = $user->timeRegistrations()->with(['project:id,name'])->get();
        return response()->json($timeRegistrations);
    }


}
