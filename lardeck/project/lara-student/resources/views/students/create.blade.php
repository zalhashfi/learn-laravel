@extends('layouts.app')

@section('title', 'Tambah Siswa')

@section('content')

    <h1>Tambah Siswa</h1>

    <form method="POST" action="{{ route('students.store') }}" class="card">
        @csrf

        @include('students._form')

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Simpan</button>
            <a class="btn btn-plain" href="{{ route('students.index') }}">Batal</a>
        </div>
    </form>

@endsection
