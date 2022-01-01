<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\ValidationException;

class ApiPasswordResetController extends Controller
{
    /**
     * forgotPassword
     * This function will send the password reset link,
     * @param  mixed $request
     * @return void
     */
    public function forgotPassword(Request $request)
    {

        // Validate that the email field is present and is an email.
        $request->validate([
            'email' => 'required|email',
        ]);

        // Send reset link to the email.
        $status = Password::sendResetLink($request->only('email'));

        // Send success status
        if($status == Password::RESET_LINK_SENT)
        {
            return response()->json([
                'message' =>trans($status)
            ]);
        }
        // Send the failed status
        throw ValidationException::withMessages([
            'email' => trans($status)
        ]);
    }
/**
     * forgotPassword
     * This function will send the password reset link,
     * @param  mixed $request
     * @return void
     */


    /**
     * reset
     * This function reset a user's password.
     * @param  mixed $request
     * @return void
     */
    public function reset(Request $request)
    {
        // Validate form fields
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Reset password using only what is necessary in the the request.
        $status = Password::reset($request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {

                // update user
                $user->forceFill([
                    'password' => Hash::make($request->password),
                ])->save();

                // Delete the token in password_reset.
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        // If password reset is a success
        if($status == Password::PASSWORD_RESET)
        {
            return response()->json([
                'message' => 'Mot de passe réinitialisé avec succès.'
            ]);
        }

        // If password reset has failed
        return response([
            'message' => trans($status)
        ], 500);
    }

    /**
     * updateUserPassword
     * This function update a user's password.
     * @param  mixed $request
     * @return void
     */
    public function updateUserPassword(Request $request)
    {
        $user = User::where('email', '=', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();
        event(new PasswordReset($user));
    }
}





