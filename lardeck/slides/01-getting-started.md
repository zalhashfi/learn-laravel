<!-- .slide: id="part-1" -->
<p class="part-label">Part 1 · Getting Started <span class="badge badge-core">Core</span></p>

# Installing Laravel

## Composer, `create-project`, dan struktur folder

Note: **🗣️ Ngomong ke Peserta:**
"Sekarang kita mulai. Pertanyaan pertama: gimana caranya punya Laravel di laptop kita? Jawabannya satu kata: Composer. Kita akan bahas apa itu Composer, lalu langsung praktekan bikin proyek pertamanya."

**🎯 Poin Kunci di Layar:**
- Bagian ini singkat — fokusnya langsung praktik di Live Coding #1.



<p class="part-label">Part 1 · Getting Started <span class="badge badge-live">Live #1</span></p>

## Composer &amp; Create a New Project

<div class="cmp">
<div class="cmp-php">
<h4>Deck lama: `require` manual</h4>

```php
require 'config/database.php';
include 'partials/header.php';
```

Kita sendiri yang mengurus file mana yang dipanggil. Untuk library dari internet? Harus tulis sendiri.

</div>
<div class="cmp-laravel">
<h4>Laravel: Composer</h4>

```json
// composer.json
"require": { "laravel/framework": "^12.0" }
```

Composer mengunduh, mengurus versi, dan menyiapkan semuanya.

</div>
</div>

<p class="filename">terminal (pilih salah satu)</p>

```bash
# Cara A: Laravel Installer (pasang sekali, lalu lebih singkat)
composer global require laravel/installer
laravel new lara-student

# Cara B: Composer langsung (tanpa installer; dipakai di sesi ini)
composer create-project laravel/laravel:^12.0 lara-student
```

<p class="fineprint">Keduanya menghasilkan proyek yang <b>sama</b>. Kita pakai Cara B karena tidak menambah langkah setup, dan menegaskan: <b>Laravel itu sendiri cuma paket Composer</b>. Kita pin ke <code>^12.0</code> agar sama dengan proyek Backend yang sudah berjalan.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Ingat nggak waktu kita nulis `require 'config/database.php'`? Itu cara manual. Composer menggantikan itu — dia package manager, sama seperti `npm` di JavaScript atau `pip` di Python. Lucunya, Laravel itu sendiri cuma sebuah paket Composer. Jadi begitu paham Composer, kalian paham cara memasang framework ini."

"Ada dua cara membuat proyek. Cara A pakai Laravel Installer — pasang sekali, lalu `laravel new` lebih singkat. Cara B langsung lewat Composer: `composer create-project`. Keduanya sah dan hasilnya identik. Kita pakai Cara B karena tidak menambah langkah setup, dan menegaskan bahwa Laravel cuma paket Composer."

"Perhatikan versinya: `^12.0`. Kita sengaja pakai Laravel 12 — versi yang sama dengan proyek Backend kalian. Jadi apa yang kalian pelajari hari ini langsung nyambung ke kode tim nanti."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tunjukkan perintahnya, pilih Cara B, jalankan.
- Sebut nama folder `lara-student` — konsisten sepanjang sesi.
- Tekankan versi `^12.0` = sama dengan proyek Backend.
- Analogi: Composer ≈ `npm` / `pip`.



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



<p class="part-label">Part 1 · Getting Started</p>

## Project Structure &amp; mana yang boleh disentuh

<table class="plain">
<tr><th>Folder</th><th>Tanggung jawab</th></tr>
<tr><td><code>app/</code></td><td>Kode aplikasi kita: Controller, Model, dll</td></tr>
<tr><td><code>routes/</code></td><td>Daftar URL &amp; arahnya (<code>web.php</code>)</td></tr>
<tr><td><code>resources/js/</code></td><td><b>Tampilan React</b>: <code>Pages/</code>, <code>Layouts/</code>, <code>Components/</code></td></tr>
<tr><td><code>resources/views/</code></td><td>Cuma <code>app.blade.php</code>: kerangka kosong tempat React dipasang</td></tr>
<tr><td><code>database/</code></td><td>Migration &amp; seeder: pengganti <code>schema.sql</code></td></tr>
<tr><td><code>public/</code></td><td>Document root: satu-satunya folder yang dilihat browser</td></tr>
<tr><td><code>vendor/</code></td><td>Library Composer: <b>jangan diedit / di-commit</b> (<code>composer install</code> mengembalikannya)</td></tr>
<tr><td><code>.env</code></td><td>Konfigurasi rahasia: tidak masuk git</td></tr>
</table>

<div class="ask"><b>Di plain PHP, kenapa kita pakai <code>php -S localhost:8001 -t phpdeck/project</code>, ada flag <code>-t</code>? Apa artinya?</b></div>

Note: **🗣️ Ngomong ke Peserta:**
"Ini peta folder Laravel. Jangan dihafal semua — cukup yang akan kita pakai hari ini. `app/` itu kode kita. `routes/` itu daftar URL. `database/` itu schema dan data awal."

"Perhatikan satu hal yang berbeda dari tutorial Laravel kebanyakan: `resources/views/` di proyek kita cuma berisi SATU file — `app.blade.php`. Itu bukan tampilan. Itu cuma kerangka kosong tempat React dipasang. Semua tampilan sesungguhnya ada di `resources/js/` sebagai komponen React. Jadi kalau kalian cari halaman, jangan cari di `views/` — cari di `resources/js/Pages/`."

