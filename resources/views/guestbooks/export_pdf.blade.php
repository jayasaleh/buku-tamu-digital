<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <title>Daftar Buku Tamu</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th,
    td {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
      font-weight: bold;
      text-align: center;
    }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }

    .mb-10 {
      margin-bottom: 10px;
    }

    .mt-20 {
      margin-top: 20px;
    }

    .page-break {
      page-break-after: always;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 18px;
    }

    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
    }
  </style>
</head>

<body>
  <div class="header">
    <h1>Laporan Buku Tamu</h1>
    <p>Periode: {{ $filters['start_date'] ?? 'Semua' }} - {{ $filters['end_date'] ?? 'Sekarang' }}</p>
    @if(!empty($filters['search']))
    <p>Pencarian: "{{ $filters['search'] }}"</p>
    @endif
    <p>Dicetak pada: {{ now()->format('d/m/Y H:i') }}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama Tamu</th>
        <th>Tanggal</th>
        <th>Jam Masuk</th>
        <th>Jam Keluar</th>
        <th>Perusahaan</th>
        <th>Keperluan</th>
        <th>User Tujuan</th>
        <th>Divisi User</th>
        <th>No. Identitas</th>
        <th>Nama Penerima Tamu</th>
      </tr>
    </thead>
    <tbody>
      @forelse ($guestBooks as $index => $entry)
      <tr>
        <td class="text-center">{{ $index + 1 }}</td>
        <td>{{ $entry->guest_name }}</td>
        <td class="text-center">{{ $entry->visit_date ? \Carbon\Carbon::parse($entry->visit_date)->format('d/m/Y') : '-' }}</td>
        <td class="text-center">{{ $entry->check_in_time ?? '-' }}</td>
        <td class="text-center">{{ $entry->check_out_time ?? '-' }}</td>
        <td>{{ $entry->company }}</td>
        <td>{{ $entry->purpose }}</td>
        <td>{{ $entry->user->name ?? 'N/A' }}</td>
        <td>{{ $entry->user->division->name ?? 'N/A' }}</td>
        <td>{{ $entry->identity_number }}</td>
        <td>{{ $entry->receptionist_name }}</td>
      </tr>
      @empty
      <tr>
        <td colspan="11" class="text-center">Tidak ada data buku tamu.</td>
      </tr>
      @endforelse
    </tbody>
  </table>

  {{-- Informasi tambahan jika diperlukan --}}
  {{-- <div class="mt-20">
        <p><strong>Total Tamu:</strong> {{ $guestBooks->count() }}</p>
  </div> --}}
</body>

</html>