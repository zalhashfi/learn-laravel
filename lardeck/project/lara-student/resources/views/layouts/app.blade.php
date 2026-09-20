<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Student Management System')</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

<header class="topbar">
    <div class="wrap">
        <strong>Student Management System</strong>
        <span class="fineprint">Laravel &middot; materi Backend</span>
    </div>
</header>

<main class="wrap">

    {{-- Flash message: tampil sekali, lalu hilang (padanan setFlash/getFlash deck lama) --}}
    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @yield('content')

</main>

</body>
</html>
