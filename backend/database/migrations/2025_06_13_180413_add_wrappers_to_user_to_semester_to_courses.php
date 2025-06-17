<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_to_semester_to_courses', function (Blueprint $table) {
            // Add a new column
            $table->json('wrappers')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_to_semester_to_courses', function (Blueprint $table) {
            //
            $table->dropColumn(['wrappers']);

        });
    }
};