<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;

class MajorToCoursesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

     
    public function run(): void
    {
        //
        $csvPath = storage_path('app/csvSeedData/majorToCoursesTable.csv');
        $courseTable = DB::table('courses')->pluck('id', 'course_code')->toArray();
        // Load the CSV file using the League CSV package
        $csv = Reader::createFromPath($csvPath, 'r');
        $csv->setHeaderOffset(0); // Assuming the first row contains headers

        // Convert CSV records into an array
        $records = iterator_to_array($csv->getRecords());

        // Insert each record into the database
        foreach ($records as $record) {
            $course_id = $courseTable[$record['courseCode']] ?? null;
            $course_text = $course_id === null ? $record['courseCode'] : null;
            DB::table('major_to_courses')->insert([
                'major_id' => $record['majorCode'], // Adjust column names
                'course_id' => $course_id,
                'group' => $record['group'],
                'time_code' => $record['timeCode'],
                'major_course_rules' => $record['rules'],
                'hours' => (int) $record['hours'],
                'course_text'=>$course_text,
                
            ]);
        }
    }
}