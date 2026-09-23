<!-- .slide: id="part-1" -->
<p class="part-label">Part 1 · Getting Started <span class="badge badge-core">Core</span></p>

# Installing Laravel

## Composer, `create-project`, dan struktur folder

Note: **🗣️ Ngomong ke Peserta:**
"Sekarang kita mulai. Pertanyaan pertama: gimana caranya punya Laravel di laptop kita? Jawabannya satu kata: Composer. Kita akan bahas apa itu Composer, lalu langsung praktekan bikin proyek pertamanya."

**🎯 Poin Kunci di Layar:**
- Bagian ini singkat — fokusnya langsung praktik di Live Coding #1.



<p class="part-label">Part 1 · Getting Started</p>

## Kenapa Composer?

<div class="cmp">
<div class="cmp-php">
<h4>Deck lama: `require` manual</h4>

```php
require 'config/database.php';
include 'partials/header.php';
```

Kita sendiri yang mengurus file mana yang dipanggil. Butuh library dari internet? Unduh manual, copy ke folder, lalu `require` sendiri.

</div>
<div class="cmp-laravel">
<h4>Hari ini: Composer *package manager*</h4>

```json
// composer.json
"require": { "laravel/framework": "^12.0" }
```

Composer mengunduh, mengurus versi, dan menyiapkan semuanya. Laravel sendiri cuma **satu paket Composer** biasa.

</div>
</div>

<p class="fineprint">Composer adalah <b>package manager</b> untuk PHP — padanan <code>npm</code> di JavaScript atau <code>pip</code> di Python. Jadi begitu paham Composer, kalian paham cara memasang framework ini.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ingat nggak waktu kita nulis `require 'config/database.php'`? Itu cara manual. Kita sendiri yang mengurus file mana yang dipanggil, dan kalau butuh library dari internet harus tulis sendiri."

"Nah, Composer menggantikan itu. Dia package manager — sama seperti `npm` di JavaScript atau `pip` di Python. Bedanya, Composer khusus untuk PHP."

"Dan ini bagian yang lucu: Laravel itu sendiri cuma sebuah PAKET Composer. Bukan software khusus yang harus diunduh dari situsnya. Jadi begitu kalian paham cara kerja Composer, kalian sudah paham cara memasang framework ini."

**🎯 Poin Kunci di Layar:**
- Analogi: Composer ≈ `npm` / `pip`.
- Tekankan: Laravel = paket Composer biasa, bukan hal mistis.



<p class="part-label">Part 1 · Getting Started <span class="badge badge-live">Live #1</span></p>

## Create a New Project, Pasang Inertia &amp; Breeze React

<p class="filename">terminal</p>

```bash
composer create-project laravel/laravel:^12.0 lara-student
cd lara-student
composer require inertiajs/inertia-laravel
composer require laravel/breeze --dev
php artisan breeze:install react
```

<div class="mock-browser">
<div class="bar">lara-student/</div>
<div class="body">
Proyek Laravel siap, React + Inertia + Tailwind terpasang lewat Breeze.<br>
Belum ada satu baris kode pun yang kita tulis.
</div>
</div>

<p class="fineprint">Cukup <b>PHP + Composer + Node</b>. Tidak ada installer global yang perlu dipasang lebih dulu. Pin ke <code>^12.0</code> agar versinya sama dengan proyek Backend kalian.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Untuk membuat proyeknya, cukup satu perintah Composer: `composer create-project`. Tidak ada installer global yang perlu dipasang lebih dulu — modal kalian cuma PHP dan Composer. Ini juga menegaskan poin tadi: Laravel cuma paket Composer biasa."

"Perhatikan versinya: `^12.0`. Kita sengaja pakai Laravel 12 — versi yang sama dengan proyek Backend kalian. Jadi apa yang kalian pelajari hari ini langsung nyambung ke kode tim nanti."

