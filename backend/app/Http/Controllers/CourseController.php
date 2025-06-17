<?php

namespace App\Http\Controllers;


use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum', except: [])
        ];
    }
    /**
     * Returns userInfo based on userId
     */
    

    

    public static function coursePrerequisites($id){
    $id = (int)$id;
     $course_prerequisite_data = DB::table('courses_prerequisites')
    ->where('courses_prerequisites.course_id', $id)
    ->whereNotNull('courses_prerequisites.course_id_two')
    ->join('courses', 'courses.id', '=', 'courses_prerequisites.course_id_two') // Join courses on course_id_two
    ->select('courses_prerequisites.*', 'courses.course_code') // Add course_code to the selection
    ->get();
    return $course_prerequisite_data;
    }

    public static function getMenu($id_code, $major_id){
        if($id_code == "General Elective"){
            return response()->json([
                'message' => 'GE functionality not yet implemented',
            ]);
        }else if($id_code == "University Core Curriculum Language, Philosophy and Culture"){
                $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id', 'UCC Language, Philosophy and Culture')
                    ->select('courses.*')
                    ->get();

                return $courses;

        }else if($id_code == "University Core Curriculum Government-Political Science"){
                 $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id', 'UCC Government/Political Science')
                    ->select('courses.*')
                    ->get();

                return $courses;
        }else if($id_code == "University Core Curriculum Creative Arts"){
                 $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id', 'UCC Creative Arts')
                    ->select('courses.*')
                    ->get();

                return $courses;
        }else if($id_code == "University Core Curriculum American History"){
                 $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id', 'UCC American History')
                    ->select('courses.*')
                    ->get();

                return $courses;
        }else if($id_code == "University Core Curriculum Mathematics"){
                 $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id', 'UCC Mathematics')
                    ->select('courses.*')
                    ->get();

                return $courses;
        }else if($id_code == "University Core Curriculum Social and Behavioral Sciences"){
                 $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id', 'UCC Social and Behavioral Sciences')
                    ->select('courses.*')
                    ->get();

                return $courses;
        }else if($id_code == "University Core Curriculum Communication"){
                 $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id', 'UCC Communication')
                    ->select('courses.*')
                    ->get();

                return $courses;
        }else if($id_code == "University Core Curriculum Life and Physical Sciences"){
                 $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id', 'UCC Life and Physical Sciences')
                    ->select('courses.*')
                    ->get();

                return $courses;
        }else if(DB::table('special_categories')->where('category_id', $major_id.':'.$id_code)->exists()){
                    
                     
                 $courses = \App\Models\Course::join('special_categories', 'courses.id', '=', 'special_categories.course_id')
                    ->where('special_categories.category_id',  $major_id.':'.$id_code)
                    ->select('courses.*')
                    ->get();

                return $courses;
        }else if(preg_match('/^[A-Za-z]{4} \d{3}-\d{3}$/', $id_code)){
            $field = substr($id_code, 0, 4);
            $startingBound= (int) substr($id_code,5,3);
            $endingBound=(int) substr($id_code, 9, 3); 
            
            $subquery = DB::table('major_to_courses') //gets specific-courses from major.
            ->select('course_id')
            ->where('major_id', $major_id)
            ->whereNotNull('course_id'); 
        
            $courses = Course::where('field', $field)
            ->whereRaw('CAST(SUBSTRING(course_code, 5) AS INTEGER) BETWEEN ? AND ?', [$startingBound, $endingBound])
            ->whereNotIn('id', $subquery) // Exclude courses already assigned to the major
            ->orderByRaw('CAST(SUBSTRING(course_code, 5) AS INTEGER)')
            ->get();

            return $courses;
        }else{
            $courses = Course::where('course_code', 'GENR100')->get();
            return $courses;
        }
    }

    public static function getDepartments(){
        $departments = Course::distinct()->pluck('field');
        return $departments;
    }

    public static function getDepartmentCourses($department){
        $start = microtime(true);

        return Course::where('field', $department)->get();

$end = microtime(true);
Log::info('Execution time: ' . ($end - $start) . ' seconds');
    }

}
