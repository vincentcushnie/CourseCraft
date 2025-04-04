<?php

namespace App\Http\Controllers;


use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class MajorController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum', except: [])
        ];
    }
    /**
     * Returns userInfo based on userId
     */
    public static function getMajor($majorId)
    {
        return Major::where('id', $majorId)->first(); // Fetch user-related info
    }

    public static function majors(){
        return Major::select('id', 'major_name')->get(); 
    }

    public static function majorCourses($id){
        $major_to_course_information = DB::table('major_to_courses')
    ->leftJoin('courses', 'major_to_courses.course_id', '=', 'courses.id')
    ->where('major_to_courses.major_id', $id)
    ->select('major_to_courses.*', 'courses.*') // Selects all columns from both tables
    ->get();
    return $major_to_course_information;
    }

}
