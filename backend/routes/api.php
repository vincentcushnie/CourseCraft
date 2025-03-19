<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserInfoController;
use App\Http\Controllers\MajorController;
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

Route::get('/', function(){
    return 'API';
});


