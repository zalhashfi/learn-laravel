@extends('layouts.app')

@section('title', 'Edit Siswa')

@section('content')

    <h1>Edit Siswa</h1>

    {{-- Nama method PUT: HTML form tidak mendukung PUT, jadi pakai @method --}}
    <form method="POST" action="{{ route('students.update', $student) }}" class="card">
        @csrf
        @method('PUT')

        @include('students._form')

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Perbarui</button>
            <a class="btn btn-plain" href="{{ route('students.index') }}">Batal</a>
        </div>
    </form>

@endsection
