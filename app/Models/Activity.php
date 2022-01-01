<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'created_at',
        'updated_at',
    ];

    public function positions(){
        return $this->hasMany(Position::class);
    }
}
