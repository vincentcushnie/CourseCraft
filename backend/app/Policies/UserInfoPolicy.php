<?php

namespace App\Policies;

use App\Models\UserInfo;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserInfoPolicy
{
    /**
     * Create a new policy instance.
     */
    public function modify(User $user, UserInfo $userInfo): Response{

        \Log::info('User ID: ' . $user->id);
        \Log::info('UserInfo User ID: ' . $userInfo->user_id);
        return $user->id === $userInfo->user_id
            ? Response::allow()
            : Response::deny('You cannot change another user\'s info');
    }
    
}
