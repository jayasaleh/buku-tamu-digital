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
            'company' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);
        $receptionist = auth()->user(); // Pastikan user login

        $validatedData['visit_date'] = now()->format('Y-m-d');
        $validatedData['check_in_time'] = now()->format('H:i');
        $validatedData['identity_number'] = $this->generateUniqueIdentityNumber();
        $validatedData['receptionist_name'] = $receptionist->name;
        GuestBook::create($validatedData);
        return redirect()->route('guestbook.index')->with('success', 'Guest book entry created successfully!');
    }
    public function update(Request $request, $id)
    {
        $guestBook = GuestBook::findOrFail($id);

        // Ubah rule date_format untuk check_in_time dan check_out_time
        // agar menerima format H:i (HH:MM) atau H:i:s (HH:MM:SS)
        $validatedData = $request->validate([
            'guest_name' => 'required|string|max:255',
            'visit_date' => 'required|date',
            'check_in_time' => 'required|date_format:H:i|after_or_equal:visit_date', // Jika hanya ingin HH:MM
            // ATAU
            'check_in_time' => 'required|date_format:H:i:H:i:s|after_or_equal:visit_date', // Jika ingin menerima HH:MM atau HH:MM:SS
            // ATAU, yang paling fleksibel:
            'check_in_time' => [
                'required',
                'string', // Validasi sebagai string
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/', // Regex untuk HH:MM atau HH:MM:SS
                'after_or_equal:visit_date'
            ],
            'check_out_time' => 'nullable|date_format:H:i:H:i:s|after_or_equal:check_in_time', // Sama untuk check_out_time
            // ATAU, yang paling fleksibel:
            'check_out_time' => [
                'nullable',
                'string',
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/',
                'after_or_equal:check_in_time'
            ],
            'company' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'identity_number' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);
        if (isset($validatedData['check_in_time'])) {
            $time = \DateTime::createFromFormat('H:i:s', $validatedData['check_in_time']);
            if ($time) {
                $validatedData['check_in_time'] = $time->format('H:i');
            }
        }

        if (isset($validatedData['check_out_time']) && $validatedData['check_out_time'] !== null) {
            $time = \DateTime::createFromFormat('H:i:s', $validatedData['check_out_time']);
            if ($time) {
                $validatedData['check_out_time'] = $time->format('H:i');
            }
        }
        $guestBook->update($validatedData);
    }

    public function updateCheckOut(Request $request, $id)
    {
        $guestBook = GuestBook::findOrFail($id);
        $guestBook->check_out_time = now()->format('H:i');
        $guestBook->save();
        return response()->json(['message' => 'Check-out time updated successfully'], 200);
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
