<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;

class PrereqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $csvPath = storage_path('app/csvSeedData/coursesPrerequisitesTable.csv');
        $courseTable = DB::table('courses')->pluck('id', 'course_code')->toArray();

        // Load the CSV file using the League CSV package
        $csv = Reader::createFromPath($csvPath, 'r');
        $csv->setHeaderOffset(0); // Assuming the first row contains headers

        // Convert CSV records into an array
        $records = iterator_to_array($csv->getRecords());

        // Insert each record into the database
        foreach ($records as $record) {
            $course_id = $courseTable[$record['course_code']] ?? null;
            $course_id_two = $courseTable[$record['course_code_two']] ?? null;

            // Check for concurrency value
            $concurrency = ($record['concurrent_enrollment'] === "N/A") ? false : true;

            // Only insert if both course_id and course_id_two are valid (not null)
            if ($course_id) {
                DB::table('courses_prerequisites')->insert([
                    'course_id' => $course_id,
                    'course_id_two' => $course_id_two,
                    'grade_requirement' => $record['grade_req'],
                    'group'=>$record['group'],
                    'text_requirement' => $record['text'],
                    'concurrent_enrollment' => $concurrency,
                ]);
            }
        }
    }
}