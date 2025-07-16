<?php

namespace Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Mockery;
use Tests\TestCase;

class RegisterControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful registration flow
     */
    public function test_successful_registration(): void
    {
        $timestamp = now()->timestamp;

        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => 'password123',
            'password_c' => 'password123',
        ], [
            'X-Request-Timestamp' => (string) $timestamp,
            'X-Request-Signature' => hash_hmac('sha256', "POST|api/register|$timestamp", env('FRONTEND_WEB_SECRET')),
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@test.com',
        ]);
    }

    /**
     * Test registration with existing email
     */
    public function test_registration_with_existing_email(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Existing User',
            'email' => 'existing@exists.com',
            'password' => 'password123',
            'password_c' => 'password123',
        ]);
        $response->assertStatus(201);
        $response = $this->postJson('/api/register', [
            'name' => 'Another User',
            'email' => 'existing@exists.com',
            'password' => 'password123',
            'password_c' => 'password123',
        ]);
        $response->assertStatus(422);
    }


    /**
     * Test registration with mismatched passwords
     */
    public function test_registration_with_mismatched_passwords(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => 'password123',
            'password_c' => 'differentpassword',
        ]);
        $response->assertStatus(422);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'password_c',
            ],
        ]);
        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Validation Error.',
            'data' => [
                'password_c' => ['The password c field must match password.'],
            ],
        ]);
    }

    /**
     * Test server error during registration
     */
    public function test_server_error_during_registration(): void
    {
        $mockUserService = Mockery::mock('App\Services\RegisterUserService');
        $mockUserService->shouldReceive('register')
            ->once()
            ->andThrow(new \Exception('Database error'));
        $this->app->instance('App\Services\RegisterUserService', $mockUserService);
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => 'password123',
            'password_c' => 'password123',
        ]);
        $response->assertStatus(500);
    }

}
