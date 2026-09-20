<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Pakai tampilan paginasi "plain" (lihat resources/views/vendor/pagination/plain.blade.php)
        // supaya tidak bergantung Tailwind/Bootstrap. Proyek materi ini sengaja
        // tanpa build step CSS (cukup `php artisan serve`).
        Paginator::defaultView('pagination::plain');
        Paginator::defaultSimpleView('pagination::plain');
    }
}
