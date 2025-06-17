<?php

namespace App\Http\Controllers;


use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class SemesterController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum', except: [])
        ];
    }
    
    public static function getSemesters(Request $request){
        $semesterIds = DB::table('user_to_semester_to_courses')->where('user_id', $request->user()->id)->distinct()->pluck('semester_id');
        $entries = DB::table('user_to_semester_to_courses')->where('user_id', $request->user()->id)->get();
        $semesters=[];
        foreach ($semesterIds as $semesterId){
            $courses=DB::table('user_to_semester_to_courses')->where('user_id', $request->user()->id)->where('semester_id', $semesterId)->pluck('course');
            
            $semesters[]=[
                'name'=> $semesterId,
                'courses'=>$courses,
            ];


        }
        
        return response()->json([
            'semesters' => $semesters
        ]);
        
    }

    public static function saveSemesters(Request $request){
        \Log::info('Request data:', $request->all());
        $fields = $request->validate([
            '*' => 'required|array', // Ensures each item in the array is an array itself
            '*.name' => 'required',
            '*.courses' => 'array', // Courses are optional and can be an array
        ]);
        
        // Clear existing data
        $semesterIds = DB::table('user_to_semester_to_courses')
            ->where('user_id', $request->user()->id)
            ->distinct()
            ->pluck('semester_id');
            
        
        DB::table('semesters')->where('user_id', $request->user()->id)->delete();
        
        
        DB::table('user_to_semester_to_courses')->where('user_id', $request->user()->id)->delete();
        
        // Insert new data
        foreach ($fields as $semester) {
            $name = $semester['name'];
            $courses = $semester['courses'];
            
            $semesterModel = new Semester;
            $semesterModel->user_id = $request->user()->id;
            $semesterModel->semester_name = $name;
            $semesterModel->save();
            $semesterId = $semesterModel->semester_id;
            
            foreach($courses as $course){
                DB::table('user_to_semester_to_courses')->insert([
                    'user_id' => $request->user()->id, // Use authenticated user ID
                    'semester_id' => $semesterId,
                    'course_id' => $course['course_information']['id'], // Access as array, not object
                    'course' => json_encode($course), // Serialize course data
                ]);
            }
            
        }
        

        return response()->json([
            'message' => 'saved successfully',
        ]);
    }

}
