<?php
// routes/web.php

use App\Http\Controllers\GuestBookController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->middleware(['auth']);

Route::get('/dashboard', function () {
    $searchGuestName = request('search_guest_name');
    $searchDate = request('search_date');
    $searchCompany = request('search_company');

    $query = \App\Models\GuestBook::with(['user.division'])
        ->orderBy('visit_date', 'desc')
        ->orderBy('check_in_time', 'desc');

    if ($searchGuestName) {
        $query->where('guest_name', 'LIKE', "%{$searchGuestName}%");
    }

    if ($searchDate) {
        $query->whereDate('visit_date', $searchDate);
    }

    if ($searchCompany) {
        $query->where('company', 'LIKE', "%{$searchCompany}%");
    }

    $allGuestBooks = $query->get();

    $users = \App\Models\User::with('division')->get();

    return Inertia::render('Dashboard', [
        'allGuestBooks' => $allGuestBooks,
        'users' => $users,
        'filters' => [
            'search_guest_name' => $searchGuestName,
            'search_date' => $searchDate,
            'search_company' => $searchCompany,
        ]
    ]);
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('guestbook')->name('guestbook.')->group(function () {

        Route::post('/', [GuestBookController::class, 'store'])->name('store');

        Route::put('/{id}', [GuestBookController::class, 'update'])->name('update');

        Route::delete('/{id}', [GuestBookController::class, 'destroy'])->name('destroy');

        Route::put('/{id}/update-checkout', [GuestBookController::class, 'updateCheckOut'])->name('update.checkout');

        Route::get('/export-pdf', [GuestBookController::class, 'exportPdf'])->name('export.pdf');
    });
});

// Memasukkan route autentikasi yang disediakan oleh Laravel Breeze
require __DIR__ . '/auth.php';
