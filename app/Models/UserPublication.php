<?php

namespace App\Models;

use App\Traits\HasCompositePrimaryKeyTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserPublication extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasCompositePrimaryKeyTrait;

    protected $primaryKey = ['user_id', 'publication_id'];
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'publication_id',
        'completed_sequence',
        'type_subscription_id'
    ];

    public function typeSubscription()
    {
        return $this->belongsTo(TypeSubscription::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function publication(){
        return $this->BelongsTo(Publication::class);
    }
}
