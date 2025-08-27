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
        Schema::create('questionnaire_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_questionnaire_id')->constrained()->onDelete('cascade');
            $table->text('question_text');
            $table->enum('question_type', ['rating', 'text', 'multiple_choice', 'yes_no', 'scale'])->default('rating');
            $table->json('options')->nullable(); // For multiple choice or other option-based questions
            $table->integer('min_score')->default(0);
            $table->integer('max_score')->default(10);
            $table->integer('order')->default(0);
            $table->boolean('is_required')->default(true);
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['evaluation_questionnaire_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questionnaire_questions');
    }
};