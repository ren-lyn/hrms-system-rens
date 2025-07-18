<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'evaluator_id',
        'punctuality',
        'attitude',
        'quality_of_work',
        'initiative',
        'teamwork',
        'trustworthiness',
        'total_score',
        'status',
        'remarks',
        'comments', // ✅ include new comments field
    ];

    // ✅ Automatically cast `remarks` to/from JSON array
    protected $casts = [
        'remarks' => 'array',
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}
