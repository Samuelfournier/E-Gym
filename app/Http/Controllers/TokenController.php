<?php

namespace App\Http\Controllers;

use App\Models\Token;
use Illuminate\Http\Request;
use App\TokenGenerator\TokenGenerator;


class TokenController extends Controller
{
    //get all tokens in bd
    public function getAll(Request $request)
    {

        if(!$fetchTokens = Token::all())
            $tokens = [];

        foreach($fetchTokens as $fetchToken)
        {
            $tokens[] = array(
                'id' => $fetchToken->id,
                'code'=>$fetchToken->code,
                'expiration_date' => $fetchToken->expiration_date,
                'is_used' => $fetchToken->is_used == 1 ? 'Oui' : 'Non',
                'created_at' => $fetchToken->created_at->format('Y-m-d'),
                'action' => [],
            );
        }

        return response()->json([
            'tokens' => $tokens,
        ]);

    }

    // This function generates the tokens
    public function generateTokens(Request $request)
    {

        $request->validate([
            'quantity' => 'required|int|min:0',
            'expiration_date' => 'required|date'
        ]);


        $tokenGenerator = new TokenGenerator();
        $limit = $request->quantity;
        $expiration_date = $request->expiration_date;

        for ($i = 0; $i < $limit; $i++) {
            $token = $tokenGenerator->getToken(15);

            Token::create([
                'code' => $token,
                'expiration_date' => $expiration_date,
                'is_used' => false,
                'batch' => 0,
            ]);
        }

        return response()->json([
            'message' => 'Codes générées avec succès.',
        ]);
    }

    // This function delete a token
    public function deleteToken(Request $request){

        $token = Token::find($request->token_id);
        $token->delete();

        return response()->json([
            'message' => 'Code d\'inscription supprimé avec succès.',
        ]);
    }

}
