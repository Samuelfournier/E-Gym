<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// to move in the protected group

Route::post('/api/logout', [LoginController::class, 'logout']);
//Route::view('/{path?}', 'index');
Route::get('/{path?}', function () {
            return view('index');
    })->where('path', '.*');



