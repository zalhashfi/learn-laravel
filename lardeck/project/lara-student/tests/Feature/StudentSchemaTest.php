<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class StudentSchemaTest extends TestCase
{
    use RefreshDatabase;

    private const MIGRATION = 'database/migrations/2026_01_01_000000_create_students_table.php';

    /**
     * Tabel students wajib punya kolom inti: id, name, email, major, timestamps.
     */
    public function test_students_table_has_expected_columns(): void
    {
        foreach (['id', 'name', 'email', 'major', 'created_at', 'updated_at'] as $column) {
            $this->assertTrue(
                Schema::hasColumn('students', $column),
                "Kolom [{$column}] tidak ditemukan pada tabel students."
            );
        }
    }

    /**
     * Kolom string siswa dideklarasikan tanpa batasan panjang eksplisit.
     *
     * Migration adalah sumber kebenaran skema. Test ini memeriksa langsung
     * deklarasi kolom pada file migration sehingga penambahan panjang
     * eksplisit (mis. string('name', 100)) akan terdeteksi.
     *
     * Modifier seperti ->unique() diizinkan: yang dijaga adalah LEBAR kolom,
     * bukan ada tidaknya indeks. Batas atas yang diizinkan inilah budget
     * yang membuat kolom fleksibel sampai 255 karakter (default Laravel).
     */
    public function test_student_string_columns_declared_without_explicit_length(): void
    {
        $source = file_get_contents(base_path(self::MIGRATION));

        foreach (['name', 'email', 'major'] as $column) {
            $this->assertMatchesRegularExpression(
                "/\\\$table->string\('{$column}'\)(?:->\w+\(\))*;/",
                $source,
                "Kolom [{$column}] harus dideklarasikan sebagai string tanpa panjang eksplisit."
            );
        }
    }
}
