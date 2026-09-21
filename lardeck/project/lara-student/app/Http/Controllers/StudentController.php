<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class StudentController extends Controller
{
    /**
     * READ — tampilkan semua siswa (dengan search opsional).
     *
     * Deck lama (index.php):
     *   $students = $pdo->query("SELECT * FROM students")->fetchAll();
     *   foreach ($students as $s): ?><tr><td><?= e($s['name']) ?></td>...
     */
    public function index(Request $request): View
    {
        $q = $request->input('q');

        $students = Student::query()
            ->when($q, fn ($query) => $query->where('name', 'like', "%{$q}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return view('students.index', compact('students', 'q'));
    }

    /**
     * Tampilkan form tambah data (bagian dari CREATE).
     */
    public function create(): View
    {
        return view('students.create');
    }

    /**
     * CREATE — simpan data baru.
     *
     * Deck lama (create.php):
     *   $stmt = $pdo->prepare("INSERT INTO students (...) VALUES (:name, ...)");
     *   $stmt->execute([...]);
     *   setFlash('...'); header('Location: index.php'); exit;
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'major' => ['required', 'string', 'max:80'],
        ], [
            'name.required'  => 'Nama wajib diisi.',
            'name.max'       => 'Nama maksimal 100 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email'    => 'Format email tidak valid.',
            'major.required' => 'Jurusan wajib diisi.',
        ]);

        Student::create($validated);

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Tampilkan detail satu siswa.
     *
     * Route model binding: {student} otomatis jadi objek Student, 404 kalau tak ada.
     */
    public function show(Student $student): View
    {
        return view('students.show', compact('student'));
    }

    /**
     * Tampilkan form edit, terisi data lama (bagian dari UPDATE).
     *
     * Deck lama (edit.php GET):
     *   $stmt = $pdo->prepare("SELECT * FROM students WHERE id = :id");
     */
    public function edit(Student $student): View
    {
        return view('students.edit', compact('student'));
    }

    /**
     * UPDATE — simpan perubahan.
     *
     * Deck lama (edit.php POST):
     *   UPDATE students SET name=:name, ... WHERE id=:id
     */
    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'major' => ['required', 'string', 'max:80'],
        ], [
            'name.required'  => 'Nama wajib diisi.',
            'name.max'       => 'Nama maksimal 100 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email'    => 'Format email tidak valid.',
            'major.required' => 'Jurusan wajib diisi.',
        ]);

        $student->update($validated);

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * DELETE — hapus data.
     *
     * Deck lama (delete.php):
     *   Wajib POST, bukan <a href>. DELETE FROM students WHERE id = :id
     */
    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil dihapus.');
    }
}
