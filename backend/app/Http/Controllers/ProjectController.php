<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $projects = Project::orderBy('created_at', 'desc')->where('owner_id', $owner->id)->take($limit)->get();
        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'owner_id' => Auth::guard('web')->user()->id,
            ]);

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
