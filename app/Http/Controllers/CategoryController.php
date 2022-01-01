<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Publication;
use Illuminate\Http\Request;
use App\Models\UserPublication;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function addCategory(Request $request)
    {
        $cat = Category::where('id', '=', $request->get('id'))->first();

        if($cat){
            $response= $this-> editCategory($request,$cat->id);
            return $response;
        }
        // This is to restore deleted category. Button in Category.js has to be uncomment
        else{
            $catTrashed = Category::withTrashed()
                ->select('id','name','description')
                ->where('name', '=', $request->get('name'))->first();
                if($catTrashed){
                $catTrashed->restore();
                };
                if($catTrashed){
                    $cat = Category::select('id','name','description')
                    ->where('name', '=', $request->get('name'))->first();
                    $response= $this-> editCategory($request,$cat->id);
                    return $response;
                }
            Category::create([
                'name'=>$request['name'],
                'description'=>$request['description'],

            ]);
            return response()->json([
                'success' => true,
                'message' => 'La catégorie a été ajouté',
            ], 201);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the all resource.
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllCategories()
    {
        /**
         * This get category's name,
         * Number of publication of each category,
         * Latest publication for each category,
         * Number of author
         * Category status active/not active
        */
        $cat =DB::table('categories as c')
        ->select('c.id','c.name',DB::raw('count(p.category_id) as total'),
                DB::raw('max(DATE(p.updated_at)) as date'),
                DB::raw('count( distinct up.user_id) as totalCollab'),
                )
        ->leftJoin('publications as p','c.id','=','p.category_id')
        ->leftJoin('user_publications as up',function ($join) {
            $join->on('up.publication_id','=','p.id')
                ->where('up.type_subscription_id', '=', '2');
                })
        ->whereNull('p.deleted_at')
        ->groupBy('c.id')->get();

        //dd($cat);
    return  response()->json([
        'data' => $cat,
    ]);
    }
    public function getCategory($id)

    {
        return $category = Category::find($id);

    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editCategory($data,$id)
    {
        $update_data =array_filter([
            'name'=>$data['name'],
            'description'=> $data['description'],
        ]);

        if(!empty($update_data)){
            $update_status = Category::where('id', '=',$id)->update($update_data);
        }else{
            $update_status=false;
        }
        if(!$update_status){
            // Return error message
            return response()->json([
                'message' => 'Modification échoué.',
                ], 500);
         }
         return response()->json([
            'success' => true,
            'message' => 'La catégorie a été modifié',
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function status(Request $request)
    {
        $request->dd();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    /* THIS FUNCTION HAS A COMMENT BUTTON IN CATEGORY.JS IN FRONT END
    *  UNCOMMENT THE BUTTON TO MAKE THIS WORK
    */
    public function delete(Request $request,$id)
    {
        $category = Category::find($id);

        if(is_null($id))
        {
             // response json
            return response()->json([
                'success' => false,
                'message' => 'Suppression de la catégorie a échoué.',
            ]);
        }
           // soft deletes
        $category->delete();
        return response()->json([
            'success' => true,
            'message' => 'La catégorie a été retirée',
        ], 201);
        }
}
