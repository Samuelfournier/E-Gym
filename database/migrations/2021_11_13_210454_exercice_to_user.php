<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ExerciceToUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exercices', function (Blueprint $table) {

            if (!Schema::hasColumn('exercices', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable(true);
                $table->foreign('user_id')->references('id')->on('users');
            }
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // to be determined
    }
}
