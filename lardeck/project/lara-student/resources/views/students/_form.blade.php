<!--
    Partial form — dipakai bersama oleh create.blade.php dan edit.blade.php.

    Perhatikan:
    - old('name', $student->name ?? '') → saat validasi gagal, input tidak hilang
    - @error(...) menampilkan pesan error per field
    Semua ini dulu kita tulis manual di Part 9 deck lama.
-->
<div class="field">
    <label for="name">Nama</label>
    <input type="text" id="name" name="name"
           value="{{ old('name', $student->name ?? '') }}"
           placeholder="Nama lengkap">
    @error('name') <span class="error">{{ $message }}</span> @enderror
</div>

<div class="field">
    <label for="email">Email</label>
    <input type="email" id="email" name="email"
           value="{{ old('email', $student->email ?? '') }}"
           placeholder="nama@campus.ac.id">
    @error('email') <span class="error">{{ $message }}</span> @enderror
</div>

<div class="field">
    <label for="major">Jurusan</label>
    <input type="text" id="major" name="major"
           value="{{ old('major', $student->major ?? '') }}"
           placeholder="Informatika">
    @error('major') <span class="error">{{ $message }}</span> @enderror
</div>
