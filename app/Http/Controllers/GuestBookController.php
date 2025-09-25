<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GuestBook;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;

class GuestBookController extends Controller
{
    public function index(Request $request)
    {
        $searchGuestName = $request->query('search_guest_name');
        $searchDate = $request->query('search_date');
        $searchCompany = $request->query('search_company');

        $query = GuestBook::with(['user.division'])
            ->orderBy('visit_date', 'asc')
            ->orderBy('check_in_time', 'asc');

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
        $users = User::with('division')->get();

        return inertia('Dashboard', [
            'allGuestBooks' => $allGuestBooks,
            'users' => $users,
            'filters' => [
                'search_guest_name' => $searchGuestName,
                'search_date' => $searchDate,
                'search_company' => $searchCompany,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'guest_name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'check_out_time' => 'nullable|date_format:H:i|after:check_in_time',
            'user_id' => 'required|exists:users,id',
        ]);

        $receptionist = auth()->user();

        $validatedData['visit_date'] = now()->format('Y-m-d');
        $validatedData['check_in_time'] = now()->format('H:i');
        $validatedData['identity_number'] = $this->generateUniqueIdentityNumber();
        $validatedData['receptionist_name'] = $receptionist->name;

        GuestBook::create($validatedData);

        return redirect()->route('dashboard')->with('success', 'Guest book entry created successfully!');
    }



    public function update(Request $request, $id)
    {
        $guestBook = GuestBook::findOrFail($id);

        $validatedData = $request->validate([
            'guest_name' => 'required|string|max:255',
            'visit_date' => 'required|date',
            'check_in_time' => [
                'required',
                'string',
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/',
            ],
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
            $validatedData['check_in_time'] = substr($validatedData['check_in_time'], 0, 5);
        }
        if (isset($validatedData['check_out_time']) && $validatedData['check_out_time'] !== null) {
            $validatedData['check_out_time'] = substr($validatedData['check_out_time'], 0, 5);
        }

        $guestBook->update($validatedData);

        return redirect()->route('dashboard')->with('success', 'Guest book entry updated successfully!');
    }

    public function destroy($id)
    {
        $guestBook = GuestBook::findOrFail($id);
        $guestBook->delete();

        return redirect()->route('dashboard')->with('success', 'Guest book entry deleted successfully!');
    }

    public function updateCheckOut(Request $request, $id)
    {

        $guestBook = GuestBook::findOrFail($id);

        $guestBook->check_out_time = now()->format('H:i');

        $guestBook->save();

        if ($request->wantsJson() || $request->inertia()) {

            return response('', 200);
        }

        return back()->with('success', 'Check-out time updated successfully');
    }
    public function exportPdf()
    {

        $searchGuestName = request('search_guest_name');
        $searchDate = request('search_date');
        $searchCompany = request('search_company');

        $query = \App\Models\GuestBook::with(['user.division'])
            ->orderBy('visit_date', 'asc')
            ->orderBy('check_in_time', 'asc');

        if ($searchGuestName) {
            $query->where('guest_name', 'LIKE', "%{$searchGuestName}%");
        }


        if ($searchDate) {
            $query->whereDate('visit_date', $searchDate);
        }

        if ($searchCompany) {
            $query->where('company', 'LIKE', "%{$searchCompany}%");
        }

        $guestBooks = $query->get();

        $filters = [
            'search_guest_name' => $searchGuestName,
            'search_date' => $searchDate,
            'search_company' => $searchCompany,

        ];


        $pdf = Pdf::loadView('guestbooks.export_pdf', compact('guestBooks', 'filters'));

        return $pdf->download('Buku_Tamu_PDF_' . now()->format('Y-m-d_H-i') . '.pdf');
    }
    private function generateUniqueIdentityNumber()
    {
        do {
            $identityNumber = mt_rand(10000000, 99999999);
            $existing = GuestBook::where('identity_number', $identityNumber)->first();
        } while ($existing);

        return $identityNumber;
    }
}
