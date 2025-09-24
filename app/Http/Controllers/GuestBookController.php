<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GuestBook;
use App\Models\User;
use Inertia\Inertia;

class GuestBookController extends Controller
{
    //
    public function index()
    {
        // Get data guest book
        $guestBooks = GuestBook::with(['user.division'])
            ->orderBy('visit_date', 'desc')
            ->orderBy('check_in_time', 'desc')
            ->get();


        return Inertia::render('GuestBook/Index', [
            'guestBooks' => $guestBooks,
        ]);
    }

    public function create()
    {
        $users = User::with('division')->get(); // Ambil user untuk dropdown
        return Inertia::render('GuestBook/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'guest_name' => 'required|string|max:255',
            'check_out_time' => 'nullable|date_format:H:i|after_or_equal:check_in_time',
            'company' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);
        $receptionist = auth()->user(); // Pastikan user login

        $validatedData['visit_date'] = now()->format('Y-m-d'); // Tanggal saat ini
        $validatedData['check_in_time'] = now()->format('H:i'); // Jam saat ini

        $validatedData['identity_number'] = $this->generateUniqueIdentityNumber();
        $validatedData['receptionist_name'] = $receptionist->name;
        GuestBook::create($validatedData);
        return redirect()->route('guestbook.index')->with('success', 'Guest book entry created successfully!');
    }
    private function generateUniqueIdentityNumber()
    {
        do {
            // Generate angka acak 8 digit
            $identityNumber = mt_rand(10000000, 99999999);
            // Periksa apakah nomor ini sudah ada di database
            $existing = GuestBook::where('identity_number', $identityNumber)->first();
        } while ($existing); // Ulangi jika sudah ada

        return $identityNumber;
    }
}
