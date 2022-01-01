<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentExercice extends Model
{
    use HasFactory;
    protected $fillable = [
        'equipment_id',
        'exercice_id',
        'created_at',
        'updated_at',
    ];

    public function equipement(){
        return $this->belongsTo(Equipement::class);
    }

    public function exercice(){
        return $this->belongsTo(Exercice::class);
    }
}
