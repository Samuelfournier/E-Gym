<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSocialMediaUser extends Migration
{
  /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('user_roles')->insert([
            ['name'=>'Specialist','description'=>'Un fournisseur de contenue'],

        ]);

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'facebook_link'))
                $table->string('facebook_link')->nullable()->after('description');
            if (!Schema::hasColumn('users', 'instagram_link'))
                $table->string('instagram_link')->nullable()->after('description');
            if (!Schema::hasColumn('users', 'linkedin_link'))
                $table->string('linkedin_link')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('facebook_link');
            $table->dropColumn('linkedin_link');
            $table->dropColumn('instagram_link');
        });
    }
}
