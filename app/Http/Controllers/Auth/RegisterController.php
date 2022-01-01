<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

   // use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = "/connexion";//RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'firstname'=> 'required|string',
            'lastname' => 'required|string',
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)
                                                            ->mixedCase()
                                                            ->letters()
                                                            ->numbers()
                                                            ->symbols()],
        ]);
    }


    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        return User::create([
            'firstname' => $data['firstname'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']), // encryption of password.
            'lastname' => $data['lastname'],
            'title' => '',
            'media' => '',
            'description' => '',
            'payment_accepted' => false,
            'profile_completed' => false,
            'role_id' => 1,
            'user_status_id' => 1,
            'province_id' => 1,
        ]);
    }

    /**
     * Show the application registration form.
     *
     * @return \Illuminate\View\View
     */
    public function showRegistrationForm()
    {
        return redirect('/inscription');
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // If the validation of fields fail,
        if($this->validator($request->all())->fails())
        {
            // Returns the same response as if the validator hasn't fail. for security measure.
            // But an email will be sent to notified the user that someone tried to register with their email.

            // find user in db
            $user = User::where('email', '=', $request->get('email'))->first();
            $user->sendAttemptToRegisterWithExistingEmailNotification();

            return response()->json([
                'message' => 'Un courriel vous a été envoyé',
            ], 201);
        }

        // Create user
        $user = $this->create($request->all());

        // Log in user
        //$this->guard()->login($user);

        // if the user is registered
        if ($response = $this->registered($request, $user)) {
            return $response;
        }

        // Return error message
        return response()->json([
            'message' => 'Inscription échoué.',
            ], 500);
    }
  /**
     * Handle a specialist registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */

    /**
     * Get the guard to be used during registration.
     *
     * @return \Illuminate\Contracts\Auth\StatefulGuard
     */
    protected function guard()
    {
        return Auth::guard();
    }

    /**
     * The user has been registered.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function registered(Request $request, $user)
    {
        // send notification email
        $user->SendEmailVerificationNotification();

        // Return message
        return  response()->json([
                        'message' => 'Un courriel vous a été envoyé.',
                ], 201);
    }


}
