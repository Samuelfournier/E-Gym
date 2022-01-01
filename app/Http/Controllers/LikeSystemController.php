<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPublication;
use Illuminate\Support\Facades\Auth;

/**
 * This controller controls all actions related to liking/unliking publications.
 */
class LikeSystemController extends Controller
{

    /**
     * getAllLikedPublications
     * Return all active userPublications of an authentified user.
     * @param  mixed $request
     * @return void
     */
    public function getAllLikedPublications(Request $request)
    {
        // Fetch entities
        $user = Auth::user();
        $userPublications = [];

        // If a user is authentified, fetch publications.
        if(!is_null($user))
        {
            $userPublications = UserPublication::where('user_id', '=', $user->id)->where('type_subscription_id', '=', 1)->pluck('publication_id');
           //dd($userPublications);
        }

        // Return response.
        return response()->json([
            'userPublications' => $userPublications,
        ]);

    }

    /**
     * toggle
     * This function toggle the like/unlike of a publication for the authentified user.
     * @param  mixed $request
     * @return void
     */
    public function toggle(Request $request, $id)
    {
        // Fetch entities
        $user = Auth::user();
        $publication_id = $id;
        $response = response()->json(['liked' => 'false']);

        if(!is_null($user))
        {
            $userPublication = UserPublication::withTrashed()
                ->where('user_id', '=', $user->id)
                ->where('publication_id', '=', $publication_id)
                //->where('type_subscription_id', '=', 1)
                ->first();

            if (is_null($userPublication))   // If the userPublication has never been created/softDeleted
            {
                $response = $this->create($user, $publication_id);
            }
            else if ($userPublication->trashed())    // If the userPublication has been softDeleted
            {
                $response = $this->like($userPublication);
            }
            else
            {
                $response = $this->unlike($userPublication);   // If it exist, we want to unlike it.
            }
        }

        return $response;
    }


    /**
     * create
     * This function creates a UserPublication instance with Type 1.
     * @param  mixed $user
     * @param  mixed $publication_id
     * @return void
     */
    private function create($user, $publication_id)
    {

        $uPub = UserPublication::create([
            'user_id' => $user->id,
            'publication_id' => $publication_id,
            'type_subscription_id' => 1,
        ]);

        // Return success response
        return response()->json([
            'liked' => true,
            'userPublication' => $uPub,
        ]);
    }


    /**
     * like
     * This function restore a softDeleted userPublication.
     * @param  mixed $userPublication
     * @return void
     */
    private function like($userPublication)
    {

        $userPublication->restore();
        $userPublication->save();

        // Return success response
        return response()->json([
            'liked' => true,
            'userPublication' => $userPublication,
        ]);
    }


    /**
     * unlike
     * This function softDelete a userPublication instance.
     * @param  mixed $userPublication
     * @return void
     */
    private function unlike($userPublication)
    {
        $userPublication->delete();
        $userPublication->save();

        // Return success response
        return response()->json([
            'liked' => false,
            'userPublication' => $userPublication,
        ]);
    }
}
