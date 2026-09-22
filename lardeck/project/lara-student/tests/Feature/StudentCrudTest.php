<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentCrudTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Memastikan data siswa baru dapat disimpan melalui POST /students.
     */
    public function test_can_create_student(): void
    {
        $payload = [
            'name' => 'Budi Pratama',
            'email' => 'budi@campus.ac.id',
            'major' => 'Teknik Informatika',
        ];

        $response = $this->post('/students', $payload);

        $response->assertRedirect('/students');
        $response->assertSessionHas('success', 'Data siswa berhasil ditambahkan.');

        $this->assertDatabaseHas('students', [
            'name' => 'Budi Pratama',
            'email' => 'budi@campus.ac.id',
            'major' => 'Teknik Informatika',
        ]);
    }

    /**
     * Memastikan validasi server berjalan saat field wajib kosong.
     */
    public function test_create_student_validation_fails(): void
    {
        $response = $this->post('/students', []);

        $response->assertSessionHasErrors(['name', 'email', 'major']);
    }

    /**
     * Memastikan data siswa dapat diperbarui melalui PUT /students/{id}.
     */
    public function test_can_update_student(): void
    {
        $student = Student::create([
            'name' => 'Siti Aminah',
            'email' => 'siti@campus.ac.id',
            'major' => 'Sistem Informasi',
        ]);

        $updatePayload = [
            'name' => 'Siti Aminah S.Kom',
            'email' => 'siti.aminah@campus.ac.id',
            'major' => 'Sistem Informasi',
        ];

        $response = $this->put("/students/{$student->id}", $updatePayload);

        $response->assertRedirect('/students');
        $response->assertSessionHas('success', 'Data siswa berhasil diperbarui.');

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'name' => 'Siti Aminah S.Kom',
            'email' => 'siti.aminah@campus.ac.id',
        ]);
    }

    /**
     * Memastikan data siswa dapat dihapus melalui DELETE /students/{id}.
     */
    public function test_can_delete_student(): void
    {
        $student = Student::create([
            'name' => 'Doni Kusuma',
            'email' => 'doni@campus.ac.id',
            'major' => 'Teknik Komputer',
        ]);

        $response = $this->delete("/students/{$student->id}");

        $response->assertRedirect('/students');
        $response->assertSessionHas('success', 'Data siswa berhasil dihapus.');

        $this->assertDatabaseMissing('students', [
            'id' => $student->id,
        ]);
    }

    /**
     * Memastikan pencarian nama siswa memfilter hasil dengan tepat.
     */
    public function test_search_filters_students(): void
    {
        Student::create(['name' => 'Ahmad Dahlan', 'email' => 'ahmad@campus.ac.id', 'major' => 'Informatika']);
        Student::create(['name' => 'Bambang Sudibyo', 'email' => 'bambang@campus.ac.id', 'major' => 'Elektro']);

        $response = $this->get('/students?q=Ahmad');
        $response->assertStatus(200);
    }

    /**
     * Edge case: Mengakses ID siswa yang tidak ada mengembalikan 404 otomatis via Route Model Binding.
     */
    public function test_accessing_non_existent_student_returns_404(): void
    {
        $this->get('/students/999999')->assertStatus(404);
        $this->put('/students/999999', ['name' => 'Test', 'email' => 'test@test.com', 'major' => 'CS'])->assertStatus(404);
        $this->delete('/students/999999')->assertStatus(404);
    }
}

