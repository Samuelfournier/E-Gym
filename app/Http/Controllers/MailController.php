<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    // Function that test the email sender. There is multiple ways to send mail. (raw content, view ...)
    // ref: https://laravel.com/docs/8.x/mail#sending-mail
    // We could also use a notification. (see app/notification and app/model/user to see how i did with the ResetPasswordNotification.)
    public function test(Request $request)
    {
        $email = 'hebert.francois.charles@gmail.com'; // Auth::client()
        $content = 'This is a test email.';

        Mail::raw($content, function ($m) use ($email){
        $m->to($email)->subject('Email Subject');
        });
    }
}
