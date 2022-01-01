<?php

namespace App\Http\Controllers;

use Exception;
use App\Mail\Facture;
use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Square\Exceptions\ApiException;
use Illuminate\Support\Facades\Mail;
use App\TokenGenerator\TokenGenerator;
use App\SquareClientInstance\SquareClientInstance;
use Carbon\Carbon;

class PaymentController extends Controller
{

    /**
     * setupSubscriptionWithPromoCode
     * This function is called when a promocode is entered.
     * @param  mixed $request
     * @return void
     */
    public function setupSubscriptionWithPromoCode(Request $request){

        // Check if id and promocode are in the request, and not null
        if($request->filled('id') && $request->filled('promocode'))
        {
            $promocode = $request->get('promocode');
            // Find user in db or launch exception
            $user = User::findorFail($request->get('id'));

            // Check if token exist in table and not used
            $token = Token::where('code', '=', $promocode)
                                ->where('is_used', '=', 0);

            if($token = $token->first())
            {
                // Associate token to user
                $user->token_id = $token->id;

                // Set the payment accepted to true.
                $user->payment_accepted = true;

                // Save model.
                $user->save();

                $token->is_used = 1;
                $token->save();

                // Send email with receipt
                $this->EmailSubscription($user->firstname, $user->email);

                // return success message
                return response()->json([
                    'success' => true,
                    'message' => 'Paiement accepté et abonnement valide jusqu\'à ' . $token->expiration_date,
                ], 200);
            }
            else
            {
                return response()->json([
                    'success' => false,
                    'message' => 'Mauvais code ou code déjà utilisé!',
                ], 200);
            }

        }
        else
        {
            return response()->json([
                'success' => false,
                'message' => 'Code manquant ou utilisateur non existant',
            ], 400);
        }

    }

    public function setupSubscription(Request $request){
        //fetch whats in the json
        $data = $request->all();

        // fetch user in db
        $user = DB::table('users')->find($data['id']);

        // check if user or request data is empty
        if(is_null($user) || is_null($data)){
            return response()->json([
                "error" => "Utilisateur inexistant",
                "success" => false
            ]);
        }

        if($user->id_client_square != null || $user->id_client_square != ''){ 

            return $this->reSubscribe($user,$data);
        }

        //variable pour savoir à quelle étape on est rendu
        $step = 0;

        try {
            $createCustomerResponse = $this->createCustomer($data, $user);                          
            $customerSquareId =  $createCustomerResponse['id'];                                     
            $step++;                                                                                   
            $cardSquareId = $this->createCard($data,$createCustomerResponse['address'], $customerSquareId);
            $step++;
            $subscriptionSquareId = $this->linkCustomerToSubscription($customerSquareId, $cardSquareId);

            $this->storeSquareCustomerId($data['id'], $customerSquareId);                           
            $this->storeSquareCardId($data['id'],$cardSquareId);                                    
            $this->storeSubscriptionId($data['id'],$subscriptionSquareId);
            $this->paymentAccepted($data['id']);
            $this->EmailSubscription($user->firstname, $user->email);
            return response()->json([
                'success' => true
            ]);
        }
        catch(Exception $e){

            //erreur à la création de client
            if($step == 0){
                return response()->json([
                    'success' => false,
                    "error" => "Erreur lors de la creation du client"
                ]);
            }
            //erreur à la création de carte, doit supprimé le customer
            else if ($step == 1){
                $this->deleteCustomerSquare($customerSquareId);
                return response()->json([
                    'success' => false,
                    "error" => "Erreur a la creation de la carte, customer Square supprime"
                ]);
            }
            //erreur lors de la subscription, doit supprimé carte et Subscription
            else {
                $this->deleteCustomerCardSquare($cardSquareId);
                $this->deleteCustomerSquare($customerSquareId);
                return response()->json([
                    'success' => false,
                    "error" => "Erreur a lors de la subscription, client et carte Square supprime"
                ]);
            }
        }
    }


