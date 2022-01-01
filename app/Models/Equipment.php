<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'created_at',
        'updated_at',
        'user_id',
    ];

    public $table = 'equipments';

    public function equipementExercices(){
        return $this->hasMany(EquipementExercice::class);
    }

}
