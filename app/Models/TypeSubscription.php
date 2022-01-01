<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeSubscription extends Model
{
    use HasFactory;

    public function userPublications()
    {
        return $this->hasMany(UserPublication::class);
    }
}
