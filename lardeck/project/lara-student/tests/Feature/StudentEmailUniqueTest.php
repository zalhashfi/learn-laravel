<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * Integritas kolom email siswa (plan 01-01 T2).
 *
 * Email adalah identitas tunggal siswa. Tanpa constraint di level database,
 * dua request bersamaan (race condition double-submit) bisa menyisipkan
 * email yang sama dua kali. Lapisan validasi saja tidak cukup: ia hanya
 * memeriksa "apakah email ini sudah ada?" sesaat SEBELUM insert, sehingga
 * dua request paralel sama-sama lolos pengecekan lalu sama-sama insert.
 * Karena itu database harus ikut menegakkan aturannya.
 */
class StudentEmailUniqueTest extends TestCase
{
    use RefreshDatabase;

    private const MIGRATION = 'database/migrations/2026_01_01_000000_create_students_table.php';

    /**
     * Migrasi wajib mendeklarasikan indeks unik pada kolom email.
     */
    public function test_email_column_is_declared_as_unique_index_in_migration(): void
    {
        $source = file_get_contents(base_path(self::MIGRATION));

        $this->assertMatchesRegularExpression(
            "/\\\$table->string\('email'\)->unique\(\);/",
            $source,
            "Kolom [email] harus dideklarasikan sebagai \$table->string('email')->unique();"
        );
    }

    /**
     * Database benar-benar menolak email duplikat pada level skema.
     */
    public function test_database_rejects_duplicate_email_at_schema_level(): void
    {
        $this->assertTrue(
            Schema::hasTable('students'),
            'Tabel students belum dimigrasi.'
        );

        $uniqueIndexes = collect(Schema::getIndexes('students'))
            ->filter(fn (array $index) => $index['unique'] === true)
            ->flatMap(fn (array $index) => $index['columns'])
            ->all();

        $this->assertContains(
            'email',
            $uniqueIndexes,
            'Tabel students tidak memiliki indeks unik pada kolom email.'
        );
    }

    /**
     * POST /students dengan email yang sudah terpakai harus ditolak.
     */
    public function test_student_email_must_be_unique_on_store(): void
    {
        Student::create([
            'name' => 'Budi Pratama',
            'email' => 'budi@campus.ac.id',
            'major' => 'Teknik Informatika',
        ]);

        $response = $this->from('/students/create')->post('/students', [
            'name' => 'Budi Kembar',
            'email' => 'budi@campus.ac.id',
            'major' => 'Sistem Informasi',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertSame(
            1,
            Student::where('email', 'budi@campus.ac.id')->count(),
            'Email duplikat lolos masuk ke database.'
        );
    }

    /**
     * PUT /students/{id} boleh mempertahankan email milik siswa itu sendiri,
     * tetapi wajib menolak email milik siswa lain.
     */
    public function test_student_email_must_be_unique_on_update(): void
    {
        $budi = Student::create([
            'name' => 'Budi Pratama',
            'email' => 'budi@campus.ac.id',
            'major' => 'Teknik Informatika',
        ]);

        Student::create([
            'name' => 'Siti Aminah',
            'email' => 'siti@campus.ac.id',
            'major' => 'Sistem Informasi',
        ]);

        // Email milik sendiri: harus lolos.
        $this->from("/students/{$budi->id}/edit")
            ->put("/students/{$budi->id}", [
                'name' => 'Budi Pratama',
                'email' => 'budi@campus.ac.id',
                'major' => 'Teknik Informatika',
            ])
            ->assertSessionHasNoErrors();

        // Email milik siswa lain: harus ditolak.
        $this->from("/students/{$budi->id}/edit")
            ->put("/students/{$budi->id}", [
                'name' => 'Budi Pratama',
                'email' => 'siti@campus.ac.id',
                'major' => 'Teknik Informatika',
            ])
            ->assertSessionHasErrors('email');

        $this->assertDatabaseHas('students', [
            'id' => $budi->id,
            'email' => 'budi@campus.ac.id',
        ]);
    }
}
