<?php

namespace App\Http\Controllers;


use App\Models\Major;
use Illuminate\Http\Request;
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

}
