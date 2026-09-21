# Outline Slide-by-Slide — "Dari PHP ke Laravel: Refactor Backend CRUD"

Dokumen perencanaan untuk deck reveal.js di `lardeck.html` / `lardeck/slides/*.md`.

Kurikulum deck ini **mengikuti [roadmap.sh/laravel](https://roadmap.sh/laravel)**
sebagai kerangka resmi topiknya, dan tetap memakai pedagogi deck sebelumnya
("Dari C ke PHP" / `learn-php/phpdeck`): **setiap fitur Laravel diperkenalkan
dengan membandingkan kode plain PHP yang sudah peserta tulis sendiri.**

> **Prinsip deck ini:**
> 1. **roadmap.sh menentukan APA** — setiap part menunjuk node roadmap.sh yang
>    sedang ditutup.
> 2. **Proyek lama menentukan BAGAIMANA** — selalu mulai dari
>    `phpdeck/project/` (Student Management System) lalu refactor ke Laravel.
> 3. **CORE ringkas, LIVE CODING yang dalam** — slide hanya memuat 1 ide;
>    kedalaman datang dari sesi live coding yang diperbanyak.

Legenda: `[CORE]` = slide materi &middot; `[LIVE]` = sesi live coding pemateri
&middot; `[CORE] → [LIVE]` = slide materi singkat yang langsung lanjut ke live
coding. Slide hybrid dihitung di KEDUA kolom `[CORE: x, LIVE: y]` pada setiap
Part &middot; `roadmap:` = node di roadmap.sh/laravel.

**Total: 30 slide.** Setelah ditulis dengan prinsip
"satu ide per slide", deck sempat membengkak ke 42, dipangkas ke 29, lalu
slide Request–Response dipisah dari `.env` (diagram butuh ruang penuh) menjadi
30. Rincian di catatan penomoran.

> **Catatan penomoran:** deck ditulis dengan prinsip "satu ide per slide".
> Versi pertama membengkak ke 42 slide; atas keputusan pemilik materi, deck
> dipangkas kembali dengan menggabungkan slide yang berkaitan. **Status akhir:**
>
> | Part | Rencana | Final | Status |
> |---|---|---|---|
> | 0 · Opening | 3 | 3 | ✅ selesai |
> | 1 · Getting Started | 5 | 6 | ✅ selesai |
> | 2 · Routing & Controllers | 4 | 4 | ✅ selesai |
> | 3 · Database & Eloquent | 4 | 4 | ✅ selesai |
> | 4 · Views dengan React | 2 | 3 | ✅ selesai |
> | 5 · Forms & CRUD | 6 | 6 | ✅ selesai |
> | 6 · Relasi & Peta Jalan | 4 | 4 | ✅ selesai |
> | **Total** | **28** | **30** | ✅ selesai |
>
> Semua slide punya speaker notes. Penggabungan yang dilakukan: Composer +
> create-project (Part 1), route dasar + parameter (Part 2), migration + seeder
> (Part 3), Eloquent + `$fillable` (Part 3), validasi + tampil error (Part 5),
> peta roadmap + relationships (Part 6). Satu pemisahan: Request–Response Flow
> dan Configuration `.env` jadi slide terpisah (diagram butuh ruang penuh).

---

## Peta Cakupan roadmap.sh

Legenda status: `[CORE]` = dibahas di sesi &middot; `[PETA]` = disebut di slide
peta jalan untuk dipelajari mandiri &middot; `[LIVE]` = didemokan langsung.

| # | Node roadmap.sh | Slide | Status |
|---|---|---|---|
| 1 | What is Laravel? / Why Web Frameworks? | 3 | `[CORE]` |
| 2 | Installing Laravel / Create a new project | 4–5 | `[CORE]` + `[LIVE]` |
| 3 | Project Structure | 6 | `[CORE]` |
| 4 | Request–Response Flow | 7 | `[CORE]` |
| 5 | Basic Routes / Route parameters / Named routes | 9–12 | `[CORE]` + `[LIVE]` |
| 6 | Basic & Resource Controllers | 10–11 | `[CORE]` + `[LIVE]` |
| 7 | Migrations, seeders | 13–14 | `[CORE]` + `[LIVE]` |
| 8 | Eloquent ORM / CRUD Operations | 15 | `[CORE]` |
| 9 | Views: React, props, JSX rendering | 17–18 | `[CORE]` + `[LIVE]` |
| 10 | Layouts | 18 | `[LIVE]` |
| 11 | Forms | 19 | `[CORE]` |
| 12 | Validation / Error messages | 19 | `[CORE]` |
| 13 | Route model binding | 20 | `[CORE]` |
| 14 | CRUD lengkap (update, delete, PRG) | 21–22 | `[LIVE]` |
| 15 | Query scopes / Pagination | 23 | `[LIVE]` |
| 16 | Logging & Debugging / Exceptions | 24 | `[LIVE]` |
| 17 | Relationships | 26 | `[CORE]` ringkas |
| 18 | Auth & Security, Testing, Advanced & Ops | 25, 28 | `[PETA]` |

**Tidak masuk sesi ini** (ditandai `[PETA]` di slide 25 & 28): Starter Kits
(Breeze/Jetstream), Sanctum, Policies/Gates, Unit/Feature tests, Pest/PHPUnit,
Telescope, Queues & Jobs, Events, Notifications, Scheduling, Caching, File
Storage, Localization, Deployment, Octane, Pulse, Performance.

---

## Part 0 — Opening `[CORE: 3, LIVE: 0]`

*roadmap: Getting Started (intro), Request–Response Flow*

### SLIDE 1 `[CORE]`
Title: Dari PHP Murni ke Laravel
`roadmap: Getting Started`
Main Content: Judul + satu kalimat: "kita tidak belajar hal baru — kita
melihat hal lama dikerjakan oleh alat yang tepat."
Speaker Notes: Recall deck sebelumnya. Tanya: "berapa file yang harus kalian
buat untuk CRUD students?" (6 file + config + helpers). Hari ini: framework
resmi industri. Materi ikut peta belajar resmi roadmap.sh/laravel.

### SLIDE 2 `[CORE]`
Title: Ingat ini? — Peta proyek lama vs Laravel
`roadmap: Your First App`
Main Content: Tabel file plain PHP (index/create/edit/delete + config +
helpers) versus versi Laravel nanti. Satu baris: "6 file → 1 resource".
Speaker Notes: Tempel tangkapan layar file tree `phpdeck/project`. Biarkan
mereka merasakan "folder berantakan" itu dulu.

### SLIDE 3 `[CORE]`
Title: What is Laravel? — dan kenapa framework
`roadmap: Getting Started → What is Laravel?, Why Web Frameworks?`
Main Content: Dua kolom — "framework = kumpulan keputusan bagus yang sudah
diambil orang lain" + "kenapa web framework" (routing, ORM, template,
security bawaan). Sebut: Laravel = framework PHP paling populer.
Speaker Notes: Satu slide saja — jangan jadi presentasi marketing. Intinya:
kita tidak menulis ulang hal yang sama setiap proyek.

---

## Part 1 — Getting Started: Instalasi & Struktur `[CORE: 5, LIVE: 2]`

*roadmap: Installing Laravel, Create a new project, Project Structure,
Request–Response Flow, Artisan, Package Management*

### SLIDE 4 `[CORE]`
Title: Composer — bukan sekadar instaler
`roadmap: Getting Started → Installing Laravel`, `Advanced → Package Management`
Main Content: `.cmp` — `require`/`include` manual (deck lama) versus
`composer.json` (daftar dependensi). Composer = package manager (analogi
`npm`/`pip`). Laravel sendiri paket Composer.
Speaker Notes: Sambungkan ke Part 1 deck lama (`include`/`require` manual).
Dulu kita `require` file sendiri; sekarang Composer mengurus library dari
internet lengkap dengan versinya.

### SLIDE 5 `[LIVE]`
Title: 🎬 Live Coding #1a — Create a New Project
`roadmap: Getting Started → Create a new project, Installing Laravel`
Main Content: `composer create-project laravel/laravel lara-student` +
checkpoint Composer terpasang.
Speaker Notes: Tunjukkan perintah, jelaskan artinya, lalu jalankan. Sebut opsi
Herd/Sail/Laragon sekilas. Satu perintah = struktur lengkap.

### SLIDE 6 `[LIVE]`
Title: 🎬 Live Coding #1b — Jalankan & lihat hasilnya
`roadmap: Create a new project, Artisan`
Main Content: `cd lara-student` → `php artisan serve --port=8001` → halaman
welcome Laravel. Sebut Artisan sebagai command-line tool.
Speaker Notes: Tunjukkan halaman welcome jalan di localhost:8001. "Satu
command, dan kalian sudah punya lebih banyak struktur daripada yang kita
rakit 10 part kemarin." Tekankan port 8001 (app) vs 8000 (deck).

### SLIDE 7 `[CORE]`
Title: Project Structure — tur folder
`roadmap: Project Structure (App, Bootstrap, Config, Database, Public,
Resources, Routes, Storage, Tests, Vendor)`
Main Content: Tabel folder → tanggung jawab, persis node roadmap.sh. Sorot
yang akan dipakai: `app/`, `routes/`, `resources/views/`, `database/`,
`config/`, `public/`, `.env`.
Speaker Notes: Jangan dibacakan semua. Sebut `storage/`, `tests/`, `vendor/`
akan dibahas slide berikutnya.

### SLIDE 8 `[CORE]`
Title: Public & Vendor — mana yang boleh disentuh
`roadmap: Project Structure → Public, Vendor`
Main Content: `.ask` — apa arti flag `-t` di `php -S ... -t phpdeck/project`?
Jawab: document root. `public/` = satu-satunya folder yang dilihat browser;
`vendor/` jangan diedit/di-commit (bisa dibuat ulang `composer install`).
Speaker Notes: Ini sumber kebingungan setup paling umum. "Kalau app kalian
'tidak ketemu', cek dulu apakah server menunjuk ke `public/`."

### SLIDE 9 `[CORE]`
Title: Request–Response Flow di Laravel
`roadmap: Project Structure → Request–Response Flow`
Main Content: Diagram flow — Request → Route → Controller → Model → DB →
(Controller) → View → Response. Bandingkan dengan flow deck lama
(Browser→HTTP→PHP→SQL→MySQL→HTML).
[IMAGE PLACEHOLDER]
Diagram MVC Laravel.
Speaker Notes: Benang merah seluruh sesi. Minta peserta memotret. Tekankan:
Route = pintu masuk, Controller = otak, Model = jembatan data, View = tampilan.

### SLIDE 10 `[CORE]`
Title: Configuration & `.env` — rahasia tidak masuk git
`roadmap: Databases → Configuration`
Main Content: `.cmp` — kredensial keras di `config/database.php` (deck lama)
versus `.env` (Laravel). `DB_DATABASE=student_db`, `APP_KEY`, `APP_DEBUG`.
Speaker Notes: `APP_DEBUG=true` = setara `display_errors` di Part 1 deck lama
— wajib `false` di production. Siapkan `.env` untuk live coding berikutnya.

---

## Part 2 — Routing & Controllers `[CORE: 4, LIVE: 1]`

*roadmap: Routing & Controllers*

### SLIDE 9 `[CORE]` → `[LIVE]`
Title: Basic Routes + Route Parameters
`roadmap: Routing → Basic Routes, Route parameters`
Main Content: `.cmp` — URL lama (`index.php`, `edit.php?id=5`) vs route baru
(`GET /students`, `GET /students/{id}/edit`). Route dasar:
`Route::get('/halo', fn() => 'Halo');`.
Speaker Notes: Tunjukkan URL jadi RESTful dan "berbicara". Bandingkan `{id}`
dengan `$_GET['id']` manual di Part 7 deck lama.