"Setelah masuk foldernya, kita pasang jembatannya dulu: `composer require inertiajs/inertia-laravel`. Inertia inilah yang menyambungkan Laravel dan React tanpa kita bikin REST API dan CORS sendiri. Baru setelah itu kita pasang Breeze dengan `composer require laravel/breeze --dev`."

"Lalu satu perintah sakti: `php artisan breeze:install react`. Breeze mengonfigurasi React, Inertia, dan Tailwind v4 secara otomatis — termasuk merapikan jembatan Inertia yang tadi kita pasang."

"Secara bawaan tanpa flag `--pest`, Breeze tetap memakai PHPUnit — sama seperti yang sudah kalian kenal (tekan Enter / pilih 'no' jika ditanya opsi Pest). Dan soal folder Auth bawaan Breeze: biarkan saja di background, kita tidak akan menyentuhnya. Fokus kita murni di `Pages/Students/`."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tunjukkan perintahnya, jalankan `composer create-project` lalu `breeze:install react`.
- Sebut nama folder `lara-student` — konsisten sepanjang sesi.
- Tekankan versi `^12.0` = sama dengan proyek Backend.
- Sebut Breeze otomatis menyiapkan React + Inertia + Tailwind v4; folder Auth dibiarkan di background.
- Tekankan urutan: `inertia-laravel` (jembatan) dulu, baru `breeze:install react` (konfigurasi otomatis).

**🛠️ Aksi Terminal (Jalankan Berurutan):**
1. `composer create-project laravel/laravel:^12.0 lara-student`
2. `cd lara-student`
3. `composer require inertiajs/inertia-laravel`
4. `composer require laravel/breeze --dev`
5. `php artisan breeze:install react` (pilih `no` saat ditanya dark mode & Pest)
6. `npm install`



<p class="part-label">Part 1 · Getting Started <span class="badge badge-live">Live #1</span></p>

## Jalankan &amp; lihat hasilnya

<p class="filename">terminal</p>

```bash
cd lara-student
php artisan serve --port=8001
```

<div class="mock-browser">
<div class="bar">localhost:8001</div>
<div class="body">
<b>Laravel</b><br>
Halaman selamat datang bawaan: sudah rapi, sudah jalan.
</div>
</div>

<p class="fineprint">App jalan di port <b>8001</b>, deck ini di port <b>8000</b>. Dua server, sama seperti pertemuan lalu. Kita pakai <code>php artisan serve</code> untuk backend; proses React-nya jalan terpisah lewat Vite.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Sekarang masuk ke foldernya, lalu jalankan `php artisan serve --port=8001`. Artisan itu command-line tool bawaan Laravel — nanti kita pakai terus. Lihat hasilnya: halaman selamat datang, langsung jalan, langsung rapi. Padahal kita belum menulis satu baris kode pun."

"Bedanya dengan kemarin: sekarang ada dua proses. Satu untuk Laravel — backend dan routing. Satu lagi untuk React — lewat Vite, yang mengompilasi JSX kalian. Kalau nanti kalian buka `composer run dev`, kedua proses ini jalan bareng. Kita mulai dengan `serve` saja dulu supaya jelas mana proses mana."

"Coba renungkan: kemarin butuh 10 bagian sampai aplikasi bisa menampilkan data. Hari ini, satu perintah. Itulah yang saya maksud dengan 'alat yang tepat'."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Buka `http://localhost:8001`, tunjukkan halaman welcome.
- Tekankan: port 8001 (app) vs 8000 (deck).
- Sebut dua proses: `php artisan serve` (backend) + `npm run dev` (React/Vite).

**🛠️ Aksi Terminal & Browser:**
1. **Terminal 1 (Backend):** `php artisan serve --port=8001`
2. **Terminal 2 (Frontend Vite):** Buka tab terminal baru di folder `lara-student`, jalankan `npm run dev`
3. **Browser:** Buka `http://localhost:8001` untuk melihat halaman sambutan bawaan Laravel + React.



