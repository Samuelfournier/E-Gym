<?php

namespace App\Http\Controllers;



use App\models\Activity;
use App\Models\Position;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


/**
 * This controller is used to manipulate sports
 */
class EquipementController extends Controller
{
        // Méthodes qui retourne tous les activities
        public function getAllEquipments(){

            $user = auth()->user();

            // $fetchEquipments = Equipment::where('user_id',10)->get();
            $fetchEquipments = Equipment::where('user_id',$user->id)->get();

            for($i = 0; $i < sizeof($fetchEquipments); $i++){
                $fetchEquipments[$i]->action = [];

            }

            return $fetchEquipments;

        }


        public function getEquipementForDropdown(){
            $user = auth()->user();

            //$fetchEquipments = Equipment::where('user_id',10)->get();
            $fetchEquipments = Equipment::where('user_id','=',$user->id)->get();

            $equipement = [];

            foreach($fetchEquipments as $fetchEquipment) {
                $equipement[] = array(
                    'value' => $fetchEquipment->id,
                    'label'=>$fetchEquipment->name,
                );
            }


            return $equipement;
        }


        public function addEquipment(Request $request){

            $validator = Validator::make($request->all(),[
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

            $today = date('Y-m-d');

            $user = auth()->user();
            Equipment::create([
                'name' => $request->name,
                'description' => $request->description,
                'created_at' => $today,
                'updated_at' => $today,
                'user_id' =>  $user->id,
            ]);

            return response()->json([
                'success' => true,
                'NewEquipements' => $this->getAllEquipments(),
            ]);

        }



        public function editEquipment(Request $request){

            $validator = Validator::make($request->all(),[
                'id' => 'required',
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
            $today = date('Y-m-d');
            $currentEquipment = Equipment::find($request->id);

            $currentEquipment->name = $request->name;
            $currentEquipment->description = $request->description;
            $currentEquipment->updated_at = $today;

            $currentEquipment->save();

            return response()->json([
                'success' => true,
                'NewEquipements' => $this->getAllEquipments(),
            ]);

        }
}
