<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Division;
use Illuminate\Support\Facades\Hash; // Untuk hashing password

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada divisi di database. Ambil ID dari divisi 'IT' sebagai contoh.
        // Kamu bisa menyesuaikan logika ini untuk memilih divisi secara dinamis atau acak.
        $itDivision = Division::where('name', 'IT')->first();
        $hrDivision = Division::where('name', 'Human Resources')->first();
        $financeDivision = Division::where('name', 'Finance')->first();

        if (!$itDivision || !$hrDivision || !$financeDivision) {
            // Jika divisi yang dibutuhkan tidak ada, tampilkan pesan error dan hentikan seeding
            echo "Error: Required divisions (IT, Human Resources, Finance) not found. Please seed divisions first.\n";
            return;
        }

        // Data user contoh
        $users = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budisantoso@example.com',
                'password' => Hash::make('password'),
                'position' => 'Fullstack Developer',
                'contact' => '08123456789',
                'division_id' => $itDivision->id,

            ],
            [
                'name' => 'Max Mustermann',
                'email' => 'maxmustermann@example.com',
                'password' => Hash::make('password123'),
                'position' => 'Receptionist',
                'contact' => '08129876543',
                'division_id' => $hrDivision->id,
                'role' => 'Administrator',
            ],
            [
                'name' => 'John Doe',
                'email' => 'johndoe@example.com',
                'password' => Hash::make('password'),
                'position' => 'Staff',
                'contact' => '08555555555',
                'division_id' => $financeDivision->id,
                'role' => 'employee',
            ],
        ];


        foreach ($users as $userData) {

            User::firstOrCreate(['email' => $userData['email']], $userData);
        }
    }
}
