<?php

namespace App\SquareClientInstance;



use Square\SquareClient;

use Square\Environment;


class SquareClientInstance
{
    private static $instance = null;

    private function __construct()
    {
    }


    public static function getInstance()
    {
    
        if (self::$instance == null)
        {
            self::$instance = new SquareClient([
            'accessToken' => $_ENV["ACCESS_TOKEN"],
            'environment' => Environment::SANDBOX,
        ]);
        }
        // Returns the instance
        return  self::$instance;
    }
}
?>
