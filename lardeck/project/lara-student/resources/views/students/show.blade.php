@extends('layouts.app')

@section('title', 'Detail Siswa')

@section('content')

    <h1>Detail Siswa</h1>

    <div class="card">
        <table class="data">
            <tr><th>ID</th><td>{{ $student->id }}</td></tr>
            <tr><th>Nama</th><td>{{ $student->name }}</td></tr>
            <tr><th>Email</th><td>{{ $student->email }}</td></tr>
            <tr><th>Jurusan</th><td>{{ $student->major }}</td></tr>
            <tr><th>Dibuat</th><td>{{ $student->created_at->format('d M Y, H:i') }}</td></tr>
            <tr><th>Diperbarui</th><td>{{ $student->updated_at->format('d M Y, H:i') }}</td></tr>
        </table>
    </div>

    <p>
        <a class="btn" href="{{ route('students.edit', $student) }}">Edit</a>
        <a class="btn btn-plain" href="{{ route('students.index') }}">Kembali</a>
    </p>

@endsection