    public function reSubscribe($user, $data){

        $step = 0;

        $address = new \Square\Models\Address();
        $address->setAddressLine1($data['address_1']);
        $address->setAddressLine2($data['address_2']);
        $address->setLocality($data['province']);
        $address->setPostalCode($data['zip']);
        $address->setCountry($this->getEnumValueFromCountry($data['country']));

        try {

            $NewcardSquareId = $this->createCard($data,$address, $user->id_client_square);
            $step++;
            $subscriptionSquareId = $this->linkCustomerToSubscription($user->id_client_square, $NewcardSquareId);
            $step++;

            $this->deleteCustomerCardSquare($user->id_card_square);
            $this->storeSquareCardId($user->id,$NewcardSquareId);                                    
            $this->storeSubscriptionId($user->id,$subscriptionSquareId);
            $this->paymentAccepted($user->id);
            $this->EmailSubscription($user->firstname, $user->email);

        }
        catch(Exception $e){

            //erreur à la création de client
            if($step == 0){
                return response()->json([
                    'success' => false,
                    "error" => "Erreur lors de la creation de la carte"
                ]);
            }
            if ($step == 1){

                $this->deleteCustomerCardSquare($NewcardSquareId);
                return response()->json([
                    'success' => false,
                    "error" => "Erreur a la création de l'abonnement"
                ]);
            }
        }

        return response()->json([
            'success' => true
        ]);

    }


    public function unSubscribe($idSub){

        $instance_square = SquareClientInstance::getInstance();

        $this->cancelSubscriptionSquare($idSub,$instance_square);
        $today = date('Y-m-d');
        $this->cancelSubscriptionBD($idSub,$today);

    }


    //Fait la création du client d'en Square
    public function createCustomer($data,$user) {


        try {

            $instance_square = SquareClientInstance::getInstance();
            $address = new \Square\Models\Address();
            $address->setAddressLine1($data['address_1']);
            $address->setAddressLine2($data['address_2']);
            $address->setLocality($data['province']);
            $address->setPostalCode($data['zip']);
            $address->setCountry($this->getEnumValueFromCountry($data['country']));
            $body = new \Square\Models\CreateCustomerRequest();
            $body->setGivenName($user->firstname);
            $body->setFamilyName($user->lastname);
            $body->setEmailAddress($user->email);
            $body->setAddress($address);

            $apiResponse = $instance_square->getCustomersApi()->createCustomer($body);

            if ($apiResponse->isSuccess()) {
                $createCustomerResponse = $apiResponse->getResult();
               return array(
                   "id"=> $createCustomerResponse->getCustomer()->getid(),
                   "address"=> $address
                );
            } else {
                $errors = $apiResponse->getErrors();
                throw new Exception("Une erreur c'est produite");
            }
        }
        catch (ApiException $e) {
            throw new Exception("Une erreur c'est produite", $e->getMessage());
        }

    }

    // Fait la création de la carte dans Square
    public function createCard($data, $address, $customerSquareId) {

        $instance_square = SquareClientInstance::getInstance();

        $tokenGenrator = new TokenGenerator;
        $randomToken = $tokenGenrator->getToken(40);


        //ZIP MUST BE 94103 for testing card to work
        $card = new \Square\Models\Card();
        $card->setCardholderName($data['cardHolderName']);
        $card->setBillingAddress($address);
        $card->setCustomerId($customerSquareId);

        $body = new \Square\Models\CreateCardRequest(
            $randomToken,
            $data['sourceId'],
            $card
        );

        $api_response = $instance_square->getCardsApi()->createCard($body);

        if ($api_response->isSuccess()) {
            $result = $api_response->getResult();
            return $result->getCard()->getid();
        } else {
            $errors = $api_response->getErrors();
            throw new Exception("Une erreur c'est produite");
        }
    }


    // Lie le plan avec l'Abonnée
    public function linkCustomerToSubscription($customerSquareId, $cardSquareId){

        $instance_square = SquareClientInstance::getInstance();
        $planId = $this->createSubscriptionPlan();

        $body = new \Square\Models\CreateSubscriptionRequest(
        $_ENV["LOCATION_ID"],
        $planId,
        $customerSquareId
        );
        $body->setTaxPercentage('14.975');
        $body->setCardId($cardSquareId);
        $body->setTimezone('America/Montreal');

        $api_response = $instance_square->getSubscriptionsApi()->createSubscription($body);

        if ($api_response->isSuccess()) {
        $result = $api_response->getResult();
        return $result->getSubscription()->getid();
        } else {
        throw new Exception("Une erreur c'est produite");
        }

    }


