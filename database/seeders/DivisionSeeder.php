<?php
// database/seeders/DivisionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Division; // Impor model Division

class DivisionSeeder extends Seeder
{

    public function run(): void
    {

        $divisions = [
            ['name' => 'IT'],
            ['name' => 'Human Resources'],
            ['name' => 'Finance'],
            ['name' => 'Marketing'],
            ['name' => 'Operations'],
        ];


        foreach ($divisions as $divisionData) {
            Division::firstOrCreate($divisionData);
        }
    }
}
