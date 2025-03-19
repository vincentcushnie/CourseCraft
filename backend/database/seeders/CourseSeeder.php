<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $csvPath = storage_path('app/csvSeedData/courseTable.csv');

        // Load the CSV file using the League CSV package
        $csv = Reader::createFromPath($csvPath, 'r');
        $csv->setHeaderOffset(0); // Assuming the first row contains headers

        // Convert CSV records into an array
        $records = iterator_to_array($csv->getRecords());

        // Insert each record into the database
        foreach ($records as $record) {
            DB::table('courses')->insert([
                'course_code' => $record['courseCode'], // Adjust column names
                'course_name' => $record['courseName'],
                'field' => $record['field'],
                'credits' => (int) $record['credits'],
                'lecture' =>  (int) $record['lecture'],
                'lab' => (int) $record['lab'],
                'description' => $record['description'],
                'difficulty' => (double) $record['difficulty'],
            ]);
        }
    }
}