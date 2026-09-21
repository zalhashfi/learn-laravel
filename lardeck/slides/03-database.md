<!-- .slide: id="part-3" -->
<p class="part-label">Part 3 · Database &amp; Eloquent <span class="badge badge-core">Core</span></p>

# Database &amp; Eloquent

## Dari `schema.sql` ke kode yang bisa di-version-control

Note: **🗣️ Ngomong ke Peserta:**
"Sekarang bagian yang paling memuaskan: database. Ingat kemarin, untuk bikin tabel `students`, kita bikin `schema.sql`, import manual lewat phpMyAdmin? Kalau ada perubahan, edit lagi, import lagi, dan tidak ada catatan perubahan. Hari ini kita ubah itu: schema tabel jadi KODE."

**🎯 Poin Kunci di Layar:**
- Ingatkan momen import `schema.sql` manual di deck lama.
- Janjikan: setelah Part 3, "closed loop" data jauh lebih ringkas.



<p class="part-label">Part 3 · Database &amp; Eloquent <span class="badge badge-live">Live #3</span></p>

## Migration &amp; Seeder: schema + data sebagai kode

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
    $table->string('name', 100);
    $table->string('email', 150);
    $table->string('major', 80);
    $table->timestamps();
});
```

<code>up()</code> / <code>down()</code>: bisa maju &amp; mundur.

</div>
</div>

<p class="filename">terminal</p>

```bash
php artisan make:model Student -m   # -m sekaligus buat migration
php artisan migrate                 # buat tabel di database
php artisan db:seed                 # isi data awal (StudentSeeder)

# reset database + isi ulang sekali jalan:
php artisan migrate:fresh --seed
```

<p class="fineprint">Seeder = pengganti <code>seed.sql</code>, tapi bisa dijalankan ulang. <code>migrate:fresh --seed</code> = bersih dalam hitungan detik; kemarin butuh drop tabel + import schema + import seed manual.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Lihat dua kolom ini. Di kiri: `schema.sql` kemarin. Di kanan: migration. Kolomnya sama persis — `id`, `name`, `email`, `major`. Bedanya cuma cara menulis, plus `timestamps()` yang otomatis menambah `created_at` dan `updated_at`."

"Kenapa migration lebih baik? Tiga alasan. Bisa di-rollback — ada `down()`. Bisa di-diff di git. Dan siapa pun yang clone proyek cukup jalankan satu perintah, database-nya jadi identik. Bayangkan tim berlima: semuanya dapat struktur sama tanpa kirim-kiriman file SQL."

"Perhatikan `-m` di `make:model Student -m` — itu sekaligus membuat file migration. Lalu `migrate` membuat tabelnya. Seeder mengisi data awal. Dan ini yang paling menyelamatkan saat ngoding: `migrate:fresh --seed` — satu perintah, database dihapus, dibuat ulang, diisi ulang. Kemarin itu tiga langkah manual di phpMyAdmin."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: `make:model Student -m` → isi kolom → `migrate` → `db:seed`.
- Tunjukkan kedua file (schema.sql vs migration) berdampingan.
- Tekankan `migrate:fresh --seed` sebagai "reset sekali jalan".
- Sebut tabel `migrations` = catatan migrasi mana yang sudah jalan.



<p class="part-label">Part 3 · Database &amp; Eloquent</p>

## Eloquent &amp; `$fillable`: PDO digantikan

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

<p class="filename">app/Models/Student.php</p>

```php
class Student extends Model
{
    protected $fillable = ['name', 'email', 'major'];
}
```

<p class="fineprint"><code>$fillable</code> = <b>whitelist</b> kolom yang boleh diisi massal. Sejajar dengan prinsip whitelist di Part 9 deck lama: <code>in_array($_POST['major'], $jurusanValid)</code>: sebut yang <b>boleh</b>, bukan yang dilarang.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ini momen paling penting di Part 3. Kiri: kode PDO kemarin — koneksi, prepare, query, fetchAll, akses array. Kanan: `Student::all()`. Satu baris. Perhatikan perbedaan aksesnya: kemarin `$s['name']` pakai kurung siku karena hasil query itu array; sekarang `$s->name` pakai panah karena Eloquent mengembalikan objek."

"Yang perlu kalian sadari: koneksi database yang kemarin kita konfigurasi manual TIDAK hilang. Dia ada di belakang layar, dan Eloquent yang memakainya. Jadi semua pemahaman kalian tentang koneksi dan query tetap berlaku."

"Terakhir, `$fillable`. Ini daftar kolom yang BOLEH diisi lewat `Student::create()`. Ingat whitelist di Part 9 kemarin — kita cek `in_array($_POST['major'], $jurusanValid)`? Ini prinsip yang sama: sebutkan yang BOLEH, bukan yang dilarang. Tanpa ini, Laravel justru menolak, demi mencegah user menimpa kolom seperti `id` lewat form."

**🎯 Poin Kunci di Layar:**
- Tunjuk `$s['name']` (array) vs `$s->name` (objek).
- Tekankan: PDO tidak hilang, hanya disembunyikan Eloquent.
- Sambungkan `$fillable` ke prinsip whitelist Part 9 deck lama.



<p class="part-label">Part 3 · Database &amp; Eloquent</p>

## Creating Responses: Inertia, Redirect, JSON

<p class="filename">app/Http/Controllers/StudentController.php</p>

```php
use Inertia\Inertia;

