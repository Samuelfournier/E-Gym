<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMissingColUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Update la table users
        Schema::table('users', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('lastname');
            $table->date('birthdate')->nullable()->after('lastname');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        if(schema::hasTable('users', function(Blueprint $table){

            if (Schema::hasColumn('user', 'gender'))
                $table->dropColumn('gender');

            if (Schema::hasColumn('user', 'birthdate'))
                $table->dropColumn('birthdate');

        }));

    }
}
