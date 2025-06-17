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
    $results = DB::table('major_to_courses')
    ->leftJoin('courses', 'major_to_courses.course_id', '=', 'courses.id')
    ->where('major_to_courses.major_id', $id)
    ->select('major_to_courses.*', 'courses.*')
    ->get();

    $separated = $results->map(function ($item) {
        return [
            'major_wrapper' => collect($item)->only([
                'course_id', 'major_id', 'major_course_rules', 'group','time_code','hours','course_text' /* other major_to_courses columns */
            ]),
            'course_information' => collect($item)->only([
                'id','course_code', 'course_name', 'field', 'credits','lecture','lab','description','difficulty' /* other courses columns */
            ]),
        ];
    });
    return $separated;
    }

}
