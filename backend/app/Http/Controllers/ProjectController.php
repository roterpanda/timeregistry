<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $owner = Auth::guard('web')->user();
        if (!$owner) {
            abort(403);
        }
        $limit = intval($request->query('limit', 10));
        $onlyOwn = $request->query('onlyOwn') === 'true';

        $query = Project::orderBy('created_at', 'desc');
        if ($onlyOwn) {
            $query->where('owner_id', $owner->id);
        } else {
            $query->where('is_public', 1)
                  ->orWhere('owner_id', $owner->id);
        }
        if ($limit > 0) {
            $query->take($limit);
        }
        $projects = $query->get()->map(function ($project) use ($owner) {
            $project->isOwnProject = $owner->id === $project->owner_id;
            $project->makeHidden(['owner_id']);
            return $project;
        });
        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'project_code' => 'max:32|unique:projects,project_code',
            'is_public' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'owner_id' => Auth::guard('web')->user()->id,
            'project_code' => $request->project_code,
            'is_public' => $request->is_public,
            ]);

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $owner = Auth::guard('web')->user();
        if (!$owner) {
            abort(403);
        }
        $project = Project::find($id);
        if (!$project) {
            abort(404);
        }
        if ($project->owner_id !== $owner->id && !$project->is_public) {
            abort(403);
        }
        $project->makeHidden(['owner_id']);
        $project->isOwnProject = $owner->id === $project->owner_id;
        return response()->json($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
