<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Blacklisted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // if the user is blacklisted, reject the request
        if (Auth::user()->user_status_id === 3){
            return response()->json([
                'message' => 'Non accessible aux utilisateurs.'
            ], 401);
        }

        // Allow request
        return $next($request);

    }
}
