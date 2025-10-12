<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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

    public function store(Request $request)
    {
        $user = Auth::guard('web')->user();
        if (!$user) {
            return response()->json('Unauthenticated', 401);
        }
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|exists:projects,id',
            'duration' => 'required|numeric|min:0',
            'kilometers' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project = Project::find($request->project_id);
        if (!$project || ($project->owner_id !== $user->id && !$project->is_public)) {
            return response()->json('Unauthorized', 403);
        }

        $timeRegistration = $user->timeRegistrations()->create($request->all());
        $timeRegistration->load('project:id,name');
        return response()->json($timeRegistration, 201);

    }


}
