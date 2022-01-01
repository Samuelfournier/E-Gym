<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionTraining extends Model
{
    use HasFactory;

    protected $fillable = ['session_id', 'training_id'];

    public function training(){
        return $this->belongsTo(Training::class);
    }

    public function session(){
        return $this->belongsTo(Session::class);
    }
}
