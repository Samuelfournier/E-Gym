<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercice extends Model
{
    use HasFactory;

    public function equipementExercices(){
        return $this->hasMany(EquipementExercice::class);
    }

    public function trainings(){
        return $this->hasMany(Training::class);
    }
}