// 1. Kembalikan halaman React (paling umum)
return Inertia::render('Students/Index', [
    'students' => $students,
    'q' => $q,
]);

// 2. Redirect ke halaman lain (pola PRG)
return redirect()->route('students.index')
    ->with('success', 'Data siswa berhasil ditambahkan.');

// 3. Kembalikan data mentah (untuk API / debugging)
return response()->json($students);
```

<div class="ask"><b>Di deck lama, "PHP mengirim output" itu seperti apa?</b> (petunjuk: <code>echo</code>, <code>header('Location: ...')</code>)</div>

<p class="fineprint">Sekarang <b>eksplisit</b>: controller <i>mengembalikan</i> Response, dan kita pilih jenisnya. Perhatikan <code>Inertia::render()</code>: argumen kedua adalah <b>data</b> yang dikirim ke React sebagai <i>props</i>. React tidak pernah menyentuh database — dia hanya menerima.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Terakhir untuk Part 3: bagaimana controller 'menjawab'? Di PHP kemarin, jawabannya implisit — kita `echo` HTML, atau `header('Location: ...')` lalu `exit`. Sekarang eksplisit: controller MENGEMBALIKAN sesuatu, dan kita pilih jenisnya."

"Tiga yang sering dipakai. Satu: `Inertia::render()` — ini yang paling sering kalian pakai. Perhatikan argumen keduanya: itu DATA yang dikirim ke React. Jadi controller tidak menggambar HTML; dia menyerahkan data, React yang menggambar. Ini pemisahan yang bersih: Laravel urus data, React urus tampilan."

"Dua: `redirect()` — mengarahkan ke halaman lain; ini pola PRG yang kita pelajari kemarin, dan Laravel otomatis menambahkan `exit` yang gampang kita lupakan. Tiga: `response()->json()` — data mentah, untuk API atau debugging."

"Satu hal penting yang perlu kalian pegang: React TIDAK PERNAH menyentuh database. Tidak ada query di JSX. Semua data datang dari controller lewat props. Kalau kalian lihat kode React yang mencoba akses database langsung, itu tanda ada yang salah."

**🎯 Poin Kunci di Layar:**
- Tunjukkan `Inertia::render('Students/Index', [...])` di controller asli.
- Tekankan: argumen kedua = data yang jadi props di React.
- Sebut `redirect()->route(...)` = PRG deck lama; `json()` = pintu ke API.
- Jawab `.ask`: `echo` / `header()` — sekarang jadi Response object.
