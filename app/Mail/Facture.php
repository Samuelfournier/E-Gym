<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Facture extends Mailable
{
    use Queueable, SerializesModels;


    protected $customer_name;

    protected $price = 9.99;
    protected $QCTaxes = 0.05;
    protected $CANTaxes = 0.09975;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name)
    {
        $this->customer_name = $name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('Facture')
                    ->with([
                        'customer_name' => $this->customer_name,
                        'price' => $this->price,
                        'QCTaxes' => $this->QCTaxes,
                        'CANTaxes' => $this->CANTaxes,
                    ]);
    }
}
