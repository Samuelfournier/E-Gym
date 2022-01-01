<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\SqlViews\CardArticlesAndTrainingPrograms;

class ProfessionnalController extends Controller
{

    /**
     * show
     * This function send all information about a single Professionnal.
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function show(Request $request, $id)
    {
        $professionnal = User::find($id);
        $plans = CardArticlesAndTrainingPrograms::where('id_author', '=', $id)->where('type_id', '=', 1)->get();
        $articles = CardArticlesAndTrainingPrograms::where('id_author', '=', $id)->where('type_id', '=', 2)->get();

        return response()->json([
            'professionnal' => $professionnal,
            'plans' => $plans,
            'articles' => $articles,
        ]);
    }
    public function registerSpecialist(Request $request)
    {
// get user if already exist
        $user = User::where('email', '=', $request->get('email'))->first();
// If exist profil update
        if($user){
            $response =$this->editUserAsSpecialist($request,$user);
        return $response;
        }
// If the validation of fields fail,
        elseif($this->specialistValidator($request->all())->fails()) {
            // Returns the same response as if the validator hasn't fail. for security measure.
            // But an email will be sent to notified the user that someone tried to register with their email.

            // find user in db
            $user = User::where('email', '=', $request->get('email'))->first();
           // $user->sendAttemptToRegisterWithExistingEmailNotification();
            return response()->json([
                'message' => 'Un courriel vous a été envoyé',
            ], 201);
    }
// Create user as specialist
        $user = $this->createSpecialist($request);
//Create path to save new specialist media files
        $this->createMediaDir($request,$user);

// if the specialist is registered
        if ($response = $this->specialistRegistered($user)) {
            return $response;
        }

        // Return error message
        return response()->json([
            'message' => 'Inscription échoué.',
            ], 500);
    }
    /**
     * Get a validator for an incoming specialist registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function specialistValidator(array $data)
    {
        return Validator::make($data, [
            'firstname'=> 'required|string',
            'lastname' => 'required|string',
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        ]);
    }
     /**
     * Create a new specialist instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function createSpecialist($data)
    {
        return User::create([
            'firstname' => $data['firstname'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']), // encryption of password.
            'lastname' => $data['lastname'],
            'title' => $data['title'],
            'gender' => $data['gender'],
            'description' => $data['description'],
            'facebook_link' => $data['facebook'],
            'instagram_link' => $data['instagram'],
            'linkedin_link' => $data['linkedin'],
            'payment_accepted' => true,
            'profile_completed' => true,
            'role_id' => 3,
            'user_status_id' => 2, // to be active the specialist has to change his password before first login
            'province_id' => $data['province'],
        ]);
    }
protected function createMediaDir($data,$user){

    if($data['media'] != 'undefined'){
        $path = $data['media']->store('public/uploads/'. $user->id);
        $search = 'public/';
        $to_replace ='/storage/';
        $pathToStore =\Illuminate\Support\Str::replaceFirst($search, $to_replace, $path);
    }
    else{
        $pathToStore=null;
    }

    // This array_filter is to filter out empty results, shouldn't have empty input field or null value
    $update_data=array_filter([
        'media'=> $pathToStore,
    ]);

    if(!empty($update_data)){
        $update_status = User::where('email', '=',$data['email'])->update($update_data);
    }else{
        $update_status=false;
    }
    if(!$update_status){
        // Return error message
        return response()->json([
            'message' => 'Média de l\'utilisateur non enregistré .',
        ], 500);
    }
}
    protected function editUserAsSpecialist($data,$user){
        if($data['media'] != 'undefined'){
            $path = $data['media']->store('public/uploads/'. $user->id);
            $search = 'public/';
            $to_replace ='/storage/';
            $pathToStore =\Illuminate\Support\Str::replaceFirst($search, $to_replace, $path);
        }
        else{
            $pathToStore=null;
        }
        // This array_filter is to filter out empty results, shouldn't have empty input field or null value
        $update_data=array_filter([
            'title' => $data['title'],
            'description' => $data['description'],
            'gender' => $data['gender'],
            'facebook_link' => $data['facebook'],
            'instagram_link' => $data['instagram'],
            'linkedin_link' => $data['linkedin'],
            'media'=> $pathToStore,
            'province_id' => $data['province'],
            'payment_accepted' => true,
            'profile_completed' => true,
            'role_id' => 3,//specialist
        ]);

        if(!empty($update_data)){
            $update_status = User::where('email', '=',$data['email'])->update($update_data);
        }else{
            $update_status=false;
        }
// redirect à confirmer
        if(!$update_status){
           // Return error message
            return response()->json([
                'message' => 'Inscription échoué.',
                ], 500);
        }
        // if the user is registered
        return  response()->json([
            'message' => 'Le compte utilisateur a été changé pour un compte spécialiste.',
    ], 201);
    }

    public function manuallyGenerateToken($id){
        $user = User::find($id); // fetch a user. by id or by email etc.
        $token = app(\Illuminate\Auth\Passwords\PasswordBroker::class)->createToken($user); // create token in password_resets
        return $token; // return the token
    }
    /**
     * The specialist has been registered.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function specialistRegistered($user)
    {
        $token=$this->manuallyGenerateToken($user->id);
        $date = date('Y-m-d H:i:s');
        $user->email_verified_at =  $date;
        $user->save();
        // send notification email
        $user->sendSpecialistPasswordNotification($token);

        // Return message
        return  response()->json([
                        'message' => 'Un courriel a été envoyé au nouvel utilisateur.',
                ], 201);
    }

}