<p class="part-label">Part 1 · Getting Started</p>

## Struktur Folder Proyek Laravel

<table class="plain">
<tr><th>Folder</th><th>Tanggung jawab</th></tr>
<tr><td><code>app/</code></td><td>Kode aplikasi kita: Controller, Model, dll</td></tr>
<tr><td><code>routes/</code></td><td>Daftar URL &amp; arahnya (<code>web.php</code>)</td></tr>
<tr><td><code>resources/js/</code></td><td><b>Tampilan React</b>: <code>Pages/</code>, <code>Layouts/</code>, <code>Components/</code></td></tr>
<tr><td><code>resources/js/Pages/Auth/</code></td><td>Bonus bawaan Breeze: login/register. <b>Biarkan di background</b> — kita tidak menyentuhnya</td></tr>
<tr><td><code>resources/views/</code></td><td>Cuma <code>app.blade.php</code>: kerangka kosong tempat React dipasang</td></tr>
<tr><td><code>database/</code></td><td>Migration &amp; seeder: pengganti <code>schema.sql</code></td></tr>
<tr><td><code>vendor/</code></td><td>Library Composer: <b>jangan diedit / di-commit</b> (<code>composer install</code> mengembalikannya)</td></tr>
</table>

<p class="fineprint">Jangan dihafal semua — cukup yang akan kita pakai hari ini. Mulai dari <code>app/</code>, lalu <code>routes/</code>, lalu <code>resources/js/</code> tempat React kalian tinggal. <b>Fokus kita: <code>Pages/Students/</code></b>.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ini peta folder Laravel. Jangan dihafal semua — cukup yang akan kita pakai hari ini. `app/` itu kode kita. `routes/` itu daftar URL. `database/` itu schema dan data awal."

"Perhatikan satu hal yang berbeda dari tutorial Laravel kebanyakan: `resources/views/` di proyek kita cuma berisi SATU file — `app.blade.php`. Itu bukan tampilan. Itu cuma kerangka kosong tempat React dipasang. Semua tampilan sesungguhnya ada di `resources/js/` sebagai komponen React. Jadi kalau kalian cari halaman, jangan cari di `views/` — cari di `resources/js/Pages/`."

"Dan `vendor/` itu isi library Composer: jangan diedit, jangan di-commit, karena bisa dibuat ulang kapan saja dengan `composer install`. Kalau kalian clone proyek orang, `vendor/` memang tidak ikut — kalian yang membuat ulang."

"Satu folder yang perlu kalian tahu tapi TIDAK akan kita sentuh: `resources/js/Pages/Auth/`. Itu bonus bawaan Breeze — halaman login dan register sudah jadi. Biarkan saja di background. Hari ini kita fokus penuh di `Pages/Students/`, supaya kalian benar-benar paham alur CRUD dari nol. Auth itu topik sesi tersendiri, bukan sekarang."

**🎯 Poin Kunci di Layar:**
- Tekankan `views/` cuma `app.blade.php`; tampilan sebenarnya di `resources/js/`.
- Sebut `vendor/` = jangan diedit, jangan di-commit.
- Sebut `resources/js/Pages/Auth/` = bonus bawaan Breeze, biarkan di background.
- Tegaskan fokus hari ini: `Pages/Students/`.
- Sebut `storage/`, `tests/`, `bootstrap/` sekilas — tidak dibahas hari ini.



<p class="part-label">Part 1 · Getting Started</p>

## Document Root `public/` &amp; Kerangka Inertia

<div class="ask"><b>Di plain PHP, kenapa kita pakai <code>php -S localhost:8001 -t phpdeck/project</code>, ada flag <code>-t</code>? Apa artinya?</b></div>

<p class="filename">public/index.php</p>

```php
// Titik masuk TUNGGAL aplikasi Laravel.
// Browser hanya boleh melihat isi folder public/.
```

