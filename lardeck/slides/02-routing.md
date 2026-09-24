<!-- .slide: id="part-2" -->
<p class="part-label">Part 2 · Routing &amp; Controllers <span class="badge badge-core">Core</span></p>

# Routing &amp; Controllers

## Pintu masuk yang sekarang eksplisit

Note: **🗣️ Ngomong ke Peserta:**
"Di Part 1 kita sudah punya proyek Laravel yang jalan. Sekarang pertanyaannya: waktu user buka `localhost:8000/students`, apa yang terjadi? Di PHP kemarin, jawabannya sederhana: ada file bernama `index.php`. Di Laravel, jawabannya ada di satu file khusus: `routes/web.php`. Ini yang kita bongkar sekarang."

**🎯 Poin Kunci di Layar:**
- Ingatkan: dulu routing = nama file. Sekarang = daftar eksplisit.
- Arahkan ke `routes/web.php` di proyek mereka.



<p class="part-label">Part 2 · Routing &amp; Controllers</p>

## Route dasar, URL lama vs baru, &amp; parameter

<div class="cmp">
<div class="cmp-php">
<h4>Plain PHP: "routing" = nama file</h4>

```
GET  index.php
GET  edit.php?id=5
POST delete.php?id=5
```

URL kaku. Ambil data? `$_GET['id']`.

</div>
<div class="cmp-laravel">
<h4>Laravel: route eksplisit</h4>

```php
Route::get('/students', ...);
Route::get('/students/{id}', fn ($id) => "Siswa {$id}");
```

URL "berbicara". `{id}` ditangkap dari URL.

</div>
</div>

<p class="fineprint">Tidak ada konsep baru: cuma daftar: <b>URL mana &rarr; kode mana</b>. <code>{id}</code> menggantikan <code>$_GET['id']</code>. Sebut istilah <i>RESTful</i>, jangan didalami.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Bandingkan dua kolom ini. Di kiri, URL kita cuma nama file. Mau edit siswa nomor 5? `edit.php?id=5`. Di kanan, versi Laravel: URL-nya jadi lebih bermakna. `GET /students` untuk lihat semua, dan `{id}` di dalam kurung kurawal menangkap bagian URL."

"Nah, pertanyaan pentingnya: di PHP kemarin, `id` itu kita ambil dari mana? Betul — `$_GET['id']`. Sekarang Laravel yang mengambilnya dari URL dan mengoper ke function sebagai parameter. Hasilnya persis sama. Jadi tidak ada konsep baru di sini — cuma cara menuliskannya yang lebih rapi dan terbaca."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tulis route parameter di `routes/web.php`, tunjukkan di browser.
- Tekankan: `{id}` = pengganti `$_GET['id']`.

**🛠️ Aksi Nyata (File & Browser):**
1. **Buka File:** `routes/web.php`
2. **Tulis (Uji Coba Cepat Parameter URL):**
   ```php
   Route::get('/demo-student/{id}', function ($id) {
       return "Siswa dengan ID: " . $id;
   });
   ```
3. **Buka Browser:** Akses `http://localhost:8000/demo-student/42`
   - Tunjukkan teks `"Siswa dengan ID: 42"` muncul langsung di browser tanpa perlu membuat file `demo-student.php`.



<p class="part-label">Part 2 · Routing &amp; Controllers <span class="badge badge-live">Live #2</span></p>

## Resource Controller: 7 route dalam 1 baris

<div class="code-duo">
<div>
<p class="filename">routes/web.php</p>

```php
use App\Http\Controllers\StudentController;

Route::resource('students', StudentController::class);
```
</div>
<div>
<p class="filename">terminal</p>

```bash
php artisan make:controller StudentController --resource
php artisan route:list
```
</div>
</div>

<p class="fineprint">Tujuh route, satu baris. Bandingkan dengan <b>6 file terpisah</b> di proyek plain PHP.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ini momen 'oh, banyak yang gratis'. Satu baris `Route::resource()` dan Laravel membuatkan TUJUH route sekaligus: index, store, create, show, update, destroy, edit. Lengkap untuk CRUD."

"Ingat proyek kemarin? Kita bikin `index.php`, `create.php`, `edit.php`, `delete.php` — manual satu-satu. Sekarang satu baris menggantikan semuanya. Tapi perhatikan: route ini cuma PINTU. Isi logikanya tetap harus kita tulis di controller — itu slide berikutnya."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Jalankan `make:controller --resource` di terminal untuk membuat controller.
- Buka `routes/web.php`, import controller, dan tulis `Route::resource('students', StudentController::class);`.
- Jalankan `php artisan route:list` di terminal untuk membuktikan 7 route langsung muncul.

