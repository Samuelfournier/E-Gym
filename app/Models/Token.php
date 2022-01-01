<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'expiration_date',
        'is_used',
        'batch',
    ];

    protected $dates = [
       /* 'created_at' => 'datetime:Y-m-d',
        'expiration_date' => 'datetime:Y-m-d'*/
    ];

    public function user(){
        return $this->hasOne(User::class);
    }
}