    //Fait la création du plan
    public function createSubscriptionPlan(){

        // Si le plan n'est pas créer, fait la création
        if(DB::table('square')->count() == 0){

            $instance_square = SquareClientInstance::getInstance();

            $recurring_price_money = new \Square\Models\Money();
            $recurring_price_money->setAmount(999);
            $recurring_price_money->setCurrency('CAD');

            $subscription_phase = new \Square\Models\SubscriptionPhase('MONTHLY', $recurring_price_money);

            $phases = [$subscription_phase];
            $subscription_plan_data = new \Square\Models\CatalogSubscriptionPlan('e-gym abonnement', $phases);

            $object = new \Square\Models\CatalogObject('SUBSCRIPTION_PLAN', '#plan');
            $object->setSubscriptionPlanData($subscription_plan_data);

            $tokenGenrator = new TokenGenerator;
            $randomToken = $tokenGenrator->getToken(40);

            $body = new \Square\Models\UpsertCatalogObjectRequest($randomToken, $object);

            $api_response = $instance_square->getCatalogApi()->upsertCatalogObject($body);


            if ($api_response->isSuccess()) {
                $result = $api_response->getResult();
                $this->storeSquareSubscriptionPlan($result->getCatalogObject()->getid());
                return $result->getCatalogObject()->getid();
            } else {
                $errors = $api_response->getErrors();
                throw new Exception("Une erreur c'est produite");
            }
        }

        return DB::table('square')->find(1)->id_square_plan;

    }


    //Quand il y a une erreur lors de la création, delete le customer Square.
    public function deleteCustomerSquare($customerSquareId){
        $instance_square = SquareClientInstance::getInstance();
        $instance_square->getCustomersApi()->deleteCustomer($customerSquareId);
    }

     //Quand il y a une erreur lors de la création, delete le customer Square.
     public function deleteCustomerCardSquare($cardSquareId){
        $instance_square = SquareClientInstance::getInstance();
        $instance_square->getCardsApi()->disableCard($cardSquareId);
    }


      //Stock en BD l'id Square du user
      public function paymentAccepted($id){
        DB::table('users')
            ->where('id', $id)
            ->update([
                'payment_accepted' => 1,
                'deleted_at' => null,
                'user_status_id' => 1,

        ]);
    }

    //Stock en BD l'id Square du user
    public function storeSquareCustomerId($id, $customerSquareId){

        DB::table('users')
            ->where('id', $id)
            ->update(['id_client_square' => $customerSquareId]);
    }

    // Stock en BD l'id de la carte de credit Square
    public function storeSquareCardId($id, $cardSquareId){

        DB::table('users')
            ->where('id', $id)
            ->update(['id_card_square' => $cardSquareId]);
    }


    // Stock en BD l'id de la # d'abonnement
    public function storeSubscriptionId($id, $subscriptionSquareId){

        DB::table('users')
            ->where('id', $id)
            ->update(['id_subscription_square' => $subscriptionSquareId]);
    }


     // Stock en BD l'id du plan
     public function storeSquareSubscriptionPlan($planId){


        DB::table('square')->upsert([
            ['id_square_plan' => $planId]
        ], ['id_square_plan']);
    }

    public function getEnumValueFromCountry($country) {

        $lowercaseCountry = strtolower($country);
        if($lowercaseCountry == 'canada') return 'CA';
        else if ($lowercaseCountry == 'états-unis') return 'US';
        else if ($lowercaseCountry == 'france') return 'FR';
        else return 'ZZ'; // ZZ == Inconnue pour square
    }


    // Méthode appelé à tous les jours pour désactivé les comptes qui n'ont pas payé
    public function handleExpiredToken(){

        DB::statement("UPDATE users
        SET deleted_at = NOW(), user_status_id = 2
        WHERE id IN
        (
        SELECT u.id FROM (SELECT id,token_id, deleted_at FROM users) AS u
            LEFT JOIN tokens t ON u.token_id = t.id
            WHERE u.token_id IS NOT NULL
            AND t.expiration_date < CURDATE()
            AND deleted_at IS NULL
        )");
    }


    // Méthode appelé à tous les jours pour désactivé les comptes qui n'ont pas payé
    public function handleMissPayment(){

        $instance_square = SquareClientInstance::getInstance();
        $users = DB::table('users')->whereNull('deleted_at')->get();
        $today = date("Y-m-d");

        foreach ($users as $user) {

            //si l'abonnement à expiré pour non paiement
            if(!$this->isStillSubscribe($user->id_subscription_square,$instance_square,$today)){
                $this->cancelSubscriptionSquare($user->id_subscription_square,$instance_square);
                $this->cancelSubscriptionBD($user->id_subscription_square,$today);

                //TO-DO need to call logout as well
            }
        }
    }


    // Valide si l'abonement d'un client est encore valide
    public function isStillSubscribe($idSub, $instance_square,$today){

        $api_response = $instance_square->getSubscriptionsApi()->retrieveSubscription($idSub);
        $result = $api_response->getResult();
        $endOfSubscription = $result->getSubscription()->getchargedThroughDate();

        if($endOfSubscription < $today){
            return false;
        }
        return true;
    }


    public function cancelSubscriptionSquare($idSub,$instance_square){
        
        $instance_square_unsub = SquareClientInstance::getInstance();
        $instance_square_unsub->getSubscriptionsApi()->cancelSubscription($idSub);
    }


    // Update la BD pour désactivé le user lorsqu'il n'est plus abonné
    private function cancelSubscriptionBD($idSub, $cancelDate){

        DB::table('users')
        ->where('id_subscription_square', $idSub)
        ->update([
        'user_status_id' => 2,
        'payment_accepted' => 0,
        ]);
    }


    public function EmailSubscription($name,$email){
        Mail::to($email)->send(new Facture($name));
    }


    public function getUserSquareInfo($idSquare) {

        $instance_square = SquareClientInstance::getInstance();
        $api_response = $instance_square->getCustomersApi()->retrieveCustomer($idSquare);

        if ($api_response->isSuccess()) {
            return $api_response->getResult();
        } else {
            return $api_response->getErrors();
        }
    }

    public function getSquareSubscriptionEndDate($idSubscription){

        $instance_square = SquareClientInstance::getInstance();
        $api_response = $instance_square->getSubscriptionsApi()->retrieveSubscription($idSubscription);
        $result = $api_response->getResult();
        return $result->getSubscription()->getchargedThroughDate();

    }


    public function updateSquareCardInfo(Request $request){
   

        $user = DB::table('users')->find($request->id);

        if($user->id_client_square == null || $user->id_client_square == '') {
           return $this->setupSubscription($request);
        }

       
        $data = $request->all();

        $address = new \Square\Models\Address();
        $address->setAddressLine1($data['address_1']);
        $address->setAddressLine2($data['address_2']);
        $address->setLocality($data['province']);
        $address->setPostalCode($data['zip']);
        $address->setCountry($this->getEnumValueFromCountry($data['country']));

        $step = 0;

        try {

            $cardSquareId = $this->createCard($data, $address, $user->id_client_square);
            $step++;
            $subscriptionId = $this->updateSubscription($cardSquareId,$user->id_subscription_square);
            $step++;
            $this->deleteCustomerCardSquare($user->id_card_square);
            $this->storeSquareCardId($user->id,$cardSquareId);

            $squareInfoTemp = $this->getUserSquareInfo($user->id_client_square);
            $path = $squareInfoTemp->getCustomer()->getCards()[0];
            $squareInfo = [
                'brand' => strtolower($path->getcardBrand()),
                'last4' => $path->getlast4(),
                'exp' => str_pad($path->getexpMonth(), 2, '0', STR_PAD_LEFT) . '/' . $path->getexpYear() ,
            ];

            return response()->json([
                'success' => true,
                "square" => $squareInfo
            ]);
            
        }
        catch(Exception $e) {

            if ($step == 0){
                return response()->json([
                    'success' => false,
                    "error" => "Erreur a la creation de la carte"
                ]);
            }

            if ($step == 1){

                $this->deleteCustomerCardSquare($cardSquareId);
                return response()->json([
                    'success' => false,
                    "error" => "Erreur a la mise a jour de l'abonnement"
                ]);
            }
        }
    }

    public function updateSubscription($cardSquareId, $subscriptionSquareId){

        $instance_square = SquareClientInstance::getInstance();

        $subscription = new \Square\Models\Subscription();
        $subscription->setCardId($cardSquareId);

        $body = new \Square\Models\UpdateSubscriptionRequest();
        $body->setSubscription($subscription);

        $api_response = $instance_square->getSubscriptionsApi()->updateSubscription($subscriptionSquareId, $body);

        if ($api_response->isSuccess()) {
            $result = $api_response->getResult();
            return $result->getSubscription()->getid();
        } else {
            throw new Exception("Une erreur c'est produite");
        }

    }



}