**🛠️ Aksi Nyata (File & Terminal):**
1. **Terminal:** `php artisan make:controller StudentController --resource`
2. **Buka File:** `routes/web.php`
   - Import di atas: `use App\Http\Controllers\StudentController;`
   - Tulis route: `Route::resource('students', StudentController::class);`
   - (Opsional): `Route::redirect('/', '/students');`
3. **Terminal:** Jalankan `php artisan route:list --path=students` untuk memverifikasi 7 route berhasil terdaftar.



<p class="part-label">Part 2 · Routing &amp; Controllers</p>

## Peta 7 route standar RESTful

<div class="mock-terminal">
<div class="out">GET|HEAD  students .......... students.index   &rsaquo; StudentController@index</div>
<div class="out">POST      students .......... students.store   &rsaquo; StudentController@store</div>
<div class="out">GET|HEAD  students/create ... students.create  &rsaquo; StudentController@create</div>
<div class="out">GET|HEAD  students/{student}  students.show    &rsaquo; StudentController@show</div>
<div class="out">PUT|PATCH students/{student}  students.update  &rsaquo; StudentController@update</div>
<div class="out">DELETE    students/{student}  students.destroy &rsaquo; StudentController@destroy</div>
<div class="out">GET|HEAD  students/{student}/edit  students.edit &rsaquo; StudentController@edit&nbsp;&nbsp;<span style="color:var(--pd-laravel)">(7 route)</span></div>
</div>

<p class="fineprint">Output nyata <code>php artisan route:list</code>. Empat route pertama untuk <b>membaca</b> dan menampilkan form; tiga sisanya untuk <b>mengubah</b> data.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ini hasil nyata `php artisan route:list`. Baca kolom demi kolom: paling kiri method HTTP, tengah URL, paling kanan nama route dan method controller yang menjawabnya."

"Perhatikan pola RESTful-nya. Empat baris pertama untuk membaca: index nampilkan daftar, store simpan baru, create nampilkan form, show tampilkan satu data. Tiga baris terakhir untuk mengubah: update, destroy, edit. Jadi tabel ini bukan hafalan — ini pola yang sama di Laravel mana pun."

**🎯 Poin Kunci di Layar:**
- Tunjukkan: nama route (`students.index`, dst.) dihasilkan otomatis.
- Tekankan: URL `{student}` dipakai ulang oleh beberapa method HTTP berbeda.



<p class="part-label">Part 2 · Routing &amp; Controllers</p>

## StudentController: dari 6 file jadi 1 class

<table class="plain">
<tr><th>Method controller</th><th>File lama (plain PHP)</th><th>Tugas</th></tr>
<tr><td><code>index()</code></td><td><code>index.php</code></td><td>Tampilkan daftar</td></tr>
<tr><td><code>create()</code> / <code>store()</code></td><td>form + logika POST <code>create.php</code></td><td>Tampilkan form / simpan baru</td></tr>
<tr><td><code>show()</code></td><td>(baru)</td><td>Tampilkan satu data</td></tr>
<tr><td><code>edit()</code> / <code>update()</code></td><td>GET + POST <code>edit.php</code></td><td>Tampilkan form / simpan perubahan</td></tr>
<tr><td><code>destroy()</code></td><td><code>delete.php</code></td><td>Hapus data</td></tr>
</table>

<p class="fineprint">Divisi tugasnya sama, tapi terpisah rapi: <b>method controller</b> menyiapkan data, <b>React</b> merender tampilan. Satu method = satu tugas.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Tabel ini penting banget — menjawab 'file saya yang kemarin ke mana?'. `index.php` jadi `index()`. Logika POST di `create.php` jadi `store()`. `edit.php` dan `delete.php` jadi `edit`/`update`/`destroy`."

"Perhatikan: `create.php` kemarin menangani DUA tugas — tampil form kalau GET, proses kalau POST. Di Laravel dipisah: `create()` untuk form, `store()` untuk simpan. Itu yang membuat kode lebih rapi dan mudah dites."

"Jadi enam file terpisah kemarin, sekarang jadi satu class bernama `StudentController` dengan tujuh method. Bukan karena Laravel memaksa, tapi karena memisahkan satu tugas per method itu memang lebih enak dirawat."

**🎯 Poin Kunci di Layar:**
- Telusuri tabel baris per baris — jembatan pemahaman utama.
- Tekankan pemisahan `create`/`store` dan `edit`/`update`.



<p class="part-label">Part 2 · Routing &amp; Controllers</p>

## index(): mengirim data ke React

