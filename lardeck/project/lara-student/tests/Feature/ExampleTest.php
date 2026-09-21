<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;
    /**
     * Memastikan endpoint root mengalihkan pengguna ke /students.
     */
    public function test_root_redirects_to_students(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/students');
    }

    /**
     * Memastikan halaman daftar siswa (/students) dapat diakses dengan sukses.
     */
    public function test_students_index_returns_a_successful_response(): void
    {
        $response = $this->get('/students');

        $response->assertStatus(200);
    }

    /**
     * Memastikan alur redirect root menghasilkan response sukses (200) saat diikuti.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->followingRedirects()->get('/');

        $response->assertStatus(200);
    }
}
