<?php

namespace App\Models;

use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'activity_id',
        'created_at',
        'updated_at',
    ];

    public function activity(){
        return $this->belongsTo(Activity::class);
    }

    public function publications(){
        return $this->hasMany(Publication::class);
    }

    public function userPosition(){
        return $this->hasMany(UserPosition::class);
    }
}
