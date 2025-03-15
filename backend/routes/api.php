<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserInfoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return ['user'=>$request->user(), 'user_info'=>UserInfoController::getUserInfo($request->user()->id)];    
})->middleware('auth:sanctum');

Route::apiResource('posts', PostController::class);

Route::put('/user', [UserInfoController::class, 'update'])->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/', function(){
    return 'API';
});


