<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionnaireQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_questionnaire_id',
        'question_text',
        'question_type',
        'options',
        'min_score',
        'max_score',
        'order',
        'is_required',
        'category',
        'description',
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
    ];

    public function questionnaire()
    {
        return $this->belongsTo(EvaluationQuestionnaire::class, 'evaluation_questionnaire_id');
    }

    // Scope for ordering
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }
}