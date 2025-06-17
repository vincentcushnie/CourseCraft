<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserInfoController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\SemesterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    $user = $request->user();
    $userInfo = UserInfoController::getUserInfo($request->user()->id);
    $majorOne = MajorController::getMajor($userInfo->major_one_id);
    $majorTwo = Majorcontroller::getMajor($userInfo->major_two_id);    
    return ['user'=>$request->user(), 'user_info'=>UserInfoController::getUserInfo($request->user()->id), 'major_one'=>$majorOne, 'major_two'=>$majorTwo];    
})->middleware('auth:sanctum');

Route::apiResource('posts', PostController::class);

Route::put('/user', [UserInfoController::class, 'update'])->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/majors', [MajorController::class, 'majors']);

Route::get('/majors/{id}', [MajorController::class, 'majorCourses']);

Route::get('/', function(){
    return 'API';
});

Route::get('/test', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/course/prereqs/courses/{id}', [CourseController::class, 'coursePrerequisites']);

Route::put('/semesters', [SemesterController::class, 'saveSemesters']);

Route::get('/semesters', [SemesterController::class, 'getSemesters']);

Route::get('/courses/menu/{id_code}/{major_id}', [CourseController::class, 'getMenu']);

Route::get('/courses/departments', [CourseController::class, 'getDepartments']);

Route::get('/courses/department/{department}', [CourseController::class, 'getDepartmentCourses']);