<!-- .slide: id="part-3" -->
<p class="part-label">Part 3 · Database &amp; Eloquent <span class="badge badge-core">Core</span></p>

# Database &amp; Eloquent

## Dari `schema.sql` ke kode yang bisa di-version-control

Note: **🗣️ Ngomong ke Peserta:**
"Sekarang bagian yang paling memuaskan: database. Ingat kemarin, untuk bikin tabel `students`, kita bikin `schema.sql`, import manual lewat phpMyAdmin? Kalau ada perubahan, edit lagi, import lagi, dan tidak ada catatan perubahan. Hari ini kita ubah itu: schema tabel jadi KODE."

**🎯 Poin Kunci di Layar:**
- Ingatkan momen import `schema.sql` manual di deck lama.
- Janjikan: setelah Part 3, "closed loop" data jauh lebih ringkas.



<p class="part-label">Part 3 · Database &amp; Eloquent</p>

## Migration: Skema Database sebagai Kode

<div class="cmp">
<div class="cmp-php">
<h4><code>schema.sql</code> (deck lama)</h4>

```sql
CREATE TABLE students (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    major VARCHAR(80)  NOT NULL
);
```

Dijalankan manual. Tidak ada riwayat perubahan.

</div>
<div class="cmp-laravel">
<h4>Migration (Laravel)</h4>

```php
Schema::create('students', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('major');
    $table->timestamps();
});
```

<code>up()</code> / <code>down()</code>: maju &amp; mundur.

</div>
</div>

<p class="fineprint">Migration = <code>schema.sql</code> yang bisa di-<i>rollback</i> dan di-<i>diff</i> di git. File-nya punya dua method: <code>up()</code> untuk membuat, <code>down()</code> untuk membatalkan.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Lihat dua kolom ini. Di kiri: `schema.sql` kemarin. Di kanan: migration. Kolomnya sama persis — `id`, `name`, `email`, `major`. Bedanya cuma cara menulis, plus `timestamps()` yang otomatis menambah `created_at` dan `updated_at`."

"Perhatikan juga: tidak ada `VARCHAR(100)` lagi. Kita cukup bilang `$table->string('name')`. Laravel yang mengurus detail panjangnya. Yang penting kalian lihat polanya: satu baris PHP mewakili satu kolom."

"Kenapa migration lebih baik? Tiga alasan. Bisa di-rollback — ada `down()`. Bisa di-diff di git. Dan siapa pun yang clone proyek cukup jalankan satu perintah, database-nya jadi identik. Bayangkan tim berlima: semuanya dapat struktur sama tanpa kirim-kiriman file SQL."

**🎯 Poin Kunci di Layar:**
- Tunjukkan kedua file (schema.sql vs migration) berdampingan.
- Tekankan: kolom sama, tapi migration punya `up()` dan `down()`.
- Sebut tabel `migrations` = catatan migrasi mana yang sudah jalan.



<p class="part-label">Part 3 · Database &amp; Eloquent <span class="badge badge-live">Live #3</span></p>

## Menjalankan Migration &amp; Seeder

<p class="filename">terminal</p>

```bash
php artisan make:model Student -m   # model + file migration sekaligus
php artisan migrate --seed          # buat tabel &amp; isi data awal
php artisan migrate:fresh --seed    # reset sekali jalan
```

<p class="fineprint">Seeder = pengganti <code>seed.sql</code>, tapi bisa dijalankan ulang. <code>migrate:fresh --seed</code> = bersih dalam hitungan detik.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ini urutan perintah yang akan kita pakai live. Perhatikan `-m` di `make:model Student -m` — itu sekaligus membuat file migration. Lalu `migrate` membuat tabelnya. Seeder mengisi data awal."

"Dan ini yang paling menyelamatkan saat ngoding: `migrate:fresh --seed` — satu perintah, database dihapus, dibuat ulang, diisi ulang. Kemarin itu tiga langkah manual di phpMyAdmin: drop tabel, import schema, import seed. Sekarang satu baris."

"Ayo kita kerjakan bersama sekarang. [Aksi Live] Jalankan `make:model Student -m`, buka file migration-nya, isi kolomnya, lalu `migrate --seed`."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: `make:model Student -m` → isi kolom → `migrate --seed`.
- Tekankan `migrate:fresh --seed` sebagai "reset sekali jalan".
- Sebut tabel `migrations` = catatan migrasi mana yang sudah jalan.



<p class="part-label">Part 3 · Database &amp; Eloquent</p>

## Eloquent ORM: Menggantikan PDO Manual

<div class="cmp">
<div class="cmp-php">
<h4>PDO manual (deck lama)</h4>

```php
$stmt = $pdo->query("SELECT * FROM students");
$students = $stmt->fetchAll();

foreach ($students as $s) {
    echo $s['name'];
}
```

Kita tulis SQL sendiri, akses per kolom array.

</div>
<div class="cmp-laravel">
<h4>Eloquent (Laravel)</h4>

```php
$students = Student::all();

foreach ($students as $s) {
    echo $s->name;
}
```

Tidak ada SQL. Akses kolom seperti properti objek.

</div>
</div>

