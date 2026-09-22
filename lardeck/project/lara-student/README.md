# lara-student — Reference Application

Aplikasi referensi **Student Management System** berbasis **Laravel 12**, **Inertia.js**, dan **React 18 SPA** yang menjadi acuan langsung materi workshop *"Dari PHP ke Laravel: Refactor Backend CRUD"*.

---

## 🏛️ Arsitektur Aplikasi

Aplikasi mengadopsi pola arsitektur **Monolith Modern**:
- **Backend (Laravel 12)**: Menangani HTTP routing, validasi form, business logic, interaksi Eloquent ORM, dan migrasi database.
- **Jembatan (Inertia.js)**: Menghubungkan Laravel controller langsung dengan komponen React tanpa perlu merancang REST API terpisah, tanpa overhead fetch manual di client, dan tanpa CORS issue.
- **Frontend (React 18 SPA)**: Berada di dalam folder `resources/js/`. Seluruh komponen merender tampilan interaktif berbasis state dan props yang dikirim langsung dari Laravel controller.
- **Styling**: Menggunakan **Tailwind CSS v4** dengan palet warna yang memenuhi standar aksesibilitas kontras WCAG AA.

---

## 🗄️ Skema Database

Tabel `students` didefinisikan secara deklaratif melalui Laravel Migration (`database/migrations/2026_01_01_000000_create_students_table.php`):

| Nama Kolom | Tipe Kolom | Atribut | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto Increment | Pengenal unik data siswa |
| `name` | `VARCHAR(255)` | Not Null | Nama lengkap siswa |
| `email` | `VARCHAR(255)` | Not Null | Alamat email siswa |
| `major` | `VARCHAR(255)` | Not Null | Jurusan / peminatan studi |
| `created_at` | `TIMESTAMP` | Nullable | Waktu pembuatan baris data |
| `updated_at` | `TIMESTAMP` | Nullable | Waktu pembaharuan baris data |

Model `App\Models\Student` mengaktifkan perlindungan Mass Assignment:
```php
protected $fillable = ['name', 'email', 'major'];
```

---

## 🔌 Kontrak Routing & API (Resource Controller)

Seluruh interaksi CRUD dikelola melalui resource route tunggal di `routes/web.php`:
```php
Route::resource('students', StudentController::class);
```

### Rincian Endpoint & Respon

| Method | URL | Nama Route | Parameter / Payload | Response / Komponen Inertia |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | - | - | HTTP 302 Redirect ke `/students` |
| `GET` | `/students` | `students.index` | Query: `?search={string}&page={int}` | Inertia Page: `Students/Index`<br/>Props: `students`, `filters` |
| `GET` | `/students/create` | `students.create` | - | Inertia Page: `Students/Create` |
| `POST` | `/students` | `students.store` | Body: `{ name, email, major }` | **Valid**: 302 Redirect ke `students.index` + Flash Message<br/>**Invalid**: 302 Redirect Back + `errors` bag |
| `GET` | `/students/{student}/edit` | `students.edit` | URL Param: `id` | Inertia Page: `Students/Edit`<br/>Props: `student` |
| `PUT/PATCH` | `/students/{student}` | `students.update` | Body: `{ name, email, major }` | **Valid**: 302 Redirect ke `students.index` + Flash Message<br/>**Invalid**: 302 Redirect Back + `errors` bag |
| `DELETE` | `/students/{student}` | `students.destroy` | URL Param: `id` | 302 Redirect ke `students.index` + Flash Message |

### Aturan Validasi Input

Validasi dieksekusi secara inline pada method `store()` dan `update()`:
```php
$validated = $request->validate([
    'name' => ['required', 'string', 'max:100'],
    'email' => ['required', 'email', 'max:150'],
    'major' => ['required', 'string', 'max:80'],
], [
    'name.required' => 'Nama wajib diisi.',
    'name.max' => 'Nama maksimal 100 karakter.',
    'email.required' => 'Email wajib diisi.',
    'email.email' => 'Format email tidak valid.',
    'major.required' => 'Jurusan wajib diisi.',
]);
```

### Notifikasi Flash Message
Pesan sukses dikirimkan melalui session flash:
```php
return redirect()->route('students.index')->with('success', 'Data siswa berhasil ditambahkan.');
```
Komponen `AppLayout.jsx` di sisi React otomatis menangkap pesan melalui `usePage().props.flash` dan menampilkan banner pemberitahuan hijau.

---

## 💻 Panduan Instalasi & Menjalankan Aplikasi

1. **Pasang Dependensi**:
   ```bash
   composer install
   npm install
   ```

2. **Konfigurasi Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Migrasi Basis Data & Seeder**:
   ```bash
   php artisan migrate:fresh --seed
   ```

4. **Jalankan Aplikasi (Dua Proses)**:
   ```bash
   # Terminal 1: Backend Server (Port 8001)
   php artisan serve --port=8001

   # Terminal 2: Vite Dev Server (React & Tailwind)
   npm run dev
   ```

Akses aplikasi di browser pada alamat: **`http://localhost:8001/students`**

---

## 🧪 Eksekusi Test Suite

Aplikasi dilengkapi 12 test suite otomatis berbasis PHPUnit yang menguji alur routing, validasi, dan operasi CRUD:

```bash
php artisan test
```

Seluruh pengujian menggunakan database SQLite in-memory (`:memory:`) sehingga dapat dieksekusi secara terisolasi tanpa mempengaruhi data lokal.
