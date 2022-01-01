<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>E-gym</title>
    </head>
    <body style="width: 30%;">
        <h1>Confirmation de votre abonnement </h1>

        <h3> Bienvenue chez E-gym {{$customer_name}}, voici la confirmation de votre abonnement</h3>
        <hr/>
        <table>
            <tr>
                <td>Prix de l'abonnement mensuel : </td>
                <td style="text-align: right;">{{$price}} $</td>
            </tr>
            <tr>
                <td style="text-align: right;">TPS :</td>
                <td style="text-align: right;">{{ number_format(round( $price * $QCTaxes, 2), 2) }} $</td>
            </tr>
            <tr>
                <td style="text-align: right;">TVQ :</td>
                <td style="text-align: right;">{{ number_format(round( $price * $CANTaxes, 2), 2) }} $</td>
            </tr>
            <tr>
                <td style="text-align: right;">Total :</td>
                <td style="text-align: right;">{{ number_format(round( $price + ( $price * $CANTaxes + $price * $QCTaxes), 2), 2)}} $</td>
            </tr>
        </table>
        <hr/>
        <div>
            L'abonnement est résiliable en tout temps. <br/> Les paiements seront prix automatique sur la carte de crédit que vous nous avez fournis. 
        </div>
        <br/>
        <br/>
        <div>
            <p> 
                <small> 
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum fuga aut totam ex sit dignissimos nam incidunt aperiam possimus dolores quod, magnam est 
                    delectus quibusdam molestias harum esse qui voluptates dicta, quos voluptatibus nobis et error aspernatur. Iure commodi eius aut molestias! 
                    Consequuntur quae, consequatur, laudantium debitis tempora ducimus nam.
                </small>
            </p>
        </div>
    </body>
</html>