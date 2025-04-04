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
        Schema::create('courses_prerequisites', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('course_id');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->unsignedBigInteger('course_id_two')->nullable();
            $table->foreign('course_id_two')->references('id')->on('courses')->onDelete('cascade');
            $table->string('grade_requirement');
            $table->string('group');
            $table->text('text_requirement');
            $table->boolean('concurrent_enrollment');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses_prerequisites');
    }
};
