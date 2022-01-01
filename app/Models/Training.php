<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Training extends Model
{
    use HasFactory;

    protected $fillable = ['duration', 'tempo', 'nb_serie', 'nb_repetition', 'resting_time', 'exercice_id', 'order'];

    public function exercice(){
        return $this->belongsTo(Exercice::class);
    }

    public function sessionTrainings(){
        return $this->hasMany(SessionTraining::class);
    }
}
