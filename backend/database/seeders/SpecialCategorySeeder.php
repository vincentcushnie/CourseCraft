<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;

class SpecialCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvPath = storage_path('app/csvSeedData/specialCategoryData.csv');
        $courseTable = DB::table('courses')->pluck('id', 'course_code')->toArray();
        // Load the CSV file using the League CSV package
        $csv = Reader::createFromPath($csvPath, 'r');
        $csv->setHeaderOffset(0); // Assuming the first row contains headers

        // Convert CSV records into an array
        $records = iterator_to_array($csv->getRecords());

        // Insert each record into the database
        foreach ($records as $record) {
            $course_id = $courseTable[$record['courseCode']] ?? null;
            if ($course_id === null) {
                throw new \Exception(
                    "The course {$record['courseCode']} does not have an ID. "
                    ."This either means it has not been scraped (unlikely), or the courseCode was inputted incorrectly. "
                    ."Please check that course data is being regularly re-scraped and updated."
                );
            }
            DB::table('special_categories')->insert([
                'category_id' => $record['category'], // Adjust column names
                'course_id' => $course_id,
            ]);
        }
    }
}