### SLIDE 10 `[LIVE]`
Title: 🎬 Live Coding #2 — Routes & `route:list`
Main Content: `Route::resource('students', StudentController::class);` +
`php artisan make:controller StudentController --resource` +
`php artisan route:list`.
`roadmap: Routing → Basic Routes, Named routes, Resource controllers, Basic controllers,
Advanced → Artisan`
Speaker Notes: Tunjukkan output `route:list`: 7 route otomatis (index, create,
store, show, edit, update, destroy) — bandingkan dengan 6 file manual kita.
Momen "oh, banyak yang gratis". (Live #2.)

### SLIDE 11 `[CORE]`
Title: Controller — otak yang dulu jadi satu file
`roadmap: Routing → Basic controllers, Resource controllers`
Main Content: Tabel method controller ↔ file lama: `index()`↔`index.php`,
`create()`/`store()`↔`create.php`, `edit()`/`update()`↔`edit.php`,
`destroy()`↔`delete.php`.
Speaker Notes: Pemetaan 1:1 ini inti Part 2. Peserta melihat file lama mereka
"dipecah" jadi method bernama. Sebut route punya nama otomatis dari
`Route::resource` (`students.index`), dipakai di sisi Laravel lewat
`redirect()->route(...)`.

### SLIDE 12 `[CORE]`
Title: Controller & Link antar-halaman
`roadmap: Routing → Named routes (di sisi Laravel), Inertia Link`
Main Content: `.cmp` — plain PHP `edit.php?id=5` versus React
`<Link href={\`/students/${student.id}/edit\`}>`. Sebut nama route tetap ada
dan berguna di Laravel; dari React butuh Ziggy (tidak dipakai di sesi ini).
Speaker Notes: Fokus ke `<Link>` Inertia: navigasi tanpa reload halaman.
Jujur soal Ziggy: opsi lanjutan, bukan bagian sesi ini.

---

## Part 3 — Database & Eloquent `[CORE: 4, LIVE: 1]`

*roadmap: Databases & Eloquent*

### SLIDE 13 `[CORE]` → `[LIVE]`
Title: Migrations — dari `schema.sql` ke kode
`roadmap: Databases → Migrations, seeders`
Main Content: `.cmp` — `CREATE TABLE students (...)` di `schema.sql` vs
`Schema::create('students', function(Blueprint $t){...})` di migration.
Speaker Notes: Recall Part 3 deck lama: import `schema.sql` manual lewat
phpMyAdmin. Sekarang schema jadi kode yang bisa di-version-control. Tunjukkan
keduanya berdampingan baris demi baris.

### SLIDE 14 `[LIVE]`
Title: 🎬 Live Coding #3 — `make:model -m`, migrate & seeder
Main Content: `php artisan make:model Student -m` → tulis kolom
(`$table->string('name',100)` dst.) → `php artisan migrate` → seeder
`StudentSeeder` → `php artisan db:seed`.
`roadmap: Databases → Eloquent ORM, Migrations, seeders, CRUD Operations`
Speaker Notes: Tulis utuh di proyektor. Bandingkan dengan import manual +
`seed.sql`. Sebut `migrate:fresh --seed` sebagai "reset database sekali jalan".
Sebut `$table->id()` = AUTO_INCREMENT PRIMARY KEY. (Live #3.)

### SLIDE 15 `[CORE]`
Title: Eloquent ORM — PDO digantikan
`roadmap: Databases → Eloquent ORM, CRUD Operations`
Main Content: `.cmp` — `$pdo->query("SELECT * FROM students")->fetchAll()`
versus `Student::all()`. Sebut `$fillable = ['name','email','major']`.
Speaker Notes: Momen paling penting Part 3. Koneksi PDO yang kita rakit susah
payah di Part 3 deck lama sekarang "ada di belakang layar". `$fillable` =
whitelist field (sejajar prinsip whitelist Part 9 deck lama).

### SLIDE 16 `[CORE]`
Title: Creating Responses — Inertia, Redirect, JSON
`roadmap: Views → Views, Redirects, Creating Responses, JSON`
Main Content: `return Inertia::render('Students/Index', ['students' => $students]);` +
`return redirect()->route('students.index');` +
`return response()->json($students);`
Speaker Notes: Inilah "PHP yang mengirim output" di deck lama, tapi sekarang
eksplisit: controller mengembalikan Response. `redirect()` = PRG Part 5 deck
lama; `response()->json()` = pintu menuju API.

---

## Part 4 — Views dengan React `[CORE: 3, LIVE: 1]`

*roadmap: Views (via Inertia + React)*

### SLIDE 17 `[CORE]`
Title: Props — data dari Laravel masuk ke React
`roadmap: Views → React rendering, props`
Main Content: `.cmp` — controller `Inertia::render('Students/Index', ['students' => ...])`
versus komponen React `Index({ students })`. Tekankan: nama key harus sama;
React tidak menyentuh database.
Speaker Notes: Konsep paling penting Part 4: data mengalir SATU ARAH. Sumber
bug paling umum = salah ketik nama key props.

### SLIDE 18 `[CORE]` → `[LIVE]`
Title: JSX — `{}` menggantikan `<?= ?>`, aman default + Layout & kondisi kosong
Main Content: `.cmp` — `<?php foreach` + `htmlspecialchars()` versus
`{students.map((s) => <tr key={s.id}><td>{s.name}</td></tr>)}`.
Lalu `AppLayout` (`{children}`) + ternary kondisi kosong + flash via
`usePage().props.flash`.
`roadmap: Views → React rendering, Layouts, conditional rendering`
Speaker Notes: Payoff XSS deck lama: `htmlspecialchars()` yang dulu harus
diingat tiap output kini perilaku default JSX. Sebut `key` wajib di `map()`.
`dangerouslySetInnerHTML` sengaja dinamai menakutkan. (Live #4.)

---

## Part 5 — Forms, Validation & CRUD `[CORE: 6, LIVE: 4]`

*roadmap: Databases (Forms, Validation, CRUD) + Routing (Route model binding)*

### SLIDE 19 `[CORE]`
Title: Forms + Validation — dari `$errors[]` manual ke `validate()`
`roadmap: Databases → Forms, Validation, Manual validation, Error messages`
Main Content: `.cmp` — 15 baris `trim`/`empty`/`filter_var` versus
`$request->validate(['name' => 'required|string|max:100', 'email' => 'required|email'])`.
Speaker Notes: Recall Part 9 deck lama: kumpulkan error, cek `empty()`,
`filter_var` — sekarang satu panggilan. Kalau gagal, Laravel otomatis redirect
balik + bawa error + old input. Sebut `useForm()` di React: `data`/`setData`
untuk nilai input, `errors` untuk pesan per field.

### SLIDE 20 `[CORE]`
Title: update & Route Model Binding
`roadmap: Routing → Route model binding`, `Databases → CRUD Operations`
Main Content: `.cmp` — `UPDATE ... SET ... WHERE id=:id` versus
`public function update(Request $request, Student $student)` +
`$student->update($validated)`.
Speaker Notes: Tunjukkan Eloquent tahu WHERE-nya dari model via Route Model
Binding: `{student}` otomatis jadi object, 404 kalau tak ada — pengganti
`findOrFail` + cek manual. `destroy()` pakai `@method('DELETE')` untuk method
spoofing (recall Part 8 deck lama: hapus wajib POST, bukan link).

### SLIDE 21 `[LIVE]`
Title: 🎬 Live Coding #5 — create & store (validasi + PRG)
Main Content: controller `create()` (return view form) + `store(Request $request)`
(validate → `Student::create($validated)` → redirect + flash).
`roadmap: Databases → CRUD Operations, Forms, Validation`
Speaker Notes: Tulis utuh di proyektor. Sorot PRG jadi satu baris
`return redirect()->route('students.index')->with('success', ...)` —
bandingkan dengan `header('Location:...'); exit;` manual. (Live #5.)

### SLIDE 22 `[LIVE]`
Title: 🎬 Live Coding #6 — edit, update & destroy
Main Content: form edit terisi data lama (`value="{{ old('name', $student->name) }}"`)
+ `update()` + tombol hapus POST + `delete()`.
`roadmap: Databases → CRUD Operations, Eloquent ORM`, `Routing → Route model binding`
Speaker Notes: Tunjukkan form terisi otomatis, old input saat error, dan
`$student->delete()`. Setelah ini CRUD lengkap berdiri — sama seperti akhir
Part 8 deck lama. (Live #6.)

### SLIDE 23 `[LIVE]`
Title: 🎬 Live Coding #7 — search & pagination
Main Content: `Student::when($q, fn($q) => $q->where('name','like',"%$q%"))`
+ `paginate(10)` + `{{ $students->links() }}`.
`roadmap: Databases → Query scopes, Pagination, Query Builder`
Speaker Notes: Recall search prepared statement Part 6 deck lama — sekarang
aman default karena Eloquent pakai binding. Recall `LIMIT`/`OFFSET` self-study
deck lama — sekarang satu baris. (Live #7.)

### SLIDE 24 `[LIVE]`
Title: 🎬 Live Coding #8 — debugging & error handling
Main Content: `dd($students)`, `logger()->info(...)`, `abort(404)`,
`Log::error(...)`.
`roadmap: Logging & Debugging → Debugging basics, Logging Basics,
Handling Exceptions, HTTP Exceptions`
Speaker Notes: Pengganti `var_dump` dari Part 1 deck lama. Recall
`try { new PDO } catch (PDOException $e)` di Part 3 deck lama — Laravel
menangkap exception dan menampilkan halaman error rapi. (Live #8.)

---

## Part 6 — Relasi & Peta Jalan `[CORE: 4, LIVE: 0]`

*roadmap: Relationships + seluruh sisa roadmap*

### SLIDE 25 `[CORE]`
Title: Ke mana setelah ini — melacak progres di roadmap.sh
`roadmap: seluruh node [PETA]`
Main Content: Screenshot http://roadmap.sh/laravel dengan tanda "kita di sini"
di request–response/route/Eloquent/React, dan "selanjutnya" pada Auth,
Testing, Advanced.
[IMAGE PLACEHOLDER]
Screenshot roadmap.sh/laravel dengan penanda posisi.
Speaker Notes: Buka roadmap.sh/laravel di proyektor. Tunjukkan node mana yang
sudah kita sentuh hari ini, dan mana yang tersisa. Ini peta belajar mandiri
mereka — bukan PR.

### SLIDE 26 `[CORE]`
Title: Relationships — yang di deck lama jadi PR
`roadmap: Databases → Relationships`
Main Content: Recall capstone guide deck lama: "relasi students↔courses
sengaja belum dijawab". Sekilas: `hasMany`/`belongsTo`/`belongsToMany` +
`foreignId('student_id')->constrained()`. Sebut `ON DELETE CASCADE` vs
`RESTRICT`.
Speaker Notes: Tidak didemokan penuh — cukup memancing rasa ingin tahu. Recall
pertanyaan "CASCADE vs RESTRICT" di capstone guide lama: sekarang jawabannya
satu method. Arahkan ke dokumentasi.

### SLIDE 27 `[CORE]`
Title: Recap — 6 file plain PHP → 1 resource Laravel
`roadmap: ringkasan seluruh node [CORE]`
Main Content: Tabel pemetaan lengkap proyek lama → struktur Laravel.
Speaker Notes: Ringkasan visual seluruh sesi. Momen "lihat betapa jauhnya".
Bandingkan jumlah baris: `phpdeck/project` vs `lara-student`.

### SLIDE 28 `[CORE]`
Title: Latihan mandiri & penutup
`roadmap: peta jalan lanjutan (seluruh node [PETA])`
Main Content: Tugas: porting entity `students` (dari nol, di Laravel) — atau
opsional `courses` bila ingin tantangan. Troubleshooting umum (migrate gagal,
`.env` salah, 500 di production). Link: http://roadmap.sh/laravel untuk
melacak progres mandiri.
Speaker Notes: Akhiri dengan tugas paralel persis seperti capstone guide lama,
supaya penilaiannya konsisten. Ingatkan slide 25: roadmap.sh adalah peta
lanjutan mereka.

---

## Catatan Teknis (untuk implementasi deck)

- **Infrastruktur:** salin pola `learn-php` → `lardeck.html` di root Laravel
  repo, `lardeck/slides/*.md`, `lardeck/css/lardeck.css` (bisa memakai ulang
  `phpdeck.css` persis, ganti nama saja).
- **Server:** deck di port 8000 (`npm start`), aplikasi Laravel di port 8001
  (`php artisan serve --port=8001`) — konsisten dengan konvensi deck lama.
- **Port project referensi:** `lardeck/project/lara-student/` = Student
  Management System versi Laravel, dibagikan setelah sesi.
- **8 slot live coding** (slide 5, 10, 14, 18, 21, 22, 23, 24) sengaja jadi
  tulang punggung kedalaman sesi; slide CORE-nya sengaja tipis.
- **Setiap `.cmp`** membandingkan kode NYATA dari `phpdeck/project/`, bukan
  kode karangan — supaya peserta bisa membuka file aslinya dan mencocokkan.
- **Setiap slide mencantumkan `roadmap:` tag** yang menunjuk ke node
  roadmap.sh — peserta bisa melacak posisi belajar mereka di
  http://roadmap.sh/laravel.
