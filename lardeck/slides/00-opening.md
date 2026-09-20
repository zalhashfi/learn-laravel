<!-- .slide: id="part-0" -->
<p class="part-label">Part 0 · Opening</p>

# Dari PHP Murni ke Laravel

## Refactor Backend CRUD

<p class="fineprint">Peminatan Backend &middot; Lanjutan dari "Dari C ke PHP" &middot; Kurikulum mengikuti <a href="https://roadmap.sh/laravel">roadmap.sh/laravel</a></p>

Note: **🗣️ Ngomong ke Peserta:**
"Halo semuanya! Kalau pertemuan lalu kita belajar PHP murni dan membangun Student Management System dari nol, hari ini kita akan melakukan sesuatu yang sedikit berbeda. Kita TIDAK belajar bahasa baru. Kita akan memindahkan proyek yang sudah kalian buat itu ke Laravel — framework PHP paling populer di industri. Jadi santai, fondasi kalian tidak akan hilang. Justru di sinilah kalian bakal lihat kenapa sebanyak itu orang pakai framework."

**🎯 Poin Kunci di Layar:**
- Ini adalah lanjutan langsung, bukan materi terpisah.
- Materi kita mengikuti peta belajar resmi `roadmap.sh/laravel` — jadi kalian tahu posisi kalian.



<p class="part-label">Part 0 · Opening</p>

## Ingat ini? Peta proyek lama vs Laravel

<div class="cmp">
<div class="cmp-php">
<h4>Plain PHP (pertemuan lalu)</h4>

```
project/
├── config/database.php
├── helpers.php
├── index.php
├── create.php
├── edit.php
└── delete.php
```

</div>
<div class="cmp-laravel">
<h4>Laravel (hari ini)</h4>

```
lara-student/
├── routes/web.php
├── app/Http/Controllers/
│   └── StudentController.php
├── app/Models/
│   └── Student.php
└── resources/views/students/
    ├── index.blade.php
    ├── create.blade.php
    └── edit.blade.php
```

</div>
</div>

<p class="fineprint"><b>6 file + config + helpers</b> &rarr; <b>1 resource controller</b>. Isi logikanya sama, cara menulisnya yang beda.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Coba ingat-ingat lagi. Berapa file yang harus kalian sentuh cuma untuk CRUD satu tabel? Ada `config/database.php`, `helpers.php`, terus `index`, `create`, `edit`, `delete` — belum koneksi database yang harus di-`require` di setiap file. Nah, di sebelah kanan ini versi Laravel-nya. Perhatikan: logikanya tidak hilang. Yang berubah cuma CARA menulisnya jadi jauh lebih terstruktur. Hari ini kita buktikan itu satu per satu."

**🎯 Poin Kunci di Layar:**
- Tunjuk kolom kiri: familiar, itu yang mereka tulis sendiri.
- Tunjuk kolom kanan: tujuan kita hari ini.



<p class="part-label">Part 0 · Opening</p>

## What is Laravel, dan kenapa framework

<div class="cmp">
<div class="cmp-php">
<h4>Framework itu apa?</h4>

Kumpulan **keputusan bagus** yang sudah diambil orang lain untuk kita:

- Di mana file diletakkan
- Bagaimana request masuk
- Bagaimana bicara ke database

</div>
<div class="cmp-laravel">
<h4>Kenapa pakai framework?</h4>

- Routing bawaan
- ORM (Eloquent): tak perlu tulis PDO manual
- Template (Blade): aman dari XSS
- Keamanan &amp; validasi bawaan

</div>
</div>

<p class="fineprint">Laravel = framework PHP paling populer. Tapi ingat: <b>framework bukan sihir</b>; dia cuma menuliskan pola yang tadi kalian kerjakan manual.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Sebelum kita mulai ngoding, satu pertanyaan mendasar: sebenarnya framework itu apa sih? Coba pikir. Waktu kalian bikin proyek PHP kemarin, kalian harus memutuskan sendiri: file ini ditaruh di mana, request form ini diproses di file mana, gimana cara nyambungin ke MySQL. Laravel itu ibaratnya senior yang sudah mengambil semua keputusan itu untuk kalian — berdasarkan pengalaman bertahun-tahun. Jadi kalian tidak perlu menulis ulang hal yang sama setiap kali bikin proyek."

"Dan ini penting: framework itu BUKAN sihir. Semua yang dia lakukan — routing, query database, escape HTML — itu persis pola yang tadi kalian tulis tangan. Dia cuma membungkusnya supaya tidak berulang-ulang. Kalau kalian belum paham polanya, framework akan terasa seperti kotak hitam. Tapi kalian SUDAH paham polanya. Jadi kalian akan menikmatinya."

**🎯 Poin Kunci di Layar:**
- Tekankan: framework = keputusan yang tidak perlu diulang.
- Jembatan ke Part 1: "gimana cara punya Laravel di laptop kalian?"
