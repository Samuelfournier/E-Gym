<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\SqlViews\ContentCreatorList;

class ContentCreatorController extends Controller
{
    // Méthodes qui retourne tous les créateurs de contenu
    public function getAllCreators(){
        return  ContentCreatorList::select("*")
        ->get()
        ->toArray();
    }

}
