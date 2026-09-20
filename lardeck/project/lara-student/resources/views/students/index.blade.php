@extends('layouts.app')

@section('title', 'Daftar Siswa')

@section('content')

    <div class="row-between">
        <h1>Daftar Siswa</h1>
        <a class="btn btn-primary" href="{{ route('students.create') }}">+ Tambah Siswa</a>
    </div>

    {{-- Search: form GET, aman (prepared statement via Eloquent) --}}
    <form method="GET" action="{{ route('students.index') }}" class="search">
        <input type="text" name="q" value="{{ $q }}" placeholder="Cari nama siswa...">
        <button type="submit" class="btn">Cari</button>
        @if ($q)
            <a class="btn btn-plain" href="{{ route('students.index') }}">Reset</a>
        @endif
    </form>

    {{-- @forelse/@empty = tabel kosong ditangani otomatis --}}
    @forelse ($students as $student)
        @if ($loop->first)
            <table class="data">
            <thead>
                <tr>
                    <th>#</th><th>Nama</th><th>Email</th><th>Jurusan</th><th class="actions">Aksi</th>
                </tr>
            </thead>
            <tbody>
        @endif

        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>{{ $student->name }}</td>
            <td>{{ $student->email }}</td>
            <td>{{ $student->major }}</td>
            <td class="actions">
                <a class="btn btn-sm" href="{{ route('students.edit', $student) }}">Edit</a>

                {{-- Hapus WAJIB POST, bukan <a href>. @method('DELETE') = method spoofing. --}}
                <form method="POST" action="{{ route('students.destroy', $student) }}"
                      onsubmit="return confirm('Yakin hapus {{ $student->name }}?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-sm btn-danger">Hapus</button>
                </form>
            </td>
        </tr>

        @if ($loop->last)
            </tbody>
            </table>
        @endif
    @empty
        <div class="empty">Belum ada data siswa. <a href="{{ route('students.create') }}">Tambah sekarang</a>.</div>
    @endforelse

    <div class="pagination">
        {{ $students->links() }}
    </div>

@endsection
