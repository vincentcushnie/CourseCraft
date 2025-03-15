<?php

namespace App\Http\Controllers;


use App\Models\UserInfo;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class UserInfoController extends Controller implements HasMiddleware
{
    public static function middleware(){
        return [
            new Middleware('auth:sanctum', except: [])
        ];
    }
    /**
     * Returns userInfo based on userId
     */
    public static function getUserInfo($userId)
    {
        return UserInfo::where('user_id', $userId)->first(); // Fetch user-related info
    }

    public function update(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'major_one_id' => 'nullable|exists:majors,id',  
            'major_two_id' => 'nullable|exists:majors,id',  
        ]);
    
        // Find the UserInfo record for the authenticated user
        $userInfo = UserInfo::where('user_id', $request->user()->id)->first();
    
        // Check if user info exists
        if (!$userInfo) {
            return response()->json(['error' => 'User info not found'], 404);
        }
    
        // Update the userInfo fields
        if (array_key_exists('name', $fields)) {
            $userInfo->name = $fields['name'];
        }
        
        if (array_key_exists('major_one_id', $fields)) {
            $userInfo->major_one_id = $fields['major_one_id'];
        }
        
        if (array_key_exists('major_two_id', $fields)) {
            $userInfo->major_two_id = $fields['major_two_id'];
        }
    
        // Save the updated userInfo record
        $userInfo->save();
    
        // Return the updated userInfo
        return ['userInfo' => $userInfo];
    }
    /**
     * Store a newly created resource in storage.
     */
    
}
