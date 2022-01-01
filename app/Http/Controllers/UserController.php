<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //get all users in bd
    public function getAll(Request $request)
    {

        if (!$fetchUsers = User::withTrashed()->get())
            $Users = [];
        foreach ($fetchUsers as $fetchUser) {
            $role_label = '';
            switch ($fetchUser->role_id) {
                case 1:
                    $role_label = 'Utilisateur';
                    break;
                case 2:
                    $role_label = 'Administrateur';
                    break;
                case 3:
                    $role_label = 'Spécialiste';
                    break;
                default:
                    $role_label = '';
                    break;
            }

            $status_label = '';
            switch ($fetchUser->user_status_id) {
                case 1:
                    $status_label = 'Actif';
                    break;
                case 2:
                    $status_label = 'Inactif';
                    break;
                case 3:
                    $status_label = 'Sur la liste noire';
                    break;
                default:
                    $status_label = '';
                    break;
            }


            $Users[] = array(
                'id' => $fetchUser->id,
                'firstname' => $fetchUser->firstname,
                'lastname' => $fetchUser->lastname,
                'email' => $fetchUser->email,
                'role_id' => $role_label,
                'user_status_id' => $status_label,
                'created_at' => $fetchUser->created_at->format('Y-m-d'),
                'action' => [],
            );
        }

        return response()->json([
            'users' => $Users,
        ]);
    }
}
