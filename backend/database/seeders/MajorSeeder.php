<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $csvPath = storage_path('app/csvSeedData/majorTable.csv');

        // Load the CSV file using the League CSV package
        $csv = Reader::createFromPath($csvPath, 'r');
        $csv->setHeaderOffset(0); // Assuming the first row contains headers

        // Convert CSV records into an array
        $records = iterator_to_array($csv->getRecords());

        // Insert each record into the database
        foreach ($records as $record) {
            DB::table('majors')->insert([
                'major_name' => $record['major_name'], // Adjust column names
                'major_code' => $record['major_code'],
                'department' => $record['department'],
                'credits' => $record['credits'],
                'difficulty' => $record['difficulty'],
                'rules' => $record['rules'],
            ]);
        }
    }
}