Note: **🗣️ Ngomong ke Peserta:**
"Ini momen paling penting di Part 3. Kiri: kode PDO kemarin — koneksi, prepare, query, fetchAll, akses array. Kanan: `Student::all()`. Satu baris."

"Perhatikan perbedaan aksesnya: kemarin `$s['name']` pakai kurung siku karena hasil query itu array; sekarang `$s->name` pakai panah karena Eloquent mengembalikan objek. Satu perbedaan kecil, tapi ini yang akan kalian tulis ratusan kali."

"Yang perlu kalian sadari: koneksi database yang kemarin kita konfigurasi manual TIDAK hilang. Dia ada di belakang layar, dan Eloquent yang memakainya. Jadi semua pemahaman kalian tentang koneksi dan query tetap berlaku — kita cuma naik satu tingkat abstraksi."

**🎯 Poin Kunci di Layar:**
- Tunjuk `$s['name']` (array) vs `$s->name` (objek).
- Tekankan: PDO tidak hilang, hanya disembunyikan Eloquent.
- `Student::all()` = satu baris menggantikan query + fetchAll.



<p class="part-label">Part 3 · Database &amp; Eloquent</p>

## Model &amp; Mass Assignment (`$fillable`)

<p class="filename">app/Models/Student.php</p>

```php
class Student extends Model {
    protected $fillable = ['name', 'email', 'major'];
}
```

<p class="fineprint"><code>$fillable</code> = <b>whitelist</b> kolom yang boleh diisi massal. Sejajar dengan prinsip whitelist di Part 9 deck lama: <code>in_array($_POST['major'], $jurusanValid)</code>: sebut yang <b>boleh</b>, bukan yang dilarang.</p>

Note: **🗣️ Ngomong ke Peserta:**
"`$fillable`. Ini daftar kolom yang BOLEH diisi lewat `Student::create()`. Ingat whitelist di Part 9 kemarin — kita cek `in_array($_POST['major'], $jurusanValid)`? Ini prinsip yang sama: sebutkan yang BOLEH, bukan yang dilarang."

"Tanpa ini, Laravel justru menolak `create()`, demi mencegah user menimpa kolom seperti `id` lewat form. Jadi ini bukan formalitas — ini pertahanan pertama kalian terhadap mass assignment attack."

"Ingat tiga kolomnya: `name`, `email`, `major`. Persis seperti di migration tadi. Kalau kalian tambah kolom di migration, tambahkan juga di sini, kalau tidak, `create()` akan mengabaikannya diam-diam."

**🎯 Poin Kunci di Layar:**
- Sambungkan `$fillable` ke prinsip whitelist Part 9 deck lama.
- Tekankan: sebut yang BOLEH, bukan yang dilarang.
- `$fillable` harus sinkron dengan kolom di migration.



<p class="part-label">Part 3 · Database &amp; Eloquent</p>

## Creating Responses: Inertia, Redirect, JSON

<p class="filename">app/Http/Controllers/StudentController.php</p>

```php
use Inertia\Inertia;

// 1. Render React (kirim props)      2. Redirect (pola PRG)
return Inertia::render('Students/Index', ['students' => $students]);
return redirect()->route('students.index')->with('success', 'Tersimpan.');

// 3. Raw JSON (untuk API / debugging)
return response()->json($students);
```

<p class="fineprint">Controller mengembalikan Response eksplisit. Argumen kedua <code>Inertia::render()</code> adalah <b>props</b> ke React. React tidak menyentuh database — hanya menerima data.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Tanya ke peserta: Di deck lama, 'PHP mengirim output' itu seperti apa? Jawab: echo, header('Location: ...') — sekarang eksplisit jadi Response object."

"Terakhir untuk Part 3: bagaimana controller 'menjawab'? Di PHP kemarin, jawabannya implisit — kita `echo` HTML, atau `header('Location: ...')` lalu `exit`. Sekarang eksplisit: controller MENGEMBALIKAN sesuatu, dan kita pilih jenisnya."

"Tiga yang sering dipakai. Satu: `Inertia::render()` — ini yang paling sering kalian pakai. Perhatikan argumen keduanya: itu DATA yang dikirim ke React. Jadi controller tidak menggambar HTML; dia menyerahkan data, React yang menggambar. Ini pemisahan yang bersih: Laravel urus data, React urus tampilan."

"Dua: `redirect()` — mengarahkan ke halaman lain; ini pola PRG yang kita pelajari kemarin, dan Laravel otomatis menambahkan `exit` yang gampang kita lupakan. Tiga: `response()->json()` — data mentah, untuk API atau debugging."

"Satu hal penting yang perlu kalian pegang: React TIDAK PERNAH menyentuh database. Tidak ada query di JSX. Semua data datang dari controller lewat props. Kalau kalian lihat kode React yang mencoba akses database langsung, itu tanda ada yang salah."

**🎯 Poin Kunci di Layar:**
- Tunjukkan `Inertia::render('Students/Index', [...])` di controller asli.
- Tekankan: argumen kedua = data yang jadi props di React.
- Sebut `redirect()->route(...)` = PRG deck lama; `json()` = pintu ke API.
- Jawab `.ask`: `echo` / `header()` — sekarang jadi Response object.