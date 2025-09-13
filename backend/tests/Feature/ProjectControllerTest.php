<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var User an authenticated user */
    private User $user;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();

    }

    public function test_create_project_with_basic_fields(): void
    {
        $this->actingAs($this->user, 'web');
        $response = $this->getTestResponse(
            name: 'Test Project',
            description: 'This is a test project',
            is_public: true,
        );
        $response->assertStatus(201);
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'description' => 'This is a test project',
            'is_public' => true,
            'owner_id' => $this->user->id,
        ]);
    }

    public function test_create_project_with_project_code(): void
    {
        $this->actingAs($this->user, 'web');
        $response = $this->getTestResponse(
            name: 'Test Project',
            description: 'This is a test project',
            is_public: false,
            project_code: 'TEST123'
        );
        $response->assertStatus(201);
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'description' => 'This is a test project',
            'project_code' => 'TEST123',
            'is_public' => false,
        ]);
        $response = $this->getTestResponse(
            name: 'Test Project 2',
            description: 'This is a test project',
            is_public: false,
            project_code: 'TEST123'
        );
        $response->assertStatus(422);
        $response->assertJson([
            'project_code' => ['The project code has already been taken.']
        ]);
    }

    public function test_create_project_with_invalid_data(): void
    {
        $this->actingAs($this->user, 'web');
        $response = $this->getTestResponse(
            name: 'Test Project',
            description: 'This is a test project',
            is_public: 'invalid'
        );
        $response->assertStatus(422);
        $response->assertJson([
            'is_public' => ['The is public field must be true or false.']
        ]);
    }

    public function test_access_project_list_as_guest(): void
    {
        $response = $this->getJson('/api/v1/project');
        $response->assertStatus(401);
    }

    public function test_access_project_list_as_user(): void
    {
        $this->actingAs($this->user, 'web');
        $response = $this->getJson('/api/v1/project');
        $response->assertStatus(200);

        $this->getTestResponse(
            name: 'Test Project',
            description: 'This is a test project, that belongs to user',
            is_public: true
        );

        $project = $this->user->projects()->latest()->first();

        $this->actingAs(User::factory()->create(), 'web');

        $this->getTestResponse(
            name: 'Test Project Other User',
            description: 'This is a test project, that belongs to another user',
            is_public: true,
        );

        $response = $this->getJson('/api/v1/project/' . $project->id);

        $response->assertStatus(403);

        $this->actingAs($this->user, 'web');
        $response = $this->getJson('/api/v1/project/' . $project->id);
        $response->assertStatus(200);
    }

    public function test_edit_project_as_guest(): void
    {
        $this->actingAs($this->user, 'web');
        $this->getTestResponse(
            name: 'Test Project',
            description: 'This is a test project, that belongs to user',
            is_public: true,
        );
        $project = $this->user->projects()->latest()->first();
        $this->actingAsGuest('web');
        $response = $this->putJson('/api/v1/project/' . $project->id, [
            'name' => 'Updated Project Name',
            'description' => 'Updated Project Description',
            'is_public' => false,
        ]);
        $response->assertStatus(401);
    }

    public function test_edit_project_from_other_user(): void
    {
        $this->actingAs($this->user, 'web');
        $this->getTestResponse(
            name: 'Test Project',
            description: 'This is a test project, that belongs to user',
            is_public: true,
        );
        $project = $this->user->projects()->latest()->first();
        $this->actingAs(User::factory()->create(), 'web');
        $response = $this->putJson('/api/v1/project/' . $project->id, [
            'name' => 'Updated Project Name',
        ]);
        $response->assertStatus(403);
    }

    public function test_delete_project_as_guest(): void
    {
        $this->actingAs($this->user, 'web');

        $this->getTestResponse(
            name: 'Test Project',
            description: 'This is a test project, that belongs to user',
            is_public: true,
        );

        $project = $this->user->projects()->latest()->first();

        $this->actingAsGuest('web');
        $response = $this->deleteJson('/api/v1/project/' . $project->id);
        $response->assertStatus(401);
    }

    /**
     * Helper method to create a test project
     *
     * @param string $name
     * @param string $description
     * @param bool $is_public
     * @param string $project_code
     *
     * @return TestResponse
     */
    public function getTestResponse(string $name, string $description, mixed $is_public, string $project_code = ''): TestResponse
    {
        $data = [
            'name' => $name,
            'description' => $description,
            'is_public' => $is_public,
        ];
        if ($project_code) {
            $data['project_code'] = $project_code;
        }
        return $this->postJson('/api/v1/project', $data);
    }

}
