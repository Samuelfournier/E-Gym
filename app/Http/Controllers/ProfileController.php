<?php

namespace App\Http\Controllers;


use App\Models\User;
use App\Models\Country;
use App\models\Activity;
use App\Models\Category;
use App\Models\Position;
use App\Models\Province;
use App\SqlViews\UserInfo;
use App\Models\UserPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\PaymentController;


/**
 * This controller is used to manipulate the user profile.
 */
class ProfileController extends Controller
{
      /**
     * completeProfil
     * This function all required information to display in the interface.
     * @return void
     */
    public function completeProfil()
    {
        // Fetch all data
        $data['categories'] = Category::all()->pluck('name', 'id');
        $countries = Country::all();
        $provinces = Province::all();
        $activities = Activity::all();
        $positions = Position::all();

        //dd($activities, $positions);
        foreach($countries as $country)
        {

            $data['countries'][$country->id] = array(
                    'name' => $country->name,
                    'provinces' => array()
            );

            foreach($provinces as $province)
            {

                if($province->country_id === $country->id)
                    $data['countries'][$country->id]['provinces'][$province->id] = array(
                        'name' => $province->name
                    );

            }
        }

        // Build the json array to return
        foreach($activities as $activity)
        {

            $data['activities'][$activity->id] = array(
                'name' => $activity->name,
                'positions' => array()
                );

            foreach($positions as $position)
            {
                if($position->activity_id === $activity->id)
                    $data['activities'][$activity->id]['positions'][$position->id] = array(
                        'name' => $position->name,
                    );

            }
        }

        // return the array
        return  response()->json([
            'data' => $data,
        ]);
    }

    /**
     * completeProfile
     * This function will update the User model (its profile) with the data received in the request.
     * This is the second phase of the registering.
     * @param  mixed $request
     * @return void
     */
    public function completeProfilPost(Request $request)
    {

        // Get the user that is currently authenticated.
        $user = auth()->user();

        if($user)
        {

            if($request->filled('birthdate'))
                $user->birthdate = $request['birthdate'];

            if($request->filled('gender'))
                $user->gender = $request['gender'];

            if($request->filled('province'))
                $user->province_id = $request['province'];

            // User profile is now completed.
            $user->profile_completed = true;

            // Save the user instance. With the modifications
            $user->save();

            // This is another table (user_position), need position id and user id
            if($request->filled('positions'))
            {

                foreach($request['positions'] as $position_id)
                {
                    UserPosition::create([
                        'user_id' => $user->id,
                        'position_id' => $position_id
                    ]);
                }

            }
            // Returns a message
               return response()->json([
                'success' => true,
                'message'=>'Profil mis à jour avec succès!'
            ]);

        }

        // Error message if the user has not been found.
        return response()->json([
            'success' => false,
            'message'=>'Une erreur lors de la mise à jour du profile est survenue.'
        ]);

    }


    public function getUserPreference(Request $request){
        $results = DB::table('user_positions')
        ->select('position_id')
        ->where('user_id',$request['id'])
        ->get();
        return $results;
    }


    public function modifyPreferenceInfo(Request $request) {

        $user =  UserInfo::select("*")
        ->where('id', '=', $request['id'])
        ->get()
        ->toArray();

        $countryWithProvince = Country::with('provinces')->get();
        $sport = Activity::with('Positions')->get();

        $squareInfo = null;

        if($user[0]['id_client_square'] != null) {
            $squareInfoTemp = (new PaymentController)->getUserSquareInfo($user[0]['id_client_square']);
            $endOfSubscription = (new PaymentController)->getSquareSubscriptionEndDate($user[0]['id_subscription_square']);
            $path = $squareInfoTemp->getCustomer()->getCards()[0];
            $squareInfo = [
                'brand' => strtolower($path->getcardBrand()),
                'last4' => $path->getlast4(),
                'exp' => str_pad($path->getexpMonth(), 2, '0', STR_PAD_LEFT) . '/' . $path->getexpYear() ,
                'endOfSubscription' => $endOfSubscription ,
            ];
        }



        return
        [
            "userInfo" => $user[0],
            "locationInfo" => $countryWithProvince,
            "square" => $squareInfo,
            "sports" => $sport,
        ];

    }


    public function unSubscribeUser(Request $request){

        $user = User::findOrFail($request->id);

        // unSubscribe
        (new PaymentController)->unSubscribe($user->id_subscription_square);

    }


    public function updateProfil(Request $request){

        $validator = Validator::make($request->all(),[
            'id' => 'required', //user_id
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'gender' => 'required|string',
            'prov' => 'required',
            'email' => 'required|string',
        ]);

        // Return a fail response to the frontend if the validation fails
        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Un des champs du formulaire est incorrecte.',
                'errors' => $validator->errors()
            ]);
        }



        $user = User::withTrashed()->where('id',$request->id)->get()->first();

        $user->firstname = $request->firstname;
        $user->lastname = $request->lastname;
        $user->gender = $request->gender;
        $user->birthdate = $request->birthdate;
        $user->province_id = intval($request->prov);


        UserPosition::where('user_id', $user->id)->delete();
        if($request->positions != ''){

            $positions = explode(",", $request->positions);

            foreach($positions as $position)
            {
                UserPosition::create([
                    'user_id' => $user->id,
                    'position_id' => $position
                ]);
            }
        }



        if($user->role_id == 3 || $user->role_id == 2) {

            $secondValidator = Validator::make($request->all(),[
                'title' => 'required|string', //user_id
                'description' => 'required|string',
            ]);

            // Return a fail response to the frontend if the validation fails
            if($secondValidator->fails())
            {
                return response()->json([
                    'success' => false,
                    'message' => 'Un des champs du formulaire est incorrecte.',
                    'errors' => $validator->errors()
                ]);
            }


            $user->title = $request->title;
            $user->description = $request->description;


            $user->facebook_link = $request->facebook_link;
            $user->instagram_link = $request->instagram_link;
            $user->linkedin_link = $request->linkedin_link;

            if(!is_null($request->media) && $request->media != 'undefined') {

                $thirdValidator = Validator::make($request->all(),[
                    'media' => 'image|mimes:jpeg,png,jpg,gif,svg',
                ]);

                // Return a fail response to the frontend if the validation fails
                if($thirdValidator->fails())
                {
                    return response()->json([
                        'success' => false,
                        'message' => 'Un des champs du formulaire est incorrecte.',
                        'errors' => $validator->errors()
                    ]);
                }

                $path = $request->media->store('public/uploads/' . 1); // store file
                $search = 'public/';
                $to_replace = '/storage/';
                $pathToStore = \Illuminate\Support\Str::replaceFirst($search, $to_replace, $path);
                $user->media = $pathToStore;
            }
        }


        if($request->current_user_role_id == 2){

            $user->email = $request->email;

            if($request->status == 'true')
            {

                $user->deleted_at = null;

                if($user->role_id == 3){
                    $user->payment_accepted = 1;
                    $user->user_status_id = 1;
                }

                else if ($user->role_id == 1){
                    $user->payment_accepted = 0;
                    $user->user_status_id = 2;
                }

            }
            else if($request->status == 'false')
            {

                $user->user_status_id = 3;
                $user->deleted_at = date("Y-m-d");

                if($user->role_id == 1){
                    if($user->id_client_square != null || $user->id_client_square != ''){
                        (new PaymentController)->cancelSubscriptionSquare($user->id_subscription_square, date("Y-m-d"));
                    }
                }

            }
        }

        $user->save();


        return response()->json([
            'success' => true,
            'message' => 'Profil modifé',
            "newMedia" => $user->media
        ]);
    }



}
