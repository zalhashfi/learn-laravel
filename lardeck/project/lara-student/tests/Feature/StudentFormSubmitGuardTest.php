<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentFormSubmitGuardTest extends TestCase
{
    use RefreshDatabase;

    private const FORM = 'resources/js/Components/StudentForm.jsx';
    private const CREATE_PAGE = 'resources/js/Pages/Students/Create.jsx';
    private const EDIT_PAGE = 'resources/js/Pages/Students/Edit.jsx';

    /**
     * Tombol submit form siswa wajib mengikat state processing dari useForm()
     * sebagai atribut disabled. Ini pengaman anti double-submit: begitu request
     * Inertia berjalan, tombol mati sehingga user tidak mengirim form dua kali.
     */
    public function test_submit_button_is_disabled_while_processing(): void
    {
        $source = file_get_contents(base_path(self::FORM));

        $this->assertMatchesRegularExpression(
            '/type="submit"/',
            $source,
            'Form harus memiliki tombol bertipe submit.'
        );

        $this->assertMatchesRegularExpression(
            '/disabled=\{processing\}/',
            $source,
            'Tombol submit harus mengikat `disabled={processing}` (guard anti double-submit).'
        );

        $this->assertMatchesRegularExpression(
            '/disabled:opacity-50/',
            $source,
            'Tombol submit harus punya kelas visual non-aktif `disabled:opacity-50`.'
        );
    }

    /**
     * Guard berada pada komponen form bersama yang dipakai halaman Create & Edit,
     * sehingga kedua jalur submit (POST /students dan PUT /students/{id}) terlindungi.
     */
    public function test_create_and_edit_pages_share_the_guarded_form(): void
    {
        foreach ([self::CREATE_PAGE, self::EDIT_PAGE] as $page) {
            $source = file_get_contents(base_path($page));

            $this->assertMatchesRegularExpression(
                '/import\s+StudentForm\s+from\s+.@\/Components\/StudentForm.;/',
                $source,
                "Halaman [{$page}] harus memakai komponen StudentForm bersama."
            );

            $this->assertMatchesRegularExpression(
                '/<StudentForm[\s\S]*?\/>/',
                $source,
                "Halaman [{$page}] harus merender <StudentForm />."
            );
        }
    }

    /**
     * Lapis kedua: proteksi di sisi edge route.
     *
     * `disabled={processing}` baru aktif SETELAH Inertia mendispatch request,
     * sehingga masih ada jendela satu tick untuk double-submit (klik ganda atau
     * Enter + klik). Route write siswa memakai middleware `throttle` sebagai
     * pembatas laju request, menjaga data tetap konsisten walau UI terlewat.
     */
    public function test_student_write_routes_are_rate_limited(): void
    {
        $router = app('router');
        $middleware = [];

        foreach ($router->getRoutes() as $route) {
            foreach (['students.store', 'students.update'] as $name) {
                if ($route->getName() === $name) {
                    $middleware = array_merge($middleware, $route->gatherMiddleware());
                }
            }
        }

        $this->assertNotEmpty(
            $middleware,
            'Route students.store dan students.update harus terdaftar.'
        );

        $this->assertContains(
            'throttle:10,1',
            $middleware,
            'Route write siswa harus memakai pembatas laju `throttle:10,1` sebagai guard anti double-submit.'
        );
    }

    /**
     * Bukti perilaku: request kedua di luar kuota throttle ditolak HTTP 429,
     * bukan menulis baris duplikat ke database.
     */
    public function test_second_store_request_beyond_rate_limit_is_rejected(): void
    {
        for ($attempt = 1; $attempt <= 10; $attempt++) {
            $this->post('/students', [
                'name' => "Siswa {$attempt}",
                'email' => "siswa{$attempt}@campus.ac.id",
                'major' => 'Informatika',
            ])->assertRedirect();
        }

        $this->post('/students', [
            'name' => 'Siswa Kelebihan',
            'email' => 'kelebihan@campus.ac.id',
            'major' => 'Informatika',
        ])->assertStatus(429);

        $this->assertDatabaseMissing('students', ['email' => 'kelebihan@campus.ac.id']);
    }
}
