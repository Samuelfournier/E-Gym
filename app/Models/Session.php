<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = ['no_session', 'no_week', 'week_id'];

    public function sessionTrainings(){
        return $this->hasMany(SessionTraining::class);
    }

    public function week(){
        return $this->BelongsTo(Week::class);
    }

}
