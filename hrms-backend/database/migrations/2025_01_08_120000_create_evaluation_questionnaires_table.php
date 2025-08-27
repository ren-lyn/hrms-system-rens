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
        Schema::create('evaluation_questionnaires', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->boolean('is_template')->default(false);
            $table->foreignId('template_source_id')->nullable()->constrained('evaluation_questionnaires')->onDelete('set null');
            $table->string('evaluation_period')->nullable();
            $table->datetime('due_date')->nullable();
            $table->text('instructions')->nullable();
            $table->timestamps();

            $table->index(['status', 'is_template']);
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_questionnaires');
    }
};