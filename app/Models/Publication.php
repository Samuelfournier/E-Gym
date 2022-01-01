<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publication extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'tags',
        'overview',
        'time_total',
        'media',
        'media_card',
        'category_id',
        'type_visibility_id',
        'position_id',
        'type_publication_id',
    ];

    protected $casts =[
        'tags' => 'array',
    ];



    public function typePublication(){
        return $this->BelongsTo(TypePublication::class);
    }

    public function typeVisibility(){
        return $this->BelongsTo(TypeVisibility::class);
    }

    public function category(){
        return $this->BelongsTo(Category::class);
    }

    public function position(){
        return $this->BelongsTo(Position::class);
    }

    public function weeks(){
        return $this->hasMany(Week::class);
    }

    public function userPublication(){
        return $this->hasMany(UserPublication::class);
    }

}
