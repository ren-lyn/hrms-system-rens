<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\JobPostingController;
use App\Http\Controllers\API\ApplicantController;
use App\Http\Controllers\API\EmployeeEvaluationController;
use App\Http\Controllers\API\EvaluationController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/job-postings', [JobPostingController::class, 'index']);
    Route::post('/job-postings', [JobPostingController::class, 'store']);
    Route::put('/job-postings/{id}', [JobPostingController::class, 'update']);
    Route::delete('/job-postings/{id}', [JobPostingController::class, 'destroy']);
});

// Route::middleware(['auth:sanctum', 'role:HR Assistant'])->group(function () {
//     Route::put('/employees/{id}', [EmployeeController::class, 'update']);
//     Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
// });

Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
});


Route::get('/employees', [EmployeeController::class, 'index']);
Route::post('/employees', [EmployeeController::class, 'store']);

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::post('/register', [ApplicantController::class, 'register']);

Route::get('/test', function () {
    return response()->json(['message' => 'Laravel API is working']);
});


Route::middleware(['auth:sanctum', 'role:HR Assistant'])->group(function () {
    Route::get('/evaluations', [EmployeeEvaluationController::class, 'index']);
    Route::post('/evaluations', [EmployeeEvaluationController::class, 'store']);
    Route::get('/evaluations/{id}', [EmployeeEvaluationController::class, 'show']);
    Route::put('/evaluations/{id}', [EmployeeEvaluationController::class, 'update']);
    Route::delete('/evaluations/{id}', [EmployeeEvaluationController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/evaluations', [EvaluationController::class, 'index']);
    Route::get('/evaluations/{id}', [EvaluationController::class, 'show']);
    Route::post('/evaluations', [EvaluationController::class, 'store']);
    Route::put('/evaluations/{id}', [EvaluationController::class, 'update']);
    Route::delete('/evaluations/{id}', [EvaluationController::class, 'destroy']);
});
