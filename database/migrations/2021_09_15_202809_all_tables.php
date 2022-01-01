<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AllTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Table pays
        Schema::create('countries', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Columns
            $table->string('name')->nullable(false);

            // Created_at & updated_at
            $table->timestamps();
        });

        // Table pour plan square
        Schema::create('square', function (Blueprint $table) {
            $table->bigIncrements('id');
            // Columns
            $table->string('id_square_plan')->nullable(false);
            // Created_at & updated_at
            $table->timestamps();
        });

        // Table provinces
        Schema::create('provinces', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Columns
            $table->string('name')->nullable(false);
            $table->unsignedBigInteger('country_id');

            // Foreign keys
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');

            // Created_at & updated_at
            $table->timestamps();
        });

        // Table user_status (active/inactive)
        Schema::create('user_status', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false);

            $table->timestamps();
        });

        // Table user_roles (user/admin/creator)
        Schema::create('user_roles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false);
            $table->string('description')->nullable(false);

            $table->timestamps();
        });

        // Table tokens (for mass inscriptions)
        Schema::create('tokens', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code')->nullable(false);
            $table->date('expiration_date')->nullable(false);
            $table->boolean('is_used');
            $table->integer('batch')->nullable(false);

            $table->timestamps();
        });

        // Parce qu'on utilise Laravel, les tables users et ceux associés èa celle-ci sont déja créee.
        // Update la table users
        Schema::table('users', function (Blueprint $table) {
            $table->softDeletes(); // deleted_at
            $table->renameColumn('name', 'firstname')->nullable(true);
            $table->string('lastname')->nullable(true);
            $table->string('title')->nullable(true);
            // Media (path)
            $table->string('media')->nullable(true);
            $table->text('description')->nullable(true);

            $table->boolean('payment_accepted');
            $table->boolean('profile_completed');
            $table->string('id_client_square')->nullable(true);
            $table->string('id_card_square')->nullable(true);
            $table->string('id_subscription_square')->nullable(true);
            $table->string('google_client')->nullable(true);
            $table->string('facebook_client')->nullable(true);

            // Foreign keys
            $table->unsignedBigInteger('role_id')->nullable(false);
            $table->foreign('role_id')->references('id')->on('user_roles');
            $table->unsignedBigInteger('token_id')->nullable(true);
            $table->foreign('token_id')->references('id')->on('tokens');
            $table->unsignedBigInteger('user_status_id')->nullable(false);
            $table->foreign('user_status_id')->references('id')->on('user_status');
            $table->unsignedBigInteger('province_id')->nullable(false);
            $table->foreign('province_id')->references('id')->on('provinces');
        });

        // Table Activites
        Schema::create('activities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false)->default('');
            $table->text('description');

            $table->timestamps();
        });


        // Table type_abonnements
        Schema::create('type_subscriptions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false);

            $table->timestamps();
        });

        // Table Categories (nutrition, sante mentale...)
        Schema::create('categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false)->default('');
            $table->string('description')->nullable(false)->default('');

            $table->timestamps();
        });

        // Table type_visibilities (nutrition, sante mentale...)
        Schema::create('type_visibilities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false)->default('');
            $table->string('description')->nullable(false)->default('');
            $table->timestamps();
        });

        // Table type_publications
        Schema::create('type_publications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false)->default('');

            $table->timestamps();
        });

        // Table Equipements (nutrition, sante mentale...)
        Schema::create('equipments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false)->default('');
            $table->string('description')->nullable(false)->default('');

            $table->timestamps();
        });

        // Table Exercices (nutrition, sante mentale...)
        Schema::create('exercices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false)->default('');
            $table->string('description')->nullable(false)->default('');

            // Media (path)
            $table->string('media')->nullable(true);

            $table->timestamps();
        });


         // Table Entrainements (nutrition, sante mentale...)
        Schema::create('trainings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->time('duration')->nullable(true);
            $table->string('tempo')->nullable(true);
            $table->integer('nb_serie')->nullable(true)->default(0);
            $table->integer('nb_repetition')->nullable(true)->default(0);
            $table->time('resting_time')->nullable(true);

            // Foreign keys
            $table->unsignedBigInteger('exercice_id')->nullable(false);
            $table->foreign('exercice_id')->references('id')->on('exercices');

            $table->timestamps();
        });

        // Table Positions
        Schema::create('positions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable(false)->default('');
            $table->string('description')->nullable(false)->default('');

            // Foreign keys
            $table->unsignedBigInteger('activity_id')->nullable(false);
            $table->foreign('activity_id')->references('id')->on('activities');

            $table->timestamps();
        });

        // Table utilisateur_preferences
        Schema::create('user_position', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Foreign keys
            $table->unsignedBigInteger('user_id')->nullable(false);
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedBigInteger('position_id')->nullable(false);
            $table->foreign('position_id')->references('id')->on('positions');

            $table->timestamps();
        });

        // Table Publications
        Schema::create('publications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title')->nullable(false)->default('');
            $table->text('content')->nullable(true);
            $table->string('tags')->nullable(true)->default('');
            $table->string('overview')->nullable(true)->default('');
            $table->integer('time_total')->nullable(true);

            // Media (path)
            $table->string('media')->nullable(true);
            $table->string('media_card')->nullable(true);

            // Foreign keys
            $table->unsignedBigInteger('category_id')->nullable(false);
            $table->foreign('category_id')->references('id')->on('categories');
            $table->unsignedBigInteger('type_visibility_id')->nullable(false);
            $table->foreign('type_visibility_id')->references('id')->on('type_visibilities');
            $table->unsignedBigInteger('position_id')->nullable(false);
            $table->foreign('position_id')->references('id')->on('positions');
            $table->unsignedBigInteger('type_publication_id')->nullable(false);
            $table->foreign('type_publication_id')->references('id')->on('type_publications');

            $table->timestamps();
        });

        // Table Semaines
        Schema::create('weeks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('no_week')->nullable(false);
            $table->text('description')->nullable(false);

            // Foreign keys
            $table->unsignedBigInteger('publication_id')->nullable(false);
            $table->foreign('publication_id')->references('id')->on('publications');

            $table->timestamps();
        });

        // Table Seances
        Schema::create('sessions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('no_session')->nullable(false);
            $table->integer('no_week')->nullable(false);

            // Foreign keys
            $table->unsignedBigInteger('week_id')->nullable(false);
            $table->foreign('week_id')->references('id')->on('weeks');

            $table->timestamps();
        });

        // Table ta_utilisateurs_publications
        Schema::create('user_publication', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false);
            $table->unsignedBigInteger('publication_id')->nullable(false);
            $table->primary(['user_id', 'publication_id']); // Sets composite primary key
            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('publication_id')->references('id')->on('publications');

            $table->softDeletes(); // Deleted_at
            $table->text('completed_sequence')->nullable(true); // Will store serialize array

            // Foreign keys
            $table->unsignedBigInteger('type_subscription_id')->nullable(false);
            $table->foreign('type_subscription_id')->references('id')->on('type_subscriptions');

            $table->timestamps();
        });

        // Table ta_seance_entrainement
        Schema::create('session_training', function (Blueprint $table) {
            $table->unsignedBigInteger('session_id')->nullable(false);
            $table->unsignedBigInteger('training_id')->nullable(false);
            $table->primary(['session_id', 'training_id']); // Sets composite primary key
            // Foreign keys
            $table->foreign('session_id')->references('id')->on('sessions');
            $table->foreign('training_id')->references('id')->on('trainings');

            $table->timestamps();
        });

        // Table ta_equipement_exercices
        Schema::create('equipment_exercice', function (Blueprint $table) {
            $table->unsignedBigInteger('equipment_id')->nullable(false);
            $table->unsignedBigInteger('exercice_id')->nullable(false);
            $table->primary(['equipment_id', 'exercice_id']); // Sets composite primary key
            // Foreign keys
            $table->foreign('equipment_id')->references('id')->on('equipments');
            $table->foreign('exercice_id')->references('id')->on('exercices');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //disable FK
        Schema::disableForeignKeyConstraints();

        // Drop every tables
        Schema::dropIfExists('provinces');
        Schema::dropIfExists('publications');
        Schema::dropIfExists('equipment_exercice');
        Schema::dropIfExists('session_training');
        Schema::dropIfExists('user_publication');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('square');

        Schema::dropIfExists('user_status');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('tokens');
        Schema::dropIfExists('user_position');
        Schema::dropIfExists('type_subscriptions');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('type_visibilities');
        Schema::dropIfExists('type_publications');
        Schema::dropIfExists('equipments');
        Schema::dropIfExists('exercices');
        Schema::dropIfExists('trainings');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('weeks');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('positions');


        // Revert changes made to users table
        if(schema::hasTable('users', function(Blueprint $table){
            $table->dropColumn('deleted_at');
            $table->renameColumn('firstname', 'name')->nullable(true);
            $table->dropColumn('lastname');
            $table->dropColumn('title');
            $table->dropColumn('payment_pass');
            $table->dropColumn('profile_done');
            $table->dropColumn('id_client_square');
            $table->dropColumn('id_card_square');
            $table->dropColumn('id_subscription_square');
            $table->dropColumn('google_client');
            $table->dropColumn('facebook_client');
        }));

        //Enable FK
      Schema::enableForeignKeyConstraints();
    }
}
