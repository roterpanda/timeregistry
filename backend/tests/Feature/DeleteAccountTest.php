<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\TimeRegistration;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class DeleteAccountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'web');

        $response = $this->deleteJson('/account', [
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_delete_account_requires_correct_password(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'web');

        $response = $this->deleteJson('/account', [
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_delete_account_requires_password(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'web');

        $response = $this->deleteJson('/account', []);

        $response->assertStatus(422);
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_unauthenticated_user_cannot_delete_account(): void
    {
        $response = $this->deleteJson('/account', [
            'password' => 'password',
        ]);

        $response->assertStatus(401);
    }

    public function test_delete_account_removes_related_projects(): void
    {
        $user = User::factory()->create();
        $project = new Project([
            'name' => 'Test Project',
            'description' => 'A test project',
            'is_public' => false,
        ]);
        $project->owner_id = $user->id;
        $project->save();

        $this->actingAs($user, 'web');

        $response = $this->deleteJson('/account', [
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_delete_account_removes_related_time_registrations(): void
    {
        $user = User::factory()->create();
        $project = new Project([
            'name' => 'Test Project',
            'description' => 'A test project',
            'is_public' => true,
        ]);
        $project->owner_id = $user->id;
        $project->save();

        $timeReg = new TimeRegistration([
            'project_id' => $project->id,
            'date' => '2024-01-01',
            'duration' => 8,
        ]);
        $timeReg->user_id = $user->id;
        $timeReg->save();

        $this->actingAs($user, 'web');

        $response = $this->deleteJson('/account', [
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('time_registrations', ['user_id' => $user->id]);
    }

    public function test_delete_account_does_not_affect_other_users(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $project = new Project([
            'name' => 'User2 Project',
            'description' => 'Belongs to user2',
            'is_public' => false,
        ]);
        $project->owner_id = $user2->id;
        $project->save();

        $this->actingAs($user1, 'web');

        $response = $this->deleteJson('/account', [
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user1->id]);
        $this->assertDatabaseHas('users', ['id' => $user2->id]);
        $this->assertDatabaseHas('projects', ['id' => $project->id]);
    }

    public function test_delete_account_logs_out_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'web');

        $response = $this->deleteJson('/account', [
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertNull(Auth::guard('web')->user());
    }
}