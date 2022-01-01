<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddHasChangedToUp extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_publications', function (Blueprint $table) {
            $table->string('has_changed')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_publications', function (Blueprint $table) {
            if (Schema::hasColumn('user_publications', 'has_changed'))
                $table->dropColumn('has_changed');
        });
    }
}
