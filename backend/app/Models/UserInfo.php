<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    //
    protected $table = 'user_info';
    protected $fillable = [
        'name',
        'major_one_id',
        'major_two_id'
    ];

    
}
