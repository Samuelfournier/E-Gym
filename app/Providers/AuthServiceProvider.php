<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // to customize the email for email verification
        VerifyEmail::toMailUsing(function($user, $url){

            $httpsUrl = $url;

            // Check if url contains https.
            $containsHttps = \Illuminate\Support\Str::contains($url, 'https');

            // if the url doesn't contains https
            if($containsHttps == false)
            {
                var_dump($url, $containsHttps);
                $search = 'http';
                $replace_by = 'https';
                $httpsUrl = \Illuminate\Support\Str::replaceFirst($search, $replace_by, $url);
            }

            return (new MailMessage)
                    ->greeting('Bonjour,')
                    ->subject('Vérification de l\'adresse courriel de votre compte')
                    ->line('Veuillez appuyer sur le bouton ci-dessous pour vérifier votre courriel.')
                    ->action('Vérifier mon adresse courriel', $httpsUrl)
                    ->line('Si vous n\'avez pas créer de compte, aucune action n\'est requise.')
                    ->salutation('Merci,');
        });
    }
}