<div class="cmp">
<div class="cmp-php">
<h4>Plain PHP: query + include view</h4>

```php
$rows = $pdo->query("SELECT * FROM students");
foreach ($rows as $s) { include 'row.php'; }
```

Data mentah, template dirakit manual.

</div>
<div class="cmp-laravel">
<h4>Laravel: index() mengirim data</h4>

```php
public function index()
{
    return Inertia::render('Students/Index', [
        'students' => Student::all(),
    ]);
}
```

Satu baris <code>Inertia::render()</code> menggantikan <code>include</code> + loop.

</div>
</div>

<p class="fineprint">Isi <code>index()</code> di proyek kalian. Data dari <code>Student::all()</code> masuk ke React sebagai <i>props</i> — kita bongkar di Part 4.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Lihat `index()`. Di kiri, cara lama: ambil data lalu `include` view sambil loop. Di kanan, `Student::all()` mengambil semua baris, lalu `Inertia::render()` mengirimkannya ke komponen React `Students/Index`."

"Satu baris itu menggantikan include plus loop. Tapi divisi tugasnya tetap sama: controller menyiapkan data, tampilan merender. Bedanya sekarang datanya menyeberang ke React, bukan ke file PHP."

"`Inertia::render()` menerima dua hal: nama komponen React-nya, dan data yang mau dikirim. Data itu nanti sampai di React sebagai `props` — persis konsep props yang kita bahas di Part 4."

**🎯 Poin Kunci di Layar:**
- Bandingkan `include` manual vs `Inertia::render()`.
- Sebut: data yang dikirim akan jadi `props` di React (Part 4).

**🛠️ Aksi Nyata (File & Kode):**
- **Buka File:** `app/Http/Controllers/StudentController.php`
- **Import di atas:** `use App\Models\Student;`, `use Inertia\Inertia;`, `use Inertia\Response;`
- **Tulis di method `index()`:**
  ```php
  public function index(): Response
  {
      return Inertia::render('Students/Index', [
          'students' => Student::all(),
      ]);
  }
  ```
- *(Catatan: Model `Student` dan datanya akan dibuat pada Part 3 Database berikutnya).*



<p class="part-label">Part 2 · Routing &amp; Controllers</p>

## SPA Navigation: &lt;Link&gt; vs &lt;a&gt;

<div class="code-duo">
<div>
<p class="filename">react: Students/Index.jsx</p>

```jsx
import { Link } from '@inertiajs/react';

<a href={`/students/${student.id}/edit`}>
  Edit  ⟳ reload penuh
</a>

<Link href={`/students/${student.id}/edit`}>
  Edit  ⚡ tanpa reload
</Link>
```
</div>
<div>
<p class="filename">plain PHP</p>

```php
<a href="edit.php?id=<?= $s['id'] ?>">
  Edit
</a>
```

Nama file berubah? Semua link rusak.

</div>
</div>

<p class="fineprint">Route tetap punya <b>nama</b> (<code>students.edit</code>) dan itu berguna di sisi Laravel. Untuk memanggil nama route dari React ada paket tambahan bernama <b>Ziggy</b> — tidak kita pakai di sesi ini agar tidak menambah setup.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Sekarang soal link. Dua-duanya jalan, tapi bedanya besar. `<a>` biasa itu cara kuno: browser memuat ulang SELURUH halaman, semua state React hilang, ada kedipan putih. `<Link>` dari Inertia itu navigasi SPA — Inertia mengambil data halaman baru lewat `fetch`, lalu hanya menukar komponen yang berubah. Tidak ada reload penuh, rasanya seperti aplikasi modern."

"Di kiri juga ada pembanding plain PHP: URL file ditulis keras. Nama file berubah, semua link rusak."

"Satu catatan jujur: route kita punya NAMA — `students.edit`, `students.index`, dan seterusnya; itu otomatis dari `Route::resource`. Nama itu berguna di sisi Laravel, misalnya di `redirect()->route('students.index')`. Untuk memanggil nama route dari React, ada paket tambahan namanya Ziggy. Kita tidak pakai di sesi ini supaya setup-nya tidak makin panjang. Jadi kita tulis path-nya langsung seperti di contoh. Kalau nanti di proyek kalian ada Ziggy, tinggal ganti jadi `route('students.edit', student.id)`."

**🎯 Poin Kunci di Layar:**
- Tunjukkan `<Link>` di kode asli: navigasi tanpa reload halaman.
- Tekankan: ganti `<a>` jadi `<Link>`, satu perubahan kecil, hasil besar.
- Sebut Ziggy sebagai opsi lanjutan, bukan bagian sesi ini.
