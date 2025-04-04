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
        Schema::table('courses_prerequisites', function (Blueprint $table) {
            $table->unsignedBigInteger('course_id_two')->nullable()->change(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses_prerequisites', function (Blueprint $table) {
            $table->unsignedBigInteger('column_name')->nullable(false)->change();
        });
    }
};
