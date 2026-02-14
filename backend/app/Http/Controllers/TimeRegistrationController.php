<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TimeRegistration;
use App\Services\TimeRegistrationService;
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
            'notes' => 'nullable|string',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project = Project::find($request->project_id);
        if (!$project || ($project->owner_id !== $user->id && !$project->is_public)) {
            return response()->json('Unauthorized', 403);
        }

        $timeRegistration = $user->timeRegistrations()->create($request->only(['project_id', 'duration', 'kilometers', 'notes', 'date']));
        $timeRegistration->load('project:id,name');
        return response()->json($timeRegistration, 201);

    }

    public function update(Request $request, string $id)
    {
        $user = Auth::guard('web')->user();
        if (!$user) {
            return response()->json('Unauthenticated', 401);
        }
        $timeRegistration = $user->timeRegistrations()->find($id);
        if (!$timeRegistration) {
            return response()->json('Time registration not found', 404);
        }
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|exists:projects,id',
            'duration' => 'required|numeric|min:0',
            'kilometers' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project = Project::find($request->project_id);
        if (!$project || ($project->owner_id !== $user->id && !$project->is_public)) {
            return response()->json('Unauthorized', 403);
        }

        $timeRegistration->update($request->only(['project_id', 'duration', 'kilometers', 'notes', 'date']));
        $timeRegistration->load('project:id,name');
        return response()->json($timeRegistration);

    }

    public function destroy(string $id)
    {
        $user = Auth::guard('web')->user();
        if (!$user) {
            return response()->json('Unauthenticated', 401);
        }
        $timeRegistration = $user->timeRegistrations()->find($id);
        if (!$timeRegistration) {
            return response()->json('Time registration not found', 404);
        }
        $timeRegistration->delete();
        return response()->json('Time registration deleted successfully');
    }

    public function getStats(Request $request, TimeRegistrationService $timeRegistrationService)
    {
        $user = Auth::guard('web')->user();
        if (!$user) {
            return response()->json('Unauthenticated', 401);
        }
        $count = $timeRegistrationService->getRegistrationCount($user);
        $totalTime = $timeRegistrationService->getTotalTime($user);
        return response()->json([
            'count' => $count,
            'totalTime' => $totalTime,
        ]);
    }

    public function streamExport(Request $request)
    {
        $user = Auth::guard('web')->user();
        if (!$user) {
            return response()->json('Unauthenticated', 401);
        }

        $filename = 'export-' . now()->format('Ymd-His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($user) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Date', 'Project', 'Duration (h)', 'Kilometers', 'Notes']);
            TimeRegistration::query()
                ->where('user_id', $user->id)
                ->orderBy('project_id')
                ->orderBy('date', 'desc')
                ->chunk(100, function ($registrations) use ($handle) {
                    foreach ($registrations as $registration) {
                        fputcsv($handle, [
                            $registration->date,
                            $registration->project->name,
                            $registration->duration,
                            $registration->kilometers,
                            $registration->notes
                        ]);
                    }
                });
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }


}
