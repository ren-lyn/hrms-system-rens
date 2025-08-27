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
        Schema::create('evaluation_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_questionnaire_id')->constrained()->onDelete('cascade');
            $table->foreignId('evaluator_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('evaluatee_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade');
            $table->datetime('assigned_at');
            $table->datetime('completed_at')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->json('responses')->nullable(); // Store answers to questions
            $table->decimal('total_score', 5, 2)->nullable();
            $table->text('comments')->nullable();
            $table->timestamps();

            $table->index(['evaluator_id', 'status']);
            $table->index(['evaluatee_id', 'status']);
            $table->index('evaluation_questionnaire_id');
            $table->unique(['evaluation_questionnaire_id', 'evaluator_id', 'evaluatee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_assignments');
    }
};