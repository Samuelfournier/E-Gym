<?php

namespace App\Http\Controllers;

use Throwable;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Activity;
use App\Models\Category;
use App\Models\Position;
use App\Exceptions\Handler;
use App\Models\Publication;
use Illuminate\Http\Request;
use App\Models\UserPublication;
use App\Models\DetailedArticleView;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{


    /**
     * getArticle
     * This function returns all the data needed to the SPA for visualizing the article
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function getArticle(Request $request, $id)
    {
        //fetch view
        $article = DetailedArticleView::where('id', '=', $id)->first();


        // send data to frontend
        return response()->json([
            'article' => $article,
        ]);
    }

    /**
     * createArticle
     * Fonction qui renvoit l'information necessaire a la page de creation d'article.
     * @return void
     */
    public function createArticle($id = 0){

        // Fetch data
        $data['categories'] = Category::all()->pluck('name', 'id');
        $authors = User::where('role_id', '>', 1)->get();
        $activities = Activity::all();
        $positions = Position::all();

        foreach($authors as $author)
        {
            $data['authors'][$author->id] = array(
                'name' => $author->firstname . ' ' . $author->lastname,
                'email' => $author->email,
            );
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

        $article = new Publication();
        $article->title = '';
        $article->content = '';
        $article->tags = '';
        $article->overview = '';
        $article->time_total = "00:00";
        $article->media = '';
        $article->media_card = '';
        $article->category_id = 0;
        $article->type_visibility_id = 0;
        $article->position_id = 0;
        $article->type_publication_id = 2;

        $selected_activity_id = 0;
        $author_id = 0;
        if($id > 0) // means article already exist
        {
            // Fetch article with id received
            $articleFetched = Publication::find($id);
            $userPublication = UserPublication::where('publication_id', '=', $articleFetched->id)->first();

            // Make sure only the author has access to article
            if($userPublication->user_id === Auth::user()->id)
            {
                $author_id = $userPublication->user_id;
                $selected_sport = $position->where('id', '=', $articleFetched->position_id)->first();

                $selected_activity_id = $selected_sport->activity_id;
                $article = $articleFetched;
            }

        }

        $data['article'] = $article;
        $data['activity_id'] = $selected_activity_id;
        $data['author_id'] = $author_id;

        // return all fetched data in json format
        return response()->json([
            'data' => $data,
        ]);

    }

    /**
     * createArticlePost
     * Create a publication of type Article.
     * @param  mixed $request
     * @return void
     */
    public function createArticlePost(Request $request, $id = 0)
    {

        // If the id is not 0, it means that the article already exist and we want to edit it.
        if($id > 0)
        {
            $response = $this->editArticlePost($request, $id);
            return $response;
        }

        // Validation of form
        $validator = Validator::make($request->all(),[
            'user_id' => 'required', //user_id
            'visibility' => 'required|integer|min:0|max:2',
            'title' => 'required|string',
            'media' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
            'position' => 'required|integer|min:0',
            'overview' => 'required|string',
            'content' => 'required|string',
            'time_total' => 'required', //represent minutes
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

        // Data
        $user = User::findOrFail($request->get('user_id')); // user instance
        $visibility = $request->get('visibility');
        $title = $request->get('title');
        $position = $request->get('position');
        $category = $request->get('category');
        $overview = $request->get('overview');
        $content = $request->get('content');
        $time_total = $request->get('time_total');
        $tags = '';
        if($request->filled('tags'))
            $tags = $request->get('tags');

        // Handle media path
        $path = $request->media->store('public/uploads/' . $user->id); // store file
        $search = 'public/';
        $to_replace = '/storage/';
        $pathToStore = \Illuminate\Support\Str::replaceFirst($search, $to_replace, $path);

        // Create a publication
        $publication = Publication::create([
            'title' => $title,
            'content' => $content,
            'tags' => $tags,
            'overview' => $overview,
            'time_total' => $time_total,
            'media' => $pathToStore,
            'media_card' => $pathToStore,
            'category_id' => $category,
            'type_visibility_id' => $visibility,
            'position_id' => $position,
            'type_publication_id' => 2, // article
        ]);

        // Associate user with publication
        UserPublication::create([
            'user_id' => $user->id,
            'publication_id' => $publication->id,
            'type_subscription_id' => 2, // createur
        ]);


        // Return success response
        return response()->json([
            'success' => true,
            'message' => "Création de l'article réussi!",
        ], 201);

    }

        /**
     * editArticle
     * This function send existing article to front end in case a user want to edit an article
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function editArticle(Request $request, $id)
    {
        dd($request->all(), $id);
        // Fetch data
        $data['categories'] = Category::all()->pluck('name', 'id');
        $authors = User::where('role_id', '>', 1)->get();
        $activities = Activity::all();
        $positions = Position::all();

        // Build authors array
        foreach($authors as $author)
        {
            $data['authors'][$author->id] = array(
                'name' => $author->firstname . ' ' . $author->lastname,
            );
        }

        // Build activities array
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

        // Create blank article
        $article = new Publication();
        $article->title = '';
        $article->content = '';
        $article->tags = '';
        $article->overview = '';
        $article->time_total = "00:00";
        $article->media = '';
        $article->media_card = '';
        $article->category_id = 0;
        $article->type_visibility_id = 0;
        $article->position_id = 0;
        $article->type_publication_id = 2;

        // needed value to fill form
        $selected_activity_id = 0;
        $author_id = 0;

        // If the publication exist, fetch it
        if($id > 0) // means article already exist
        {
            // Fetch article with id received
            $articleFetched = Publication::find($id);
            dd($articleFetched, $id);
            $userPublication = UserPublication::where('publication_id', '=', $article->id)->get();

            // Make sure only the author has access to article
            if($userPublication->user_id === Auth::user()->id && Auth::user()->role_id > 1)
            {
                $author_id = $userPublication->user_id;
                $selected_sport = $position->where('id', '=', $article->position_id)->get();
                $selected_activity_id = $selected_sport->activity_id;
            }

        }

        $data['article'] = $article;
        $data['activity_id'] = $selected_activity_id;
        $data['author_id'] = $author_id;

        // return all fetched data in json format
        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * editArticle
     * This function send existing article to front end in case a user want to edit an article
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function editArticlePost(Request $request, $id)
    {

        // Validate form
        if($request->filled('media') && $request->media != 'undefined')
        {
            $validator = Validator::make($request->all(),[
                'user_id' => 'required', //user_id
                'visibility' => 'required|integer|min:0|max:2',
                'title' => 'required|string',
                'position' => 'required|integer|min:0',
                'tags' => 'string',
                'overview' => 'required|string',
                'content' => 'required|string',
                'time_total' => 'required', //represent minutes
                'media' => 'image|mimes:jpeg,png,jpg,gif,svg',
            ]);
        }
        else{
            $validator = Validator::make($request->all(),[
                'user_id' => 'required', //user_id
                'visibility' => 'required|integer|min:0|max:2',
                'title' => 'required|string',
                'position' => 'required|integer|min:0',
                'tags' => 'string',
                'overview' => 'required|string',
                'content' => 'required|string',
                'time_total' => 'required', //represent minutes
            ]);
        }

        // Return a fail response to the frontend if the validation fails
        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Un des champs du formulaire est incorrecte.',
                'errors' => $validator->errors()
            ]);
        }

        // Data variables
        $user = User::findOrFail($request->user_id);
        $publication = Publication::find($id);

        if($request->filled('tags'))
            $tags = $request->tags;
        else
            $tags = '';

        // if a media has been uploaded...
        if(!is_null($request->media) && $request->media != 'undefined')
        {
            // handle media received
            $path = $request->media->store('public/uploads/' . $user->id); // store file
            $search = 'public/';
            $to_replace = '/storage/';
            $pathToStore = \Illuminate\Support\Str::replaceFirst($search, $to_replace, $path);

            // Update publication media
            $publication->media = $pathToStore;
            $publication->media_card = $pathToStore;
            $publication->save();
        }

        // Fetch and Update entity
        $publication->title =  $request->title;
        $publication->content =  $request->content;
        $publication->tags =  $tags;
        $publication->overview =  $request->overview;
        $publication->time_total =  $request->time_total;
        $publication->category_id =  $request->category;
        $publication->type_visibility_id =  $request->visibility;
        $publication->position_id =  $request->position;
        $publication->type_publication_id = 2;

        // Save entity
        $publication->save();

        // Return success response
        return response()->json([
            'success' => true,
            'message' => "Modification de l'article réussi!",
        ], 201);
    }


    /**
     * delete
     * This function soft deletes an article
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function delete(Request $request, $id)
    {

        // find article
        $article = Publication::find($id);

        if(is_null($article))
        {
            // response json
            return response()->json([
                'success' => false,
                'message' => 'Suppression de l\'article échoué.',
            ]);
        }

        // soft deletes
        $article->delete();

        // response json
        return response()->json([
            'success' => true,
            'message' => 'Suppression de l\'article réussi.',
        ]);

    }


    // liking function for article
    public function like(Request $request, $id)
    {
        // find article
        // update is_liked value to true
        //save
        // response
    }

    // unlike function for article
    public function unlike(Request $request, $id)
    {
        // find article
        // update is_liked value to false
        //save
        // response
    }

}
