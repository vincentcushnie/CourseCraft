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
     ->whereNotNull('courses_prerequisites.course_id_two') // Ensures course_id_two is not null
     ->select('courses_prerequisites.*') // Selects all columns from the courses_prerequisites table
     ->get();
    return $course_prerequisite_data;
    }

}
