<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\EmployeeEvaluationController;
use App\Http\Controllers\Api\EvaluationQuestionnaireController;
use App\Http\Controllers\Api\EvaluationAssignmentController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Employee management
    Route::apiResource('employees', EmployeeController::class);
    
    // Legacy evaluation routes (for compatibility)
    Route::apiResource('evaluations', EvaluationController::class);
    Route::apiResource('employee-evaluations', EmployeeEvaluationController::class);
    
    // New comprehensive evaluation system
    Route::prefix('evaluation')->group(function () {
        // Questionnaire management
        Route::apiResource('questionnaires', EvaluationQuestionnaireController::class);
        Route::post('questionnaires/{id}/publish', [EvaluationQuestionnaireController::class, 'publish']);
        Route::post('questionnaires/{id}/unpublish', [EvaluationQuestionnaireController::class, 'unpublish']);
        Route::post('questionnaires/{id}/duplicate', [EvaluationQuestionnaireController::class, 'duplicate']);
        Route::get('templates', [EvaluationQuestionnaireController::class, 'getTemplates']);
        
        // Assignment management
        Route::apiResource('assignments', EvaluationAssignmentController::class);
        Route::post('assignments/bulk', [EvaluationAssignmentController::class, 'bulkAssign']);
        Route::get('my-assignments', [EvaluationAssignmentController::class, 'getMyAssignments']);
        Route::post('assignments/{id}/start', [EvaluationAssignmentController::class, 'startEvaluation']);
        Route::post('assignments/{id}/submit', [EvaluationAssignmentController::class, 'submitEvaluation']);
        Route::post('assignments/{id}/save-draft', [EvaluationAssignmentController::class, 'saveDraft']);
    });
});
