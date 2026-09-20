<!-- .slide: id="part-5" -->
<p class="part-label">Part 5 · Forms, Validation &amp; CRUD <span class="badge badge-core">Core</span></p>

# Forms, Validation &amp; CRUD

## Dari `$errors[]` manual ke `validate()`

Note: **🗣️ Ngomong ke Peserta:**
"Ini part terbesar dan paling penting — di sinilah semua bagian ketemu. Form dari Part 2, model dari Part 3, tampilan dari Part 4. Kita rakit CRUD lengkap, dan lihat bagaimana Laravel menangani validasi yang kemarin kita tulis manual belasan baris."

**🎯 Poin Kunci di Layar:**
- Sebut ini "part sintesis".
- Ada 4 slot live coding; peserta fokus menyimak alur.



<p class="part-label">Part 5 · Forms, Validation &amp; CRUD</p>

## Validasi &amp; menampilkan error

<div class="cmp">
<div class="cmp-php">
<h4>Deck lama: manual, belasan baris</h4>

```php
$errors = [];
$name = trim($_POST['name'] ?? '');
if (empty($name)) $errors[] = 'Nama wajib diisi.';
elseif (strlen($name) > 100) $errors[] = 'Nama terlalu panjang.';

$email = trim($_POST['email'] ?? '');
if (empty($email)) $errors[] = 'Email wajib diisi.';
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL))
    $errors[] = 'Format email tidak valid.';

if (empty($errors)) { /* INSERT */ }
```

</div>
<div class="cmp-laravel">
<h4>Laravel: satu panggilan</h4>

```php
$validated = $request->validate([
    'name'  => ['required', 'string', 'max:100'],
    'email' => ['required', 'email', 'max:150'],
    'major' => ['required', 'string', 'max:80'],
]);
```

Gagal? **Otomatis** redirect balik, bawa error + input lama.

</div>
</div>

<p class="filename">resources/views/students/_form.blade.php</p>

```blade
<input name="name" value="{{ old('name', $student->name ?? '') }}">
@error('name') <span class="error">{{ $message }}</span> @enderror
```

<p class="fineprint"><code>old()</code> mengembalikan input lama (user tak perlu ketik ulang); <code>@error</code> menampilkan pesan khusus per field. Aturan <code>max:100</code> disamakan dengan <code>VARCHAR(100)</code> di migration.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Coba lihat kiri — validasi yang kalian tulis di Part 9 kemarin. Kumpulkan error dalam array, cek satu-satu dengan `empty`, `trim`, `strlen`, `filter_var`. Belasan baris, dan tiap kolom baru tambah lagi. Kanan: satu panggilan `validate()`. Kita cuma nyatakan aturannya, Laravel urus sisanya."

"Bonusnya besar: kalau validasi gagal, Laravel OTOMATIS mengarahkan user balik ke form, membawa pesan error, DAN membawa kembali yang tadi mereka ketik. Semua yang di Part 9 kita kerjakan manual — sekarang gratis."

"Perhatikan baris Blade di bawah. `old('name', ...)` mengembalikan input lama — user tidak perlu ketik ulang. Argumen keduanya, `$student->name ?? ''`, untuk form edit: ada data lama? pakai itu. Jadi SATU file form ini dipakai untuk create DAN edit. Dan `@error('name')` menampilkan pesan hanya di field yang salah. Perhatikan juga `max:100` — angkanya sama dengan `VARCHAR(100)` di migration kita; validasi PHP dan batas database terjaga sinkron."

**🎯 Poin Kunci di Layar:**
- Hitung kasar baris: kiri ~12, kanan ~5.
- Tekankan "otomatis redirect + old input" — penghemat terbesar.
- Tunjukkan `_form.blade.php` asli: satu form untuk create + edit.



<p class="part-label">Part 5 · Forms, Validation &amp; CRUD <span class="badge badge-live">Live #5</span></p>

## Live Coding: create &amp; store

<p class="filename">StudentController.php</p>

```php
public function create(): View
{
    return view('students.create');
}

public function store(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'name'  => ['required', 'string', 'max:100'],
        'email' => ['required', 'email', 'max:150'],
        'major' => ['required', 'string', 'max:80'],
    ]);

    Student::create($validated);

    return redirect()
        ->route('students.index')
        ->with('success', 'Data siswa berhasil ditambahkan.');
}
```

<p class="fineprint">Deck lama: <code>prepare()</code> + <code>execute()</code> + <code>setFlash()</code> + <code>header('Location:...')</code> + <code>exit</code>; semuanya jadi 4 baris yang jelas.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Live coding pertama di Part 5: menambah data. Dua method. `create()` cuma menampilkan form. `store()` memproses data yang dikirim."

"Perhatikan urutannya: validasi DULU, baru simpan. Jangan pernah menyentuh database sebelum validasi lolos. Setelah `Student::create($validated)`, data masuk. Lalu redirect ke daftar dengan pesan sukses."

"Bandingkan dengan kemarin: `prepare()`, `execute()`, `setFlash()`, `header('Location: ...')`, lalu `exit`. Lima langkah dengan detail yang harus diingat. Sekarang empat baris. Ingat pembahasan PRG dan kenapa `exit` wajib setelah `header`? Di `redirect()` Laravel, itu sudah diurus."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tulis `create()` dan `store()` di proyektor.
- Tekankan urutan: validasi → simpan → redirect+flash.



<p class="part-label">Part 5 · Forms, Validation &amp; CRUD <span class="badge badge-live">Live #6</span></p>

## Live Coding: edit, update &amp; destroy

