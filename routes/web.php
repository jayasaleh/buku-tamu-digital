<?php

use App\Http\Controllers\GuestBookController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->middleware(['auth']);

Route::get('/dashboard', function () {

    $allGuestBooks = \App\Models\GuestBook::with(['user.division'])
        ->orderBy('visit_date', 'desc')
        ->orderBy('check_in_time', 'desc')
        ->get();
    $users = \App\Models\User::with('division')->get();

    return Inertia::render('Dashboard', ['allGuestBooks' => $allGuestBooks, 'users' => $users]);
})->middleware(['auth'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('guestbook')->name('guestbook.')->group(function () {
        Route::get('/', [GuestBookController::class, 'index'])->name('index');

        Route::post('/', [GuestBookController::class, 'store'])->name('store');

        Route::get('/{id}/edit', [GuestBookController::class, 'edit'])->name('edit');
        Route::put('/{id}', [GuestBookController::class, 'update'])->name('update');
        Route::delete('/{id}', [GuestBookController::class, 'destroy'])->name('destroy');

        Route::put('/{id}/update-checkout', [GuestBookController::class, 'updateCheckOut'])->name('update.checkout');
    });
});

require __DIR__ . '/auth.php';
