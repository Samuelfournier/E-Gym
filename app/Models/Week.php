<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Week extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'no_week', 'publication_id'];

    public function sessions(){
        return $this->hasMany(Session::class);
    }

    public function publication(){
        return $this->BelongsTo(Publication::class);
    }
}
