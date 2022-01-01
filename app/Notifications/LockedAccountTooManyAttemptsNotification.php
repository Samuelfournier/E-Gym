<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LockedAccountTooManyAttemptsNotification extends Notification
{
    use Queueable;

    protected $url;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($url)
    {
        //
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Votre compte est temporairement désactivé.')
                    ->greeting('Bonjour,')
                    ->line('Ce courriel est pour vous aviser que votre est désactivé pour une durée d\'une heure puisque trop de tentatives connexion à votre compte ont été effectué')
                    ->line('Si vous êtes l\'auteur de ces tentatives, vous pouvez ignorer ce message. Autrement, nous vous recommandons de communiquer avec notre administration.')
                    ->action('Appuyer ici pour aller sur l\'application', url($this->url))
                    ->salutation('Merci,');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
