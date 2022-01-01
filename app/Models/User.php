<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\SpecialistChangePasswordNotification;
use App\Notifications\LockedAccountTooManyAttemptsNotification;
use App\Notifications\AttemptToRegisterWithExistingEmailNotification;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'firstname',
        'email',
        'gender',
        'password',
        'lastname',
        'title',
        'media',
        'description',
        'facebook_link',
        'linkin_link',
        'instagram_link',
        'payment_accepted',
        'profile_completed',
        'activity_id',
        'role_id',
        'user_status_id',
        'province_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function userStatus()
    {
        return $this->belongsTo(UserStatus::class);
    }

    public function userRole()
    {
        return $this->belongsTo(UserRole::class);
    }

    public function token(){
        return $this->belongsTo(Token::class);
    }

    public function userActivities()
    {
        return $this->hasMany(Token::class);
    }

    public function userPublications(){
        return $this->hasMany(userPublications::class);
    }

    public function province(){
        return $this->belongsTo(Province::class);
    }


    /**
     * sendPasswordResetNotification
     * This function will send a email notification to the user when he wants to reset his password.
     * @param  mixed $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        // Set the url of the button in email. Should redirect to frontend reset password page
        $url = env('APP_URL') . '/reinitialisation-mot-de-passe?email=' . $this->email . '&token=' . $token;

        // Send the email notification
        $this->notify(new ResetPasswordNotification($url));
    }

     /**
     * sendPasswordResetNotification
     * This function will send a email notification to the user when he wants to reset his password.
     * @param  mixed $token
     * @return void
     */
    public function sendSpecialistPasswordNotification($token)
    {
        // Set the url of the button in email. Should redirect to frontend reset password page
        $url = env('APP_URL') . '/reinitialisation-mot-de-passe?email=' . $this->email . '&token=' . $token;

        // Send the email notification
        $this->notify(new SpecialistChangePasswordNotification($url));
    }
    /**
     * sendAttemptToRegisterWithExistingEmailNotification
     *
     * @return void
     */
    public function sendAttemptToRegisterWithExistingEmailNotification()
    {
        // Set the url of the button in email. Redirect to homepage
        $url = env('APP_URL');

        // Send the email notification
        $this->notify(new AttemptToRegisterWithExistingEmailNotification($url));
    }

    /**
     * sentLockedAccountTooManyAttemptsNotification
     *
     * @return void
     */
    public function sentLockedAccountTooManyAttemptsNotification()
    {
        // Set the url of the button in email. Redirect to homepage
        $url = env('APP_URL');

        // Send the email notification
        $this->notify(new LockedAccountTooManyAttemptsNotification($url));
    }
}
