<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers added
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ExerciceController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\EquipementController;
use App\Http\Controllers\LikeSystemController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\TrainingProgramController;
use App\Http\Controllers\ProfessionnalController;
use App\Http\Controllers\ContentCreatorController;
use App\Http\Controllers\Auth\ConfirmPasswordController;
use App\Http\Controllers\Auth\ApiPasswordResetController;
use App\Http\Controllers\auth\EmailVerificationController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route to retrieve user data. User must be auth. and its email must be verified.
Route::middleware(['auth:sanctum', 'verified'])->get('/user', function (Request $request) {
    return $request->user();
});

//! Routes available to everyone

// Auth & Register
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/password/confirm', [ConfirmPasswordController::class, 'confirm']); // might delete
Route::post('/forgot-password', [ApiPasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [ApiPasswordResetController::class, 'reset']);
Route::post('/register', [RegisterController::class, 'register']);
Route::get('/verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');
Route::get('/get-all-content', [ContentController::class, 'getAllContent']);


Route::get('/verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');

// Search content
Route::get('/get-all-content', [ContentController::class, 'getAllContent']);
Route::get('/GetTypes',  [ContentController::class, 'getAllContentType']);

// Visualize article/specialists
Route::get('/article/{id}',  [ArticleController::class, 'getArticle']); // view article
Route::get('/professionnal/{id}', [ProfessionnalController::class, 'show']); // view the page of a professionnal
Route::get('/GetAllContentCreator',  [ContentCreatorController::class, 'getAllCreators']);
Route::get('/training-program/{id}', [TrainingProgramController::class, 'read']);

Route::get('/categories',  [CategoryController::class, 'getAllCategories']);
Route::post('/categorie-status',  [CategoryController::class, 'status']);

// Routes only usable if authenticated and verified. (Protected routes)

Route::middleware(['blacklisted'])->group(function () {

    //! Routes only usable if authenticated and verified. (Protected routes)
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {

        // Profile
        Route::get('/complete-profile', [ProfileController::class, 'completeProfil']);
        Route::post('/complete-profile', [ProfileController::class, 'completeProfilPost']);
        Route::get('/modifyPreferenceInfo/{id}', [ProfileController::class, 'modifyPreferenceInfo']);
        Route::post('/updateProfil', [ProfileController::class, 'updateProfil']);
        Route::post('/unSubscribe', [ProfileController::class, 'unSubscribeUser']);

    Route::get('/GetMyContent/{user_id}',  [ContentController::class, 'getMyContent']);
    Route::get('/create-article', [ArticleController::class, 'createArticle']); // fetch data
    Route::post('/create-article',  [ArticleController::class, 'createArticlePost']); // save data




  
        // Payments
        Route::get('/getUserPreference/{id}', [ProfileController::class, 'getUserPreference']);
        Route::post('/setupSubscription', [PaymentController::class, 'setupSubscription']);
        Route::post('/updateSquareCardInfo', [PaymentController::class, 'updateSquareCardInfo']);
        Route::post('/setupSubscriptionWithPromoCode', [PaymentController::class, 'setupSubscriptionWithPromoCode']);
        Route::get('/square-info/{subscription_id}', [PaymentController::class, 'getSquareSubscriptionEndDate']);

        // My Content
        Route::get('/GetMyContent/{user_id}',  [ContentController::class, 'getMyContent']);

        // Like system
        Route::post('/toggle-like/{id}', [LikeSystemController::class, 'toggle']); //toggle like. id => publication_id
        Route::get('/get-all-liked-publications', [LikeSystemController::class, 'getAllLikedPublications']); //toggle like. id => publication_id
        
        Route::post('/save-progress/training-program/{id}', [TrainingProgramController::class, 'saveTrainingProgramProgress']);
        //! Routes that are only accessible by a contentCreator or an Admin.
        Route::middleware(['creator'])->group(function () {

            // Article
            Route::get('/create-article/{id}', [ArticleController::class, 'createArticle']); // fetch data of article
            Route::post('/create-article/{id}',  [ArticleController::class, 'createArticlePost']); // save data of article
            Route::post('/delete-article/{id}',  [ArticleController::class, 'delete']); // soft deletes an article
            Route::post('/creation-exercice', [ExerciceController::class, 'createExercice']);

            // Activity
            Route::post('/createActivity', [ActivityController::class, 'createActivity']);
            Route::post('/updateActivity', [ActivityController::class, 'updateActivity']);
            Route::get('/get-all-activities', [ActivityController::class, 'getAllActivities']);


            // Exercice
            Route::get('/getAllMyExercices', [ExerciceController::class, 'getAllMyExercices']); //get all my exercice
            Route::post('/edit-exercice', [ExerciceController::class, 'editExercice']);//update specific exercice by id
            Route::get('/exercices', [ExerciceController::class, 'allExercices']); //get all exercice
            Route::get('/exercice/{id}', [ExerciceController::class, 'getExercice']); //get specific exercice
            Route::post('/edit-exercice', [ExerciceController::class, 'editExercice']); //update specific exercice by id
            Route::post('/delete-exercice', [ExerciceController::class, 'deleteExercice']);//delete specific exercice by id

            // Training program
            Route::post('/create/training-program', [TrainingProgramController::class, 'create']);
            Route::post('/update/training-program/{id}', [TrainingProgramController::class, 'update']);
            Route::post('/delete/training-program/{id}', [TrainingProgramController::class, 'delete']);
            
            Route::post('/seenChanges', [TrainingProgramController::class, 'seenChanges']);

            
            Route::get('/content/{id}/author', [ContentController::class, 'getAuthorId']); //return the id of the author of the specified training program
            
            // Equipment
            Route::get('/getAllEquipments', [EquipementController::class, 'getAllEquipments']);
            Route::get('/getEquipementForDropdown', [EquipementController::class, 'getEquipementForDropdown']);
            Route::get('/getEquipmentForAnExercice/{id}', [ExerciceController::class, 'getEquipmentForAnExercice']);
            Route::post('/addEquipment', [EquipementController::class, 'addEquipment']);
            Route::post('/editEquipment', [EquipementController::class, 'editEquipment']);

        });
            //! Routes only accessible to administrator
            Route::middleware(['admin'])->group(function () {
                //Category
                Route::post('/add-category',  [CategoryController::class, 'addCategory']);
                Route::post('/edit-category',  [CategoryController::class, 'editCategory']);
                Route::post('/delete-category/{id}',  [CategoryController::class, 'delete']);
                Route::get('/get-category/{id}',  [CategoryController::class, 'getCategory']);
                //Specialist
                Route::post('/registerSpecialist', [ProfessionnalController::class, 'registerSpecialist']);
                // Tokens (inscription)
                Route::post('/generate-tokens',  [TokenController::class, 'generateTokens']);
                Route::get('/get-all-tokens',  [TokenController::class, 'getAll']);
                Route::post('/delete-token', [TokenController::class, 'deleteToken']);

                // List users
                Route::get('/get-all-users',  [UserController::class, 'getAll']);

            });

        });
});