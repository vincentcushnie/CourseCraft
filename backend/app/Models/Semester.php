<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $primaryKey = 'semester_id';
    public $incrementing = true;
    protected $keyType='int';

}