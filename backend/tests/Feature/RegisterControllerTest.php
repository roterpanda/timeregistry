<?php

namespace Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful registration flow
     */
    public function test_successful_registration(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => 'password123',
            'password_c' => 'password123',
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

}
