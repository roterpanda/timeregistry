<?php

namespace Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class TimeRegistrationControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var User an authenticated user */
    private User $user;

    /** @var Project a project */
    private Project $project;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->project = Project::create([
            'name' => 'Test Project',
            'description' => 'This is a test project',
            'is_public' => true,
            'owner_id' => $this->user->id,]
        );
        $this->project->save();

    }

    public function test_create_timeregistration_with_basic_fields(): void
    {
        $this->actingAs($this->user, 'web');
        $response = $this->postJson('/api/v1/timeregistration', [
            'project_id' => $this->project->id,
            'date' => '2024-01-01',
            'duration' => 8,
            'kilometers' => 1000,
            'notes' => 'Test notes'
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('time_registrations', [
            'project_id' => $this->project->id,
            'date' => '2024-01-01',
            'duration' => 8,
            'kilometers' => 1000,
            'notes' => 'Test notes'
        ]);
    }



}
