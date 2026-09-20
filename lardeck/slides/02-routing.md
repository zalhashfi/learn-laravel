<!-- .slide: id="part-2" -->
<p class="part-label">Part 2 · Routing &amp; Controllers <span class="badge badge-core">Core</span></p>

# Routing &amp; Controllers

## Pintu masuk yang sekarang eksplisit

Note: **🗣️ Ngomong ke Peserta:**
"Di Part 1 kita sudah punya proyek Laravel yang jalan. Sekarang pertanyaannya: waktu user buka `localhost:8001/students`, apa yang terjadi? Di PHP kemarin, jawabannya sederhana: ada file bernama `index.php`. Di Laravel, jawabannya ada di satu file khusus: `routes/web.php`. Ini yang kita bongkar sekarang."

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
- [Aksi Live]: Tulis dua route di `routes/web.php`, tunjukkan di browser.
- Tekankan: `{id}` = pengganti `$_GET['id']`.



<p class="part-label">Part 2 · Routing &amp; Controllers <span class="badge badge-live">Live #2</span></p>

## Resource Controller: 7 route dalam 1 baris

<p class="filename">routes/web.php</p>

```php
use App\Http\Controllers\StudentController;

Route::resource('students', StudentController::class);
```

<p class="filename">terminal</p>

```bash
php artisan make:controller StudentController --resource
php artisan route:list
```

<div class="mock-terminal">
<div class="out">GET|HEAD  students .......... students.index   &rsaquo; StudentController@index</div>
<div class="out">POST      students .......... students.store   &rsaquo; StudentController@store</div>
<div class="out">GET|HEAD  students/create ... students.create  &rsaquo; StudentController@create</div>
<div class="out">GET|HEAD  students/{student}  students.show    &rsaquo; StudentController@show</div>
<div class="out">PUT|PATCH students/{student}  students.update  &rsaquo; StudentController@update</div>
<div class="out">DELETE    students/{student}  students.destroy &rsaquo; StudentController@destroy</div>
<div class="out">GET|HEAD  students/{student}/edit  students.edit &rsaquo; StudentController@edit&nbsp;&nbsp;<span style="color:var(--pd-core)">(7 route)</span></div>
</div>

<p class="fineprint">Tujuh route, satu baris. Bandingkan dengan <b>6 file terpisah</b> di proyek plain PHP.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ini momen 'oh, banyak yang gratis'. Satu baris `Route::resource()` dan Laravel membuatkan TUJUH route sekaligus — lihat output `route:list` di layar: index, store, create, show, update, destroy, edit. Lengkap untuk CRUD."

"Ingat proyek kemarin? Kita bikin `index.php`, `create.php`, `edit.php`, `delete.php` — manual satu-satu. Sekarang satu baris menggantikan semuanya. Tapi perhatikan: route ini cuma PINTU. Isi logikanya tetap harus kita tulis di controller — itu slide berikutnya."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Jalankan `make:controller` lalu `route:list`, tunjukkan 7 baris nyata.
- Tekankan: `--resource` membuat 7 method kosong di controller.



<p class="part-label">Part 2 · Routing &amp; Controllers</p>

## Controller &amp; Named Routes

<table class="plain">
<tr><th>Method controller</th><th>File lama (plain PHP)</th><th>Tugas</th></tr>
<tr><td><code>index()</code></td><td><code>index.php</code></td><td>Tampilkan daftar</td></tr>
<tr><td><code>create()</code> / <code>store()</code></td><td>form + logika POST <code>create.php</code></td><td>Tampilkan form / simpan baru</td></tr>
<tr><td><code>show()</code></td><td>(baru)</td><td>Tampilkan satu data</td></tr>
<tr><td><code>edit()</code> / <code>update()</code></td><td>GET + POST <code>edit.php</code></td><td>Tampilkan form / simpan perubahan</td></tr>
<tr><td><code>destroy()</code></td><td><code>delete.php</code></td><td>Hapus data</td></tr>
</table>

<div class="cmp">
<div class="cmp-php">
<h4>Rawan: URL ditulis keras</h4>

```php
<a href="edit.php?id=<?= $s['id'] ?>">Edit</a>
```

Nama file berubah? Semua link rusak.

</div>
<div class="cmp-laravel">
<h4>Aman: panggil lewat nama</h4>

```blade
<a href="{{ route('students.edit', $s) }}">Edit</a>
```

URL berubah? Cukup ubah di satu tempat.

</div>
</div>

Note: **🗣️ Ngomong ke Peserta:**
"Tabel ini penting banget — menjawab 'file saya yang kemarin ke mana?'. `index.php` jadi `index()`. Logika POST di `create.php` jadi `store()`. `edit.php` dan `delete.php` jadi `edit`/`update`/`destroy`. Perhatikan: `create.php` kemarin menangani DUA tugas (tampil form kalau GET, proses kalau POST). Di Laravel dipisah: `create()` untuk form, `store()` untuk simpan. Itu yang membuat kode lebih rapi."

"Lalu soal Named Routes. Di kiri, kita tulis URL langsung di HTML. Bayangkan ada 50 link ke halaman edit — URL berubah sedikit saja, kalian harus cari-ganti 50 tempat. Di kanan, kita beri NAMA pada route, dan memanggilnya lewat nama itu. URL berubah? Cukup ubah di satu tempat. Bonusnya: tujuh route dari `Route::resource` tadi sudah otomatis punya nama standar."

**🎯 Poin Kunci di Layar:**
- Telusuri tabel baris per baris — jembatan pemahaman utama.
- Tekankan pemisahan `create`/`store` dan `edit`/`update`.
- Tunjukkan `route('students.edit', $student)` di kode asli.
