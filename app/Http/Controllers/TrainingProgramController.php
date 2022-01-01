<?php

namespace App\Http\Controllers;

use App\Models\Week;
use App\Models\Session;
use App\Models\Training;
use App\Models\Publication;
use \Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\SessionTraining;
use App\Models\TypePublication;
use App\Models\UserPublication;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\ExerciceController;

class TrainingProgramController extends Controller
{
    /**
     * Return all the training programs.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    /**
     * return the specified training program and all the informations related.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function read($id) {
        $user = auth()->user();
        $trainingProgram = [];
        $trainingProgam['success'] = false;

        $result = DB::table('detailed_training_programs')
            ->select('*')
            ->where('id', '=', $id)
            ->get();

        $data = json_decode($result, true);

        $firstIteration = true;

        //variables to keep track of previous value
        $weekNumber = "";
        $sessionNumber = "";

        //object to push in respective array of the training program
        $week = [];
        $weeks = [];
        $session = [];
        $sessions = [];
        $trainings = [];
        $isLiked = false;

        $exerciceController = new ExerciceController;

        foreach ($data as $row) {
            $training = [];
            if ($firstIteration) {
                $trainingProgram['id'] = $row['id'];
                $trainingProgram['title'] = $row['title'];
                $trainingProgram['content'] = $row['content'];
                $tags = str_replace(' ', ',', $row['tags']);
                $trainingProgram['tags'] = $tags;
                $trainingProgram['overview'] = $row['overview'];
                $trainingProgram['media'] = $row['media'];
                $trainingProgram['categorie_id'] = $row['categorie_id'];
                $trainingProgram['position_id'] = $row['position_id'];
                $trainingProgram['activite_id'] = $row['activite_id'];
                $trainingProgram['author_id'] = $row['author_id'];
                $week['description'] = $row['week_description'];
                $week['order'] = $weekNumber = $row['no_week'];
                $week['id'] = $row['week_id'];
                $session['order'] = $sessionNumber = $row['no_session'];
                $session['id'] = $row['session_id'];

                if ($user->id == $row['author_id']) {
                    $isLiked = false;
                } else {

                    $userPublication = UserPublication::withTrashed()
                    ->where('user_id', '=', $user->id)
                    ->where('publication_id', '=', $row['id'])
                    ->where('type_subscription_id', '=', 1)
                    ->first();

                    if (is_null($userPublication) || $userPublication->trashed()) {
                        $isLiked = false;
                    } else  {
                        $trainingProgram['completed_sessions'] = $userPublication->completed_sequence;
                        $trainingProgram['has_changed'] = $userPublication->has_changed;
                        $isLiked = true;
                    }

                }

                $trainingProgram['liked'] = $isLiked;
                $firstIteration = false;
            }

            //if session is in the same week as the latest week number that occured
            if ($row['no_week'] != $weekNumber) {
                $session['trainings'] = $trainings;
                array_push($sessions, $session);

                $week['sessions'] = $sessions;
                array_push($weeks, $week);

                $trainings = [];
                $sessions = [];
                $session = [];
                $session['order'] = $sessionNumber = $row['no_session'];
                $session['id'] = $row['session_id'];

                $week = [];
                $week['description'] = $row['week_description'];
                $week['order'] = $weekNumber = $row['no_week'];
                $week['id'] = $row['week_id'];
            } else if ($row['no_session'] != $sessionNumber) {
                $session['trainings'] = $trainings;
                array_push($sessions, $session);
                $trainings = [];
                $session = [];
                $session['order'] = $sessionNumber = $row['no_session'];
                $session['id'] = $row['session_id'];
            }

            if ($row['training_id'] != null) {
                $training['id'] = $row['training_id'];
                $training['order'] = $row['order'];
                $training['duration'] = $row['duration'];
                $training['tempo'] = $row['tempo'];
                $training['nb_serie'] = $row['nb_serie'];
                $training['nb_repetition'] = $row['nb_repetition'];
                $training['resting_time'] = $row['resting_time'];
                $training['exercice_id'] = $row['exercice_id'];

                $exercice = $exerciceController->getExercice($training['exercice_id'], true);
                $training['name'] = $exercice['name'];
                $training['media'] = $exercice['media'];
                $training['description'] = $exercice['description'];
                $training['equipments'] = $exercice['equipments'];

                array_push($trainings, $training);
            }
        }

        //add last exercices and sessions for the training program
        $session['trainings'] = $trainings;
        array_push($sessions, $session);

        $week['sessions'] = $sessions;
        array_push($weeks, $week);

        $trainingProgram['weeks'] = $weeks;
        $trainingProgam['success'] = true;

        return $trainingProgram;
    }
    /**
     * create and store the training program in the Database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {


        $userId = $request->user_id;
        $timeTotal = null;
        $secs = null;
        $response['success'] = false;

        $publication = Publication::create([
            'title' => $request->title,
            'overview' => $request->overview,
            'category_id' => $request->category_id,
            'position_id' => $request->position_id,
            'type_publication_id' => 1, //1 = training program
            'content' => $request->content,
            'type_visibility_id' => 2 // visibility => private
        ]);

        if (isset($request->tags)) {
            $tags = str_replace(",", " ", $request->tags);
            $publication->tags = $tags;
            $publication->save();
        }

        //store media and media_card files and save path to files
        $path = $request->media->store('public/uploads/' . $userId);
        $search = 'public/';
        $to_replace = '/storage/';
        $mediaPath = Str::replaceFirst($search, $to_replace, $path);
        $publication->media = $mediaPath;
        $publication->media_card = $mediaPath;

        $weeks = json_decode($request->weeks);

        //adding all informations related to the weeks/trainings/exercices into the Database
        foreach ($weeks as $weekData) {
            $week = Week::create([
                'no_week' => $weekData->order,
                'description' => $weekData->description,
                'publication_id' => $publication->id
            ]);
            foreach ($weekData->sessions as $sessionData) {
                $session = Session::create([
                    'no_session' => $sessionData->order,
                    'no_week' => $week->no_week,
                    'week_id' => $week->id
                ]);
                foreach ($sessionData->trainings as $trainingData) {
                    $training = Training::create([
                        'duration' => $trainingData->duration,
                        'tempo' => $trainingData->tempo,
                        'nb_serie' => $trainingData->nb_serie,
                        'nb_repetition' => $trainingData->nb_repetition,
                        'resting_time' => $trainingData->resting_time,
                        'exercice_id' => $trainingData->exercice_id,
                        'order' => $trainingData->order
                    ]);

                    $sessionTraining = SessionTraining::create([
                        'session_id' => $session->id,
                        'training_id' => $training->id
                    ]);
                }
            }
        }

        $publication->save();

        $userPublication = UserPublication::create([
            'user_id' => $userId,
            'publication_id' => $publication->id,
            'type_subscription_id' => 2
        ]);
        $userPublication->save();
        $response['success'] = true;
        $response['id'] = $publication->id;

        return $response;
    }

    /**
     * Update the training program in the Database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $publication = Publication::find($id);

        $publication->title = $request->title;

        if (isset($request->tags)) {
            $tags = str_replace(",", " ", $request->tags);
            $publication->tags = $tags;
            $publication->save();
        }

        $publication->content = $request->content;
        $publication->overview = $request->overview;
        $publication->category_id = $request->category_id;
        $publication->position_id = $request->position_id;

        if (!empty($request->media) && !is_string($request->media)) {
            // handle media received
            $path = $request->media->store('public/uploads/' . $user->id); // store file
            $search = 'public/';
            $to_replace = '/storage/';
            $pathToStore = \Illuminate\Support\Str::replaceFirst($search, $to_replace, $path);

            // Update publication media
            $publication->media = $pathToStore;
            $publication->media_card = $pathToStore;
        }

        $publication->save();

        $infoDurationBD = DB::table('info_duration_plan')
        ->select('*')
        ->where('id', '=', $publication->id)
        ->get()->first();


        $weeks = json_decode($request->weeks);

        if (sizeOf($weeks) != $infoDurationBD->nb_of_weeks || sizeOf($weeks[0]->sessions) != $infoDurationBD->nb_of_sessions){
            
            $weeksId = Week::where('publication_id', $id)->get("id")->toArray();
            $sessionsId = Session::whereIn('week_id', $weeksId)->get("id")->toArray();
            $trainingsId = SessionTraining::whereIn('session_id', $sessionsId)->get("training_id")->toArray();
    
            SessionTraining::whereIn('session_id', $sessionsId)->delete();
            Training::whereIn('id', $trainingsId)->delete();
            Session::whereIn('id', $sessionsId)->delete();
            Week::whereIn('id', $weeksId)->delete();
    
    
    
            UserPublication::where("publication_id", $id)
            ->where('type_subscription_id',1)
            ->update([
                'has_changed' => 1,
                'completed_sequence' => null
            ]);


            //adding all informations related to the weeks/trainings/exercices into the Database
            foreach ($weeks as $weekData) {
                $week = Week::create([
                    'no_week' => $weekData->order,
                    'description' => $weekData->description,
                    'publication_id' => $publication->id
                ]);
                foreach ($weekData->sessions as $sessionData) {
                    $session = Session::create([
                        'no_session' => $sessionData->order,
                        'no_week' => $week->no_week,
                        'week_id' => $week->id
                    ]);
                    foreach ($sessionData->trainings as $trainingData) {
                        $training = Training::create([
                            'duration' => $trainingData->duration,
                            'tempo' => $trainingData->tempo,
                            'nb_serie' => $trainingData->nb_serie,
                            'nb_repetition' => $trainingData->nb_repetition,
                            'resting_time' => $trainingData->resting_time,
                            'exercice_id' => $trainingData->exercice_id,
                            'order' => $trainingData->order
                        ]);

                        SessionTraining::create([
                            'session_id' => $session->id,
                            'training_id' => $training->id
                        ]);
                    }
                }
            }
    
        } else {

            $weeksId = Week::where('publication_id', $id)->get("id")->toArray();
            $sessionsId = Session::whereIn('week_id', $weeksId)->get("id")->toArray();
            $trainingsId = SessionTraining::whereIn('session_id', $sessionsId)->get("training_id")->toArray();
    
            SessionTraining::whereIn('session_id', $sessionsId)->delete();
            Training::whereIn('id', $trainingsId)->delete();

            foreach ($weeks as $weekData) {
                $week = Week::find($weekData->id)
                ->update(['description' => $weekData->description]);
                foreach ($weekData->sessions as $sessionData) {
                    foreach ($sessionData->trainings as $trainingData) {

                        $training = Training::create([
                            'duration' => $trainingData->duration,
                            'tempo' => $trainingData->tempo,
                            'nb_serie' => $trainingData->nb_serie,
                            'nb_repetition' => $trainingData->nb_repetition,
                            'resting_time' => $trainingData->resting_time,
                            'exercice_id' => $trainingData->exercice_id,
                            'order' => $trainingData->order
                        ]);

                        SessionTraining::create([
                            'session_id' => $sessionData->id,
                            'training_id' => $training->id
                        ]);
                    }
                }
            }
            
        }

        $response['success'] = true;
        $response['id'] = $publication->id;
        return $response;
    }

    /**
     * Save progress of a user on a certain trainingProgram
     * @param int $id
     */
    public function saveTrainingProgramProgress(Request $request, $id)
    {
        $user = auth()->user();

        $sessionsCompleted = implode(" ", $request->sessions_id);

        $userPublication = UserPublication::where("user_id", $user->id)
            ->where("publication_id", $id)
            ->update(['completed_sequence' => $sessionsCompleted]);
    }

    /**
     * Remove the training program from the Database.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($id)
    {
        $weeksId = Week::where('publication_id', $id)->get("id")->toArray();
        $sessionsId = Session::whereIn('week_id', $weeksId)->get("id")->toArray();
        $trainingsId = SessionTraining::whereIn('session_id', $sessionsId)->get("training_id")->toArray();

        SessionTraining::whereIn('session_id', $sessionsId)->delete();
        Training::whereIn('id', $trainingsId)->delete();
        Session::whereIn('id', $sessionsId)->delete();
        Week::whereIn('id', $weeksId)->delete();
        Publication::where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Suppression du plan d\'entrainement réussi.',
        ]);
    }


    public function seenChanges(Request $request){

        UserPublication::where("publication_id", $request->publication_id)
        ->where('user_id',$request->user_id)
        ->update([
            'has_changed' => null
        ]);
    }
}
