<?php

namespace App\Http\Controllers;

use App\Models\Exercice;
use Illuminate\Http\Request;
use App\Models\EquipmentExercice;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class ExerciceController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function createExercice(Request $request)
    {
        $user = $request->user();
               // Validation of form
            $validator = Validator::make($request->all(),[
                'name' => 'required', //user_id
                'description' => 'required|string',
                'media' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
            ]);
            // Return a fail response to the frontend if the validation fails
            if($validator->fails())
            {
                return response()->json([
                    'success' => false,
                   // 'message' => 'Un des champs du formulaire est incorrecte. Vérifier que le média soit de type image.',
                    'errors' => $validator->errors()
                ]);
            }

        $user = auth()->user();


        $exercice = new Exercice;

        $exercice->name = $request->name;
        $exercice->description=$request->description;
        $exercice->user_id = $user->id;

        $exercice->user_id=$user->id;

        if($request->media != 'undefined'){
            $path = $request->media->store('public/uploads/'. $user->id);
            $search = 'public/';
            $to_replace ='/storage/';
            $pathToStore =\Illuminate\Support\Str::replaceFirst($search, $to_replace, $path);
            $exercice->media = $pathToStore;
        }

        $exercice->save();

        
        if($request->equipement != null || $request->equipement != '') {
            $today = date('Y-m-d');
            $equipementId = explode(",",$request->equipement);

            for($i = 0; $i < sizeof($equipementId); $i++) {
                EquipmentExercice::create([
                    'equipment_id' => intval($equipementId[$i]),
                    'exercice_id' => $exercice->id,
                    'created_at' => $today,
                    'updated_at' => $today,
                ]);
            }
        }

        return response()->json([
            'id' => $exercice->id,
            'success' => true,
            'message'=>'Exercice créé avec succès!',
            'NewExerciceList'=> $this->getAllMyExercices(),
        ],201);
    }

    /**
     * Display resources list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function allExercices(Request $request)
    {
        $user = auth()->user();

        $result = DB::table('exercices_with_equipements')
                    ->select('*')
                    ->where('user_id', '=', $user->id)
                    ->get();

        $data = json_decode($result, true);

        $exercices = [];
        $equipments = [];
        $equipment = [];
        $exercice = [];
        $firstIteration = true;

        foreach ($data as $row) {
            if ($firstIteration) {
                $firstIteration = false;
                $exercice['id'] = $row['id'];
                $exercice['name'] = $row['name'];
                $exercice['media'] = $row['media'];
                $exercice['description'] = $row['description'];
                $exercice['user_id'] = $row['user_id'];

                if ($row['equipment_id'] != null) {
                    $equipment['id'] = $row['equipment_id'];
                    $equipment['name'] = $row['equipment_name'];
                    $equipment['description'] = $row['equipment_description'];
                    array_push($equipments, $equipment);
                }
            }
            else if ($exercice['id'] != $row['id'])
            {
                $exercice['equipments'] = $equipments;
                array_push($exercices, $exercice);
                $exercice = [];
                $equipments = [];
                $exercice['id'] = $row['id'];
                $exercice['name'] = $row['name'];
                $exercice['media'] = $row['media'];
                $exercice['description'] = $row['description'];
                $exercice['user_id'] = $row['user_id'];

                if ($row['equipment_id'] != null) {
                    $equipment['id'] = $row['equipment_id'];
                    $equipment['name'] = $row['equipment_name'];
                    $equipment['description'] = $row['equipment_description'];
                    array_push($equipments, $equipment);
                }
            } else {
                if ($row['equipment_id'] != null) {
                    $equipment = [];
                    $equipment['id'] = $row['equipment_id'];
                    $equipment['name'] = $row['equipment_name'];
                    $equipment['description'] = $row['equipment_description'];
                    array_push($equipments, $equipment);
                }
            }
        }

        $exercice['equipments'] = $equipments;
        array_push($exercices, $exercice);

        return  response()->json([
            'data' => $exercices,
        ]);
    }


    public function getAllMyExercices() {

        $user = auth()->user();
        $fetchExercices = Exercice::where('user_id', '=', $user->id)->get();

        for($i = 0; $i < sizeof($fetchExercices); $i++){
            $fetchExercices[$i]->action = [];
        }

        return $fetchExercices;
    }


    public function getEquipmentForAnExercice(Request $request) {

        $fetchEquipments = DB::table('exercices_with_equipements')
        ->select(['equipment_name', 'equipment_id'])
        ->where('id', '=', $request->id)
        ->get();


        $equipement = [];


        if($fetchEquipments[0]->equipment_name == null) return $equipement;


        foreach($fetchEquipments as $fetchEquipment) {
            $equipement[] = array(
                'value' => $fetchEquipment->equipment_id,
                'label'=>$fetchEquipment->equipment_name,
            );
        }

        return $equipement;

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getExercice($id, $controllerCall = false)
    {
        $result = DB::table('exercices_with_equipements')
                    ->select('*')
                    ->where('id', '=', $id)
                    ->get();

        $data = json_decode($result, true);

        $exercices = [];
        $equipments = [];
        $equipment = [];
        $exercice = [];
        $firstIteration = true;

        foreach ($data as $row) {
            if ($firstIteration) {
                $firstIteration = false;
                $exercice['id'] = $row['id'];
                $exercice['name'] = $row['name'];
                $exercice['media'] = $row['media'];
                $exercice['description'] = $row['description'];
                $exercice['user_id'] = $row['user_id'];

                if ($row['equipment_id'] != null) {
                    $equipment['id'] = $row['equipment_id'];
                    $equipment['name'] = $row['equipment_name'];
                    $equipment['description'] = $row['equipment_description'];
                    array_push($equipments, $equipment);
                }
            } else {
                if ($row['equipment_id'] != null) {
                    $equipment = [];
                    $equipment['id'] = $row['equipment_id'];
                    $equipment['name'] = $row['equipment_name'];
                    $equipment['description'] = $row['equipment_description'];
                    array_push($equipments, $equipment);
                }
            }
        }

        $exercice['equipments'] = $equipments;

        if ($controllerCall)
            return $exercice;
        else
            return  response()->json([
                'data' => $exercice,
            ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editExercice(Request $request)
    {
        $user = auth()->user();
        $exer_id = $request->id;


            // Validation of form
        $validator = Validator::make($request->all(),[
            'name' => 'required', //user_id
            'description' => 'required|string',
        ]);
        // Return a fail response to the frontend if the validation fails
        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Un des champs du formulaire est incorrecte. Vérifier que le média soit de type image.',
                'errors' => $validator->errors()
            ]);
        }

        $currentExercice = Exercice::find($request->id);

        $currentExercice->name = $request->name;
        $currentExercice->description = $request->description;


        if($request->equipement != null || $request->equipement != '') {
            EquipmentExercice::where('exercice_id',$currentExercice->id)->delete();
            $today = date('Y-m-d');
            $equipementId = explode(",",$request->equipement);

            for($i = 0; $i < sizeof($equipementId); $i++) {
                EquipmentExercice::create([
                    'equipment_id' => intval($equipementId[$i]),
                    'exercice_id' => $currentExercice->id,
                    'created_at' => $today,
                    'updated_at' => $today,
                ]);
            }
        }else {
            EquipmentExercice::where('exercice_id',$currentExercice->id)->delete();
        }


        if($request->media != 'undefined'){

            $validator2 = Validator::make($request->all(),[
                'media' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
            ]);
            // Return a fail response to the frontend if the validation fails
            if($validator2->fails())
            {
                return response()->json([
                    'success' => false,
                    'message' => 'Vérifier que le média soit de type image.',
                ]);
            }

            $path = $request->media->store('public/uploads/'. $user->id);
            $search = 'public/';
            $to_replace ='/storage/';
            $pathToStore =\Illuminate\Support\Str::replaceFirst($search, $to_replace, $path);


            $currentExercice->media = $pathToStore;
        }

        $currentExercice->save();
        return response()->json([
            'success' => true,
            'NewExerciceList'=> $this->getAllMyExercices(),
            'currentExercice'=> $currentExercice,
        ]);

    }


// todo redirect et message
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteExercice(Request $request)
    {
        $exerciceStatus=Exercice::where('id','=',$request->id)->delete();
    }
}
