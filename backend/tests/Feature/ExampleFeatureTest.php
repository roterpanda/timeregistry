<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleFeatureTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_404_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(404);
    }
}