<p class="fineprint"><b><code>-t</code> = document root.</b> Laravel selalu menunjuk ke <code>public/</code> agar file sensitif seperti <code>.env</code> tidak bisa dibuka lewat URL. <br><b>Inertia</b> = jembatan tanpa REST API/CORS: Controller mengirim data, React di <code>resources/js/Pages/</code> menggambar HTML. <code>resources/views/</code> cukup satu file (<code>app.blade.php</code>) sebagai penampung <code>@inertia</code>.<br><b>Bonus bawaan Breeze:</b> folder <code>resources/js/Pages/Auth/</code> (login/register) sudah tersedia — biarkan di background, kita tetap fokus di <code>Pages/Students/</code>.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Satu yang penting soal folder `public/`. Ingat flag `-t` yang kita pakai untuk server PHP kemarin? Itu menandakan document root — folder mana yang boleh dilihat browser. Laravel selalu menunjuk ke `public/`, dan itu sebabnya file sensitif seperti `.env` tidak bisa dibuka lewat URL."

"Coba buka `public/index.php`. Isinya cuma beberapa baris — dia cuma titik masuk tunggal. Semua request dari browser masuk lewat sini, lalu Laravel mengarahkannya sesuai route. Ini beda besar dengan kemarin, di mana tiap halaman punya file PHP sendiri yang bisa diakses langsung."

"Terakhir, soal Inertia. Inertia itu jembatan tanpa REST API dan tanpa CORS: Controller mengirim data, React di `resources/js/Pages/` yang menggambar HTML-nya. Dan `resources/views/` cukup satu file saja — `app.blade.php` — yang isinya cuma penampung `@inertia`. Jadi tidak ada duplikasi tampilan."

"Dan ingat tadi: Breeze meninggalkan satu bonus di `Pages/Auth/` — login dan register yang sudah jadi. Anggap saja itu hadiah yang belum kita buka. Hari ini kita tetap bekerja di `Pages/Students/` saja."

**🎯 Poin Kunci di Layar:**
- Jawab `.ask`: flag `-t` = document root.
- Tekankan: `public/index.php` = titik masuk tunggal.
- Jelaskan `@inertia` di `app.blade.php` = tempat React dipasang.
- Ulangi: `Pages/Auth/` = bonus Breeze, biarkan di background; fokus tetap `Pages/Students/`.



<p class="part-label">Part 1 · Getting Started</p>

## Request–Response Flow di Laravel

<div class="mvc">

<div class="mvc-duo">

<div class="mvc-lane req">
    <div class="mvc-lane-head">1 · REQUEST <span>(masuk)</span></div>
    <div class="mvc-box ext">Browser</div>
    <div class="mvc-down">&darr;&nbsp;HTTP request</div>
    <div class="mvc-box on">routes/web.php <span class="role">pintu masuk</span></div>
    <div class="mvc-down">&darr;&nbsp;cocokkan URL</div>
    <div class="mvc-box on">Controller <span class="role">otak</span></div>
    <div class="mvc-down">&darr;&nbsp;minta data</div>
    <div class="mvc-box on">Model <span class="role">jembatan data</span></div>
    <div class="mvc-down">&darr;&nbsp;query SQL</div>
    <div class="mvc-box ext">Database</div>
</div>

<div class="mvc-lane res">
    <div class="mvc-lane-head">2 · RESPONSE <span>(keluar)</span></div>
    <div class="mvc-box on">Controller <span class="role">racik data</span></div>
    <div class="mvc-down res">&darr;&nbsp;data (props) via Inertia</div>
    <div class="mvc-box on">React Page <span class="role">tampilan</span></div>
    <div class="mvc-down res">&darr;&nbsp;HTML response</div>
    <div class="mvc-box ext">Browser</div>
</div>

</div>

