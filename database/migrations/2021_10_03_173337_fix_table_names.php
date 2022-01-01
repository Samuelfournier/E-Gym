<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixTableNames extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('user_position')) {
            Schema::rename('user_position', 'user_positions');
        };

        if (Schema::hasTable('user_publication')) {
            Schema::rename('user_publication', 'user_publications');
        };

        if (Schema::hasTable('session_training')) {
            Schema::rename('session_training', 'session_trainings');
        };

        if (Schema::hasTable('equipment_exercice')) {
            Schema::rename('equipment_exercice', 'equipment_exercices');
        };
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('user_positions')) {
            Schema::rename('user_positions', 'user_position');
        };

        if (Schema::hasTable('user_publications')) {
            Schema::rename('user_publications', 'user_publication');
        };

        if (Schema::hasTable('session_trainings')) {
            Schema::rename('session_trainings', 'session_training');
        };

        if (Schema::hasTable('equipment_exercices')) {
            Schema::rename('equipment_exercices', 'equipment_exercice');
        };
    }
}
