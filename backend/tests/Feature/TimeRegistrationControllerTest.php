<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class TimeRegistrationControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var User an authenticated user */
    private User $user1;

    /** @var User another authenticated user */
    private User $user2;

    /** @var Project a public project */
    private Project $publicProject;

    /** @var Project a private project */
    private Project $privateProject;

    public function setUp(): void
    {
        parent::setUp();
        $this->user1 = User::factory()->create();
        $this->privateProject = new Project([
            'name' => 'Test Project',
            'description' => 'This is a test project',
            'is_public' => false,
        ]);
        $this->privateProject->owner_id = $this->user1->id;
        $this->privateProject->save();

        $this->user2 = User::factory()->create();
        $this->publicProject = new Project([
            'name' => 'Test Project Public',
            'description' => 'This is a test project for user 2',
            'is_public' => true,
        ]);
        $this->publicProject->owner_id = $this->user2->id;
        $this->publicProject->save();

    }

    public function test_create_timeregistration_with_basic_fields(): void
    {
        $this->actingAs($this->user1, 'web');
        $response = $this->postJson('/api/v1/timeregistration', [
            'project_id' => $this->privateProject->id,
            'date' => '2024-01-01',
            'duration' => 8,
            'kilometers' => 1000,
            'notes' => 'Test notes'
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('time_registrations', [
            'project_id' => $this->privateProject->id,
            'date' => '2024-01-01',
            'duration' => 8,
            'kilometers' => 1000,
            'notes' => 'Test notes'
        ]);
        $response = $this->postJson('/api/v1/timeregistration', [
            'project_id' => $this->publicProject->id,
            'date' => '2024-01-01',
            'duration' => 8,
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('time_registrations', [
            'project_id' => $this->publicProject->id,
            'date' => '2024-01-01',
            'duration' => 8,
        ]);
    }

    public function test_create_timeregistration_with_invalid_project_id(): void
    {
        $this->actingAs($this->user1, 'web');
        $response = $this->postJson('/api/v1/timeregistration', [
            'project_id' => 9999,
            'date' => '2024-01-01',
            'duration' => 8,
        ]);
        $response->assertStatus(422);
    }

    public function test_create_timeregistration_not_authorized(): void
    {
        $this->actingAs($this->user2, 'web');
        $response = $this->postJson('/api/v1/timeregistration', [
            'project_id' => $this->privateProject->id,
            'date' => '2024-01-01',
            'duration' => 8,
        ]);
        $response->assertStatus(403);
    }



}
