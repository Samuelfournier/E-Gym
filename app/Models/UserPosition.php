<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPosition extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'position_id',
    ];



    public function user(){
        return $this->hasOne(User::class);
    }

    public function position(){
        return $this->hasOne(Position::class);
    }

}
