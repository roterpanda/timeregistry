<?php

namespace Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\TestResponse;
use Mockery;
use Tests\TestCase;

class RegisterControllerTest extends TestCase
{
    use RefreshDatabase;

    private function signedRequest(string $method, string $path, array $body = []): TestResponse {
        $timestamp = now()->timestamp;
        $headers = [
            'X-Request-Timestamp' => (string) $timestamp,
            'X-Request-Signature' => hash_hmac('sha256', $method . $path . $timestamp, env('FRONTEND_WEB_SECRET')),
        ];

        return match(strtolower($method)) {
            'post' => $this->postJson('/' . $path, $body, $headers),
            'put' => $this->putJson('/' . $path, $body, $headers),
            'get' => $this->getJson('/' . $path, $headers),
            'patch' => $this->patchJson('/' . $path, $body, $headers),
            'delete' => $this->deleteJson('/' . $path, $headers),
        };
    }


    /**
     * Test successful registration flow
     */
    public function test_successful_registration(): void
    {
        $response = $this->signedRequest('POST', 'api/register', [
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
        $user = User::where('email', 'test@test.com')->first();
        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /**
     * Test php and html tags are stripped from username.
     */
    public function test_strip_tags_username(): void
    {
        $response = $this->signedRequest('POST', 'api/register', [
            'name' => "<?php echo hello ?><script></script>Hello",
            'email' => 'test@test.com',
            'password' => 'password123',
            'password_c' => 'password123',
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'name' => 'Hello',
            'email' => 'test@test.com',
        ]);
    }

    /**
     * Test registration with existing email
     */
    public function test_registration_with_existing_email(): void
    {
        $response = $this->signedRequest('POST', 'api/register', [
            'name' => 'Existing User',
            'email' => 'existing@exists.com',
            'password' => 'password123',
            'password_c' => 'password123',
        ]);
        $response->assertStatus(201);
        $response = $this->signedRequest('POST', 'api/register', [
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
        $response = $this->signedRequest('POST', 'api/register', [
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => 'password123',
            'password_c' => 'differentpassword',
        ]);
        $response->assertStatus(422);
        $response->assertJsonStructure([
            'success',
            'message',
        ]);
        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Validation failed. Please check your details.',
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
        $response = $this->signedRequest('POST', 'api/register', [
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => 'password123',
            'password_c' => 'password123',
        ]);
        $response->assertStatus(500);
    }

}