"Satu yang penting: `public/`. Ingat flag `-t` yang kita pakai untuk server PHP kemarin? Itu menandakan document root. Laravel selalu menunjuk ke `public/` — supaya file sensitif seperti `.env` tidak bisa dibuka lewat URL. Dan `vendor/` itu isi library Composer: jangan diedit, jangan di-commit, karena bisa dibuat ulang dengan `composer install`."

**🎯 Poin Kunci di Layar:**
- Jawab `.ask`: flag `-t` = document root.
- Tekankan `views/` cuma `app.blade.php`; tampilan sebenarnya di `resources/js/`.
- Sebut `storage/`, `tests/`, `bootstrap/` sekilas — tidak dibahas hari ini.



<p class="part-label">Part 1 · Getting Started</p>

## Memasang React: Inertia sebagai jembatan

<p class="filename">terminal</p>

```bash
composer require inertiajs/inertia-laravel   # sisi Laravel
npm install react react-dom @inertiajs/react  # sisi React
```

<p class="filename">resources/views/app.blade.php</p>

```blade
{{-- Satu-satunya file Blade di proyek ini: kerangka kosong --}}
<body>
    @inertia
</body>
```

<p class="filename">resources/js/app.jsx</p>

```jsx
createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
});
```

<p class="fineprint"><b>Inertia</b> = jembatan antara Laravel dan React. Controller Laravel mengirim <b>data</b>, Inertia menyerahkannya ke komponen React, React yang menggambar HTML-nya. Tidak ada REST API terpisah, tidak ada CORS, dan routing tetap di <code>routes/web.php</code>.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Satu pertanyaan yang mungkin sudah kalian pikirkan: React itu frontend, Laravel itu backend. Bagaimana keduanya nyambung? Jawabannya Inertia."

"Cara kerjanya begini. Kalian tahu React biasanya perlu API terpisah — Laravel bikin endpoint JSON, React fetch ke situ. Itu ribet: harus atur CORS, token, dua codebase. Inertia menghilangkan semua itu. Controller Laravel cukup mengembalikan DATA, dan Inertia menyerahkannya langsung ke komponen React. Routing tetap satu tempat di `routes/web.php`. Jadi kalian tidak perlu belajar REST API dulu."

"Perhatikan file `app.blade.php` di kiri. Itu SATU-SATUNYA file Blade di proyek kita, dan isinya cuma `@inertia` — semacam lubang tempat React dipasang. Di kanan, `app.jsx`: Inertia membaca folder `Pages/` dan memetakan nama halaman ke komponen React. Jadi kalau controller bilang `Inertia::render('Students/Index')`, Inertia mencari `Pages/Students/Index.jsx`."

**🎯 Poin Kunci di Layar:**
- Tekankan: Inertia = jembatan, tanpa REST API terpisah, tanpa CORS.
- Tunjukkan `@inertia` = satu-satunya Blade; sisanya React.
- Jelaskan pemetaan nama halaman → file JSX.



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
<h4>Kemarin: kredensial keras di kode</h4>

```php
// config/database.php
$host = '127.0.0.1';
$db   = 'student_db';
$user = 'root';
$pass = '';          // terlihat semua orang
```

File ini ikut masuk git, dan password terpampang ke siapa pun yang punya akses repo.

</div>
<div class="cmp-laravel">
<h4>Hari ini: dipisah ke `.env`</h4>

```bash
# .env  (tidak di-commit ke git)
DB_DATABASE=student_db
DB_USERNAME=root
APP_DEBUG=true
```

Kredensial dipisah dari kode. `.env` masuk `.gitignore` sejak awal.

</div>
</div>

<p class="fineprint"><code>APP_DEBUG=true</code> = padanan <code>display_errors</code> kemarin. <b>Wajib <code>false</code> di production</b>: kalau tidak, pesan error bisa membocorkan isi server. Siapkan <code>.env</code> sekarang, karena live coding berikutnya butuh koneksi database.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Satu hal terakhir di Part 1: konfigurasi. Kemarin, kredensial database kita tulis keras di `config/database.php`. Masalahnya, file itu ikut masuk git. Artinya password database kalian bisa dilihat siapa saja yang punya akses ke repository. Itu kebiasaan yang berbahaya."

"Laravel memisahkan ini ke file `.env`, dan file itu masuk `.gitignore` sejak awal — jadi tidak akan pernah ikut ter-commit. Di `.env` ada `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, dan satu lagi: `APP_DEBUG`."

"Soal `APP_DEBUG` — ingat waktu kita bahas `display_errors` di pertemuan lalu? Bahwa menyalakan tampilan error di production itu berbahaya karena membocorkan struktur server? Ini padanannya. `APP_DEBUG=true` itu untuk belajar di laptop. Begitu aplikasi kalian online, WAJIB jadi `false`. Siapkan `.env` kalian sekarang, karena live coding berikutnya butuh koneksi database."

**🎯 Poin Kunci di Layar:**
- Tunjukkan file `.env` asli di editor, bukan cuma mockup.
- Tekankan `APP_DEBUG=false` di production (padanan `display_errors`).
- Ingatkan: siapkan `.env` sekarang untuk live coding berikutnya.
