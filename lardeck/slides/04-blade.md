<!-- .slide: id="part-4" -->
<p class="part-label">Part 4 · Views &amp; Blade <span class="badge badge-core">Core</span></p>

# Views &amp; Blade

## HTML yang dulu campur `<?php ?>`

Note: **🗣️ Ngomong ke Peserta:**
"Sekarang bagian yang paling sering kalian sentuh kemarin: tampilan. Ingat `index.php` kalian? Campur aduk — HTML, `<?php`, `foreach`, `?>` lagi. Hari ini kita rapikan dengan Blade."

**🎯 Poin Kunci di Layar:**
- Ingatkan betapa campur-aduknya `<?php foreach (...): ?>`.
- Janji: Blade menghilangkan `<?php` dari file tampilan.



<p class="part-label">Part 4 · Views &amp; Blade</p>

## Blade: `{{ }}`, loop, &amp; escape otomatis

<div class="cmp">
<div class="cmp-php">
<h4>Plain PHP: manual &amp; rawan</h4>

```php
<?php foreach ($students as $s): ?>
  <tr>
    <td><?= htmlspecialchars($s['name']) ?></td>
  </tr>
<?php endforeach; ?>
```

`<?php`, `?>`, dan `htmlspecialchars` ditulis manual. Lupa satu = celah XSS.

</div>
<div class="cmp-laravel">
<h4>Blade: bersih &amp; aman default</h4>

```blade
@foreach ($students as $s)
  <tr>
    <td>{{ $s->name }}</td>
  </tr>
@endforeach
```

Tidak ada `<?php`. `{{ }}` otomatis meng-escape.

</div>
</div>

<div class="cmp">
<div class="cmp-laravel">
<h4><code>{{ }}</code>: aman (default)</h4>

```blade
{{ $student->name }}
```

`<`, `>`, `&`, `"` di-escape otomatis. Nama berisi `<script>` tampil sebagai teks, bukan dieksekusi.

</div>
<div class="cmp-php">
<h4><code>{!! !!}</code>: raw, berbahaya</h4>

```blade
{!! $student->name !!}
```

HTML ditampilkan APA ADANYA. Hanya untuk konten yang kalian sendiri yang bikin HTML-nya.

</div>
</div>

<p class="fineprint">Ini payoff keamanan Part 6 deck lama: <code>htmlspecialchars()</code> yang dulu harus diingat tiap output, sekarang jadi <b>perilaku default</b>. Aturan: default <code>{{ }}</code>; <code>{!! !!}</code> hanya untuk konten internal.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Lihat kiri: file `index.php` kalian kemarin. Ada `<?php foreach`, `?>`, lalu `htmlspecialchars` yang harus diingat bungkus di SETIAP output. Lupa satu saja, itu celah XSS. Kanan: Blade. Tidak ada `<?php` sama sekali, dan `{{ }}` OTOMATIS meng-escape. Ingat pelajaran keamanan Part 6? Di Blade, perlindungan itu jadi perilaku bawaan — kalian aman tanpa harus ingat."

"Tapi ada jebakan penting, lihat baris bawah. `{{ }}` aman, `{!! !!}` RAW dan berbahaya. Kalau user nakal memasukkan `<script>` sebagai nama, dengan `{{ }}` itu tampil sebagai tulisan biasa. Dengan `{!! !!}` — yang menampilkan HTML mentah-mentah — script itu DIJALANKAN. Persis celah XSS Part 6. Jadi aturannya: default `{{ }}`, pakai `{!! !!}` hanya untuk HTML yang kalian sendiri yang bikin."

**🎯 Poin Kunci di Layar:**
- Tunjuk hilangnya `<?php`/`?>` dan `htmlspecialchars`.
- Tekankan `{{ }}` = auto-escape (payoff XSS Part 6).
- Aturan tegas: `{!! !!}` hanya untuk konten internal, jangan input user.



<p class="part-label">Part 4 · Views &amp; Blade <span class="badge badge-live">Live #4</span></p>

## Layout, `@forelse`, &amp; flash message

<p class="filename">layouts/app.blade.php &nbsp;&middot;&nbsp; students/index.blade.php</p>

```blade
{{-- Layout: sekali tulis, semua halaman pakai --}}
<title>@yield('title', 'Student Management System')</title>
@if (session('success'))
    <div class="alert">{{ session('success') }}</div>
@endif
@yield('content')
```

```blade
@extends('layouts.app')
@section('content')
    @forelse ($students as $student)
        <tr><td>{{ $student->name }}</td></tr>
    @empty
        <div class="empty">Belum ada data siswa.</div>
    @endforelse
@endsection
```

<p class="fineprint"><b>Layout</b> menggantikan copy-paste <code>&lt;head&gt;</code> kemarin. <b><code>@forelse/@empty</code></b> menangani tabel kosong otomatis (dulu <code>if (empty($students))</code> manual). <b>Flash</b> pengganti <code>setFlash/getFlash</code> buatan sendiri: controller cukup <code>->with('success', ...)</code>.</p>

Note: **🗣️ Ngomong ke Peserta:**
"Tiga hal sekaligus di slide ini, dan ketiganya menjawab masalah nyata dari proyek kemarin."

"Pertama, Layout. Kemarin setiap file punya `<head>` copy-paste — ganti judul aplikasi berarti edit semua file. Sekarang: satu layout dengan 'lubang' bernama `@yield('content')`, dan halaman lain mengisinya lewat `@section`. Sekali ubah layout, semua halaman ikut."

"Kedua, `@forelse/@empty`. Ini seperti `@foreach` tapi menangani data kosong otomatis. Ingat `if (empty($students))` manual di Part 3 kemarin? Sekarang tinggal tulis pesannya di `@empty`. Dua situasi, sekali tulis."

"Ketiga, flash message. Ingat `setFlash` dan `getFlash` yang kita bikin sendiri — lengkap dengan `unset` yang gampang lupa? Sekarang controller cukup `->with('success', 'pesan')`, dan Blade menampilkannya dengan `@if (session('success'))`. Laravel mengurus penyimpanan dan pembersihannya."

**🎯 Poin Kunci di Layar:**
- [Aksi Live]: Tunjukkan `@yield`/`@section` di file asli.
- Tunjukkan `@forelse/@empty` di `index.blade.php`.
- Tunjukkan `->with()` di controller — hilangnya `unset` manual.