<p class="filename">StudentController.php</p>

```php
// Route model binding: {student} otomatis jadi objek Student, 404 kalau tak ada
public function edit(Student $student): View
{
    return view('students.edit', compact('student'));
}

public function update(Request $request, Student $student): RedirectResponse
{
    $validated = $request->validate([ /* aturan sama seperti store */ ]);

    $student->update($validated);

    return redirect()->route('students.index')
        ->with('success', 'Data siswa berhasil diperbarui.');
}

public function destroy(Student $student): RedirectResponse
{
    $student->delete();

    return redirect()->route('students.index')
        ->with('success', 'Data siswa berhasil dihapus.');
}
```

Note: **🗣️ Ngomong ke Peserta:**
"Sekarang edit dan hapus. Dan di sini ada konsep penting: perhatikan `Student $student` di dalam kurung. Itu bukan `$id` biasa — itu OBJEK model utuh. Namanya route model binding."

"Cara kerjanya: route kita punya `{student}` — ingat Part 2? Laravel melihat tipe parameter `Student`, lalu otomatis mencari siswa itu di database berdasarkan ID dari URL. Kalau tidak ketemu, langsung 404. Jadi kita tidak perlu lagi menulis `SELECT ... WHERE id = ?` lalu cek manual 'ada atau tidak' seperti di self-study Part 7 kemarin."

"Perhatikan juga `update()` hampir identik dengan `store()` — bedanya `create` jadi `update`. Dan `$student->update()`: Eloquent sudah tahu baris mana yang harus diubah. Kita tidak menulis WHERE manual — artinya kita tidak bisa LUPA menulis WHERE. Kesalahan yang di deck lama bisa menimpa SELURUH tabel."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tulis `edit`, `update`, `destroy`.
- Sorot `Student $student` = route model binding (404 otomatis).
- Tekankan: WHERE id tidak bisa lupa lagi.



<p class="part-label">Part 5 · Forms, Validation &amp; CRUD <span class="badge badge-live">Live #7</span></p>

## Live Coding: search &amp; pagination

<p class="filename">StudentController.php</p>

```php
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
```

<p class="filename">resources/views/students/index.blade.php</p>

```blade
{{ $students->links() }}
```

<p class="fineprint">Deck lama: <code>prepare()</code> + <code>execute(['q' => '%'.$q.'%'])</code> untuk search, dan <code>LIMIT/OFFSET</code> manual untuk pagination. Sekarang <code>when()</code> + <code>paginate()</code>.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Terakhir, search dan pagination. Perhatikan `when()` — cara elegan menulis query kondisional: 'kalau `$q` ada isinya, tambahkan kondisi where; kalau kosong, jangan'. Satu query, dua situasi."

"Dan soal keamanan — ingat Part 6 kemarin, search yang rentan SQL Injection? Di situ kita belajar input user tidak boleh disambung langsung ke SQL. Di sini `where('name', 'like', ...)` otomatis pakai prepared statement. `$q` masuk sebagai DATA, bukan bagian perintah. Rentan SQL Injection tidak akan terjadi — bukan karena kita ingat-ingat, tapi karena itu cara kerja Eloquent."

"`paginate(10)` satu baris untuk memotong 10 per halaman. Kemarin kita bahas LIMIT/OFFSET di self-study. Sekarang tinggal bilang '10 per halaman', dan `{{ $students->links() }}` menggambar tombol halamannya."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tulis `index()` dengan `when()` + `paginate()`.
- Sambungkan ke search SQL Injection Part 6 deck lama.



<p class="part-label">Part 5 · Forms, Validation &amp; CRUD <span class="badge badge-live">Live #8</span></p>

## Live Coding: debugging &amp; error handling

<p class="filename">StudentController.php &amp; di mana saja</p>

```php
dd($students);              // dump & die: lihat isi variabel, lalu berhenti
dump($students);            // dump tapi lanjut jalan

logger()->info('Jumlah siswa: ' . Student::count());   // tulis ke log
Log::error('Gagal menyimpan', ['data' => $validated]);

abort(404);                 // hentikan dengan status HTTP 404
abort_if(! $student, 404);  // hentikan KALAU kondisi terpenuhi
```

<div class="checkpoint">
<b>Route model binding = error handling gratis</b><br>
<code>{student}</code> yang tidak ditemukan &rarr; Laravel otomatis <code>abort(404)</code>. Kita tidak perlu menulis cek manual.
</div>

Note: **🗣️ Ngomong ke Peserta:**
"Terakhir: bagaimana kalau ada yang salah? Kemarin alat utama kita `var_dump`. Sekarang ada `dd()` — 'dump and die'. Isi variabel, lalu hentikan program tepat di situ. Ini cara tercepat memahami apa yang terjadi di tengah alur."

"Untuk mencatat, ada `logger()` dan `Log`. Kenapa lebih baik dari `echo`? Karena log tidak mengotori halaman yang dilihat user — dia ditulis ke file terpisah. Penting di production: kalau ada error jam 2 pagi, kalian bisa buka log-nya besok."

"Dan `abort(404)` — ingat route model binding tadi? Kalau `{student}` tidak ditemukan, Laravel sudah otomatis memanggil ini. Ingat `try { new PDO } catch (PDOException $e)` kemarin? Laravel juga menangkap semua exception dan menampilkan halaman error yang rapi — atau JSON untuk API."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tunjukkan `dd()` di `tinker` atau di controller.
- Tekankan `abort(404)` sudah otomatis dari route model binding.
- Sebut: ini menggantikan `var_dump` dan `try/catch` manual.
