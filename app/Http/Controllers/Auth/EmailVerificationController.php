<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;

class EmailVerificationController extends Controller
{
    /**
     * sendVerificationEmail
     * This function send the email to the user for validating its email.
     * @param  mixed $request
     * @return void
     */
    public function sendVerificationEmail(Request $request)
    {
        // If the user has already a verified email...
        if($request->user()->hasVerifiedEmail()){
            return response()->json([
                'message' => 'Ce courriel a déjà été vérifié.'
            ]);
        }

        // Send the notification email to the user.
        $request->user()->SendEmailVerificationNotification();

        // Return the success message of the action
        return response()->json([
            'message' => 'Le courriel à été envoyé.'
        ]);
    }

    /**
     * verify
     * This function update the user email_verified_at column in the database.
     * @param  mixed $request
     * @return void
     */
    public function verify(Request $request)
    {

        $user = User::findOrFail($request->id);

        // Check if the user has already verified its email.
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Courriel déjà vérifié.'
            ]);
        }

        // Update the email_verified_at column of the user.
        if($user->markEmailAsVerified())
        {
            event(new Verified($user));
            $url = env('APP_URL').'/connexion';
            return redirect($url);
        }
        else
        {
            // return error message.
            return response()->json([
                'message'=>'Échec de la vérification du compte.'
            ]);
        }
    }
}
