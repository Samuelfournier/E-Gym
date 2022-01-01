<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\TypeVisibility;
use App\Models\TypePublication;
use App\Models\UserPublication;
use Illuminate\Support\Facades\DB;
use App\SqlViews\CardMyContentList;
use App\SqlViews\CardArticlesAndTrainingPrograms;

class ContentController extends Controller
{
    // Retourne tous le contenu, type, categories, visibilité, sports et position
    public function getAllContent(){

        $plan = CardArticlesAndTrainingPrograms::select("*")
        ->orderBy('created_at', 'desc')
        ->get()
        ->toArray();

        return 
        [
            "content" => $plan,
            "type" => $this->getAllContentType(),
            "categories" => $this->getAllCategories(),
            "visibility" => $this->getAllVisibilityType(),
            "sports" => $this->getAllSportAndCategorie(),
        ];
    }

    public function getAllContentType() {
        $type = TypePublication::select('id','name')->get();
        return $type;
    }

    public function getAllVisibilityType(){
        $type = TypeVisibility::select('id','name')->get();
        return $type;
    }

    public function getAllCategories(){
        $categorie = Category::select('id','name')->get();
        return $categorie;
    }

    public function getAllSportAndCategorie(){
        $results = Activity::with('Positions')->get();
        return $results;
    }

    // Retourne le contenu qu'un utilisateur à aimé
    public function getMyContent(Request $request){

        $content = CardMyContentList::select("*")
        ->where('user_id', '=', $request->user_id)
        ->orderBy('created_at', 'desc')
        ->get()
        ->toArray();


        // Ajuste le nombres de séancees complété et ajoute le progress au publications
        for ($i = 0; $i < sizeof($content); $i++) {

            if($content[$i]['completed_sequence'] != null && $content[$i]['completed_sequence'] != '' && $content[$i]['type_publication_id'] == 1){

                $sequence = explode(" ",$content[$i]['completed_sequence']);
                $nbOfSequence = sizeof($sequence);
                $content[$i]['completed_sequence'] = $nbOfSequence;

                if($content[$i]['total_sessions'] == $nbOfSequence) {
                    $content[$i] += ['progress' => 'Completed'];
                    $content[$i] += ['progressNumber' => 100 ];
                }
                else {
                    $content[$i] += ['progress' => 'In progress'];
                    $content[$i] += ['progressNumber' => ceil( ($nbOfSequence * 100) / $content[$i]['total_sessions'])];
                }
            }

            if( $content[$i]['type_publication_id'] == 1 ) {
                $content[$i] += ['progress' => 'Not started'];
                $content[$i] += ['progressNumber' =>  0];
            }

        }

        return $content;
    }

    /**
     * @param int id of content (article or training program)
     */
    public function getAuthorId($id) {
        $response['success'] = false;
        $publication = UserPublication::where('publication_id', $id)
        ->where('type_subscription_id', 2)
        ->first();

        if ($publication != null) {
            $response['id'] = $publication['user_id'];
            $response['success'] = true;
        }

        return $response;
    }
}


