<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationQuestionnaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'created_by',
        'is_template',
        'template_source_id',
        'evaluation_period',
        'due_date',
        'instructions',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'is_template' => 'boolean',
    ];

    public function questions()
    {
        return $this->hasMany(QuestionnaireQuestion::class);
    }

    public function assignments()
    {
        return $this->hasMany(EvaluationAssignment::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function templateSource()
    {
        return $this->belongsTo(EvaluationQuestionnaire::class, 'template_source_id');
    }

    public function clones()
    {
        return $this->hasMany(EvaluationQuestionnaire::class, 'template_source_id');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeTemplates($query)
    {
        return $query->where('is_template', true);
    }
}