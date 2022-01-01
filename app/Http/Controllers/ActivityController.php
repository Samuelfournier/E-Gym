<?php

namespace App\Http\Controllers;



use App\models\Activity;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


/**
 * This controller is used to manipulate sports
 */
class ActivityController extends Controller
{

    // Méthodes qui retourne tous les activities
    public function getAllActivities(){

        $fetchActivities = Activity::with('Positions')->get();

        for($i = 0; $i < sizeof($fetchActivities); $i++){
            $fetchActivities[$i]->action = [];

        }

        return $fetchActivities;

    }

    public function createActivity(Request $request) {
        
      $validator = Validator::make($request->all(),[
        'name' => 'required|string',
        'description' => 'required|string',
        'positions' => 'required',
    ]);

        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Un des champs du formulaire est incorrecte.',
                'errors' => $validator->errors()
            ]);
        }

        $today = date('Y-m-d');

        $newActivity = Activity::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_at' => $today,
            'updated_at' => $today,
        ]);


        foreach($request['positions'] as $positionName)
        {
            Position::create([
                'name' => $positionName,
                'activity_id' => $newActivity->id,
                'created_at' => $today,
                'updated_at' => $today,
            ]);
        }


        return response()->json([
            'success' => true,
            'newActivities' => $this->getAllActivities(),
        ]);

    }


    public function updateActivity(Request $request){


        $validator = Validator::make($request->activity,[
            'name' => 'required|string',
            'description' => 'required|string',
        ]);
    
        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Un des champs du formulaire est incorrecte.',
                'errors' => $validator->errors()
            ]);
        }

        $currentActivity = Activity::find($request->activity['id']);

        $currentActivity->name = $request->activity['name'];
        $currentActivity->description = $request->activity['description'];

        $currentActivity->save();

        foreach($request->activity['positions'] as $position) {

            if($position['name'] == '' || $position['name'] == null){
                return response()->json([
                    'success' => false,
                    'message' => 'Un des champs du formulaire est incorrecte.',
                ]);
            }

            $currentPosition = Position::find($position['id']);
            $currentPosition->name = $position['name'];
            $currentPosition->save();

        }
        


        $today = date('Y-m-d');

        foreach($request['newPositions'] as $positionName)
        {
            Position::create([
                'name' => $positionName,
                'activity_id' => $currentActivity->id,
                'created_at' => $today,
                'updated_at' => $today,
            ]);
        }
        
        return response()->json([
            'success' => true,
            'newActivities' => $this->getAllActivities(),
        ]);

    }
}