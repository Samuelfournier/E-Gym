<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Admin
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
        // If the user is an admin, accept request
        if (Auth::user()->role_id === 2)
            return $next($request);

        return response()->json([
            'message' => 'Non accessible aux utilisateurs.'
        ], 401);
    }
}