<p class="mvc-note">Alurnya identik dengan deck lama (<b>Browser → HTTP → PHP → SQL → MySQL → HTML</b>): sekarang tiap tahap punya nama dan rumah.</p>

</div>

Note: **🗣️ Ngomong ke Peserta:**
"Boleh difoto slide ini? Ini peta jalan seluruh sesi, persis seperti diagram Browser-HTTP-PHP-SQL kemarin. Bedanya cuma satu: sekarang tahapnya punya NAMA dan RUMAH. Route itu pintu masuk. Controller itu otaknya. Model itu jembatan ke database. React Page itu tampilannya. Setiap kali bingung 'kode ini taruh di mana?', jawabannya ada di diagram ini."

"Perhatikan arahnya. Lajur kiri itu perjalanan REQUEST masuk: dari Browser, turun ke route, ke Controller, ambil data lewat Model, sampai ke Database. Lajur kanan itu perjalanan RESPONSE keluar: Controller meracik datanya, lalu Inertia menyerahkan data itu ke React Page — dan React yang mengubahnya jadi HTML. Dua lajur, keduanya mengalir dari atas ke bawah, persis seperti urutan kejadiannya."

"Satu hal yang perlu kalian sadari: di PHP kemarin, View itu file PHP yang langsung mencetak HTML. Sekarang View itu komponen React, dan datanya datang sebagai props. Alurnya sama — cuma cara menyampaikannya yang beda."

**🎯 Poin Kunci di Layar:**
- Minta peserta memotret diagram; tunjuk tiap kotak yang akan dibahas.
- Tekankan: alur SAMA seperti yang mereka kuasai di PHP.
- Sorot: View = React Page, data masuk sebagai props.



<p class="part-label">Part 1 · Getting Started</p>

## Configuration `.env`: rahasia tidak masuk git

<div class="cmp">
<div class="cmp-php">
<h4>Kemarin: kredensial di kode</h4>

```php
// config/database.php
$host = '127.0.0.1';
$db   = 'student_db';
$user = 'root';
$pass = ''; // terlihat semua orang
```

File ikut ke git; password terbuka bagi siapa pun yang clone repo.

</div>
<div class="cmp-laravel">
<h4>Hari ini: dipisah ke `.env`</h4>

```bash
# .env (otomatis di-.gitignore)
DB_DATABASE=student_db
DB_USERNAME=root
APP_DEBUG=true
```

Kredensial terpisah dari kode sumber. Aman dari riwayat git.

</div>
</div>

<p class="fineprint"><code>APP_DEBUG=true</code> = padanan <code>display_errors</code>. <b>Wajib <code>false</code> di production</b> agar tidak membocorkan server. Siapkan <code>.env</code> untuk live coding database.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Satu hal terakhir di Part 1: konfigurasi. Kemarin, kredensial database kita tulis keras di `config/database.php`. Masalahnya, file itu ikut masuk git. Artinya password database kalian bisa dilihat siapa saja yang punya akses ke repository. Itu kebiasaan yang berbahaya."

"Laravel memisahkan ini ke file `.env`, dan file itu masuk `.gitignore` sejak awal — jadi tidak akan pernah ikut ter-commit. Di `.env` ada `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, dan satu lagi: `APP_DEBUG`."

"Soal `APP_DEBUG` — ingat waktu kita bahas `display_errors` di pertemuan lalu? Bahwa menyalakan tampilan error di production itu berbahaya karena membocorkan struktur server? Ini padanannya. `APP_DEBUG=true` itu untuk belajar di laptop. Begitu aplikasi kalian online, WAJIB jadi `false`. Siapkan `.env` kalian sekarang, karena live coding berikutnya butuh koneksi database."

**🎯 Poin Kunci di Layar:**
- Tunjukkan file `.env` asli di editor, bukan cuma mockup.
- Tekankan `APP_DEBUG=false` di production (padanan `display_errors`).
- Ingatkan: siapkan `.env` sekarang untuk live coding berikutnya.
