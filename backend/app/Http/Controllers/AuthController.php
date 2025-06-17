<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request){
        $fields=$request->validate([
            'name'=>'required|max:255',
            'email'=>'required|email|unique:users',
            'password'=>'required|confirmed'
        ]);

        $userInfoFields = [
            'name'=>$request->name,
            'major_one_id' => null,
            'major_two_id' => null,
        ];
    
        $validatedUserInfo = validator($userInfoFields, [
            'name' => 'required|string|max:255',
            'major_one_id' => 'nullable|exists:majors,id',  
            'major_two_id' => 'nullable|exists:majors,id',  
        ])->validate(); 
        $user=User::create($fields);

        // Create the user_info after validation
        $userInfo = new UserInfo($userInfoFields);
        $userInfo->user_id = $user->id;
        $userInfo->save();

        $token = $user->createToken($request->name);

        return [
            'user'=>$user,
            'user_info'=>$userInfo,
            'token'=> $token->plainTextToken
        ];
    }

    public function login(Request $request){
        $request->validate([
            'email'=>'required|email|exists:users',
            'password'=>'required'
        ]);

        $user=User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            return [
                'errors' => [
                    'email'=> ['The provided credentials are incorrect.']
                ]
                ];
        }

        $token = $user->createToken($user->name);

        return[
            'user'=>$user,
            'token'=>$token->plainTextToken
        ];
    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();

        return[
            'message'=>'You are logged out'
        ];
    }
}
