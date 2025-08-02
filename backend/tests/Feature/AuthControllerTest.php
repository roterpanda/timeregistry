<?php

namespace Feature;


use App\Models\User;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\TestResponse;
use Mockery;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    /**
     * Test successful registration flow
     */
    public function test_successful_registration(): void
    {
        $response = $this->registerTestUser('Test User', 'test@test.com', 'password123');
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
        $response = $this->registerTestUser("<?php echo hello ?><script></script>Hello", 'test@test.com', 'password123');
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
        $response = $this->registerTestUser('Existing User', 'existing@exists.com', 'password123');
        $response->assertStatus(201);
        $response = $this->registerTestUser('Another User', 'existing@exists.com', 'password123');
        $response->assertStatus(422);
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
        $response = $this->registerTestUser('Test User', 'test@test.com', 'password123');
        $response->assertStatus(500);
    }

    /**
     * @return void
     */
    public function registerTestUser(string $username, string $email, string $password): TestResponse
    {
        return $this->postJson( 'register', [
            'name' => $username,
            'email' => $email,
            'password' => $password,
            'password_c' => $password,
        ]);
    }

}
