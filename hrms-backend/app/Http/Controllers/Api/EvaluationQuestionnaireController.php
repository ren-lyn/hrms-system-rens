<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvaluationQuestionnaire;
use App\Models\QuestionnaireQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EvaluationQuestionnaireController extends Controller
{
    public function index(Request $request)
    {
        $query = EvaluationQuestionnaire::with(['creator', 'questions'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by template type
        if ($request->filled('is_template')) {
            $query->where('is_template', $request->boolean('is_template'));
        }

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $questionnaires = $query->get();

        return response()->json($questionnaires);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,published,archived',
            'is_template' => 'boolean',
            'evaluation_period' => 'nullable|string',
            'due_date' => 'nullable|date',
            'instructions' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_type' => 'required|in:rating,text,multiple_choice,yes_no,scale',
            'questions.*.options' => 'nullable|array',
            'questions.*.min_score' => 'nullable|integer|min:0',
            'questions.*.max_score' => 'nullable|integer|min:1',
            'questions.*.is_required' => 'boolean',
            'questions.*.category' => 'nullable|string',
            'questions.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $questionnaire = EvaluationQuestionnaire::create([
                ...$validated,
                'created_by' => Auth::id(),
                'status' => $validated['status'] ?? 'draft',
            ]);

            foreach ($validated['questions'] as $index => $questionData) {
                QuestionnaireQuestion::create([
                    'evaluation_questionnaire_id' => $questionnaire->id,
                    'question_text' => $questionData['question_text'],
                    'question_type' => $questionData['question_type'],
                    'options' => $questionData['options'] ?? null,
                    'min_score' => $questionData['min_score'] ?? 0,
                    'max_score' => $questionData['max_score'] ?? 10,
                    'order' => $index + 1,
                    'is_required' => $questionData['is_required'] ?? true,
                    'category' => $questionData['category'] ?? null,
                    'description' => $questionData['description'] ?? null,
                ]);
            }

            DB::commit();

            $questionnaire->load(['questions', 'creator']);
            return response()->json([
                'message' => 'Evaluation questionnaire created successfully',
                'data' => $questionnaire
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error creating questionnaire',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $questionnaire = EvaluationQuestionnaire::with(['questions' => function($query) {
            $query->ordered();
        }, 'creator', 'assignments.evaluator', 'assignments.evaluatee'])
            ->findOrFail($id);

        return response()->json($questionnaire);
    }

    public function update(Request $request, $id)
    {
        $questionnaire = EvaluationQuestionnaire::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,published,archived',
            'evaluation_period' => 'nullable|string',
            'due_date' => 'nullable|date',
            'instructions' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.id' => 'nullable|exists:questionnaire_questions,id',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_type' => 'required|in:rating,text,multiple_choice,yes_no,scale',
            'questions.*.options' => 'nullable|array',
            'questions.*.min_score' => 'nullable|integer|min:0',
            'questions.*.max_score' => 'nullable|integer|min:1',
            'questions.*.is_required' => 'boolean',
            'questions.*.category' => 'nullable|string',
            'questions.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $questionnaire->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'status' => $validated['status'] ?? $questionnaire->status,
                'evaluation_period' => $validated['evaluation_period'],
                'due_date' => $validated['due_date'],
                'instructions' => $validated['instructions'],
            ]);

            // Delete existing questions and recreate them
            $questionnaire->questions()->delete();

            foreach ($validated['questions'] as $index => $questionData) {
                QuestionnaireQuestion::create([
                    'evaluation_questionnaire_id' => $questionnaire->id,
                    'question_text' => $questionData['question_text'],
                    'question_type' => $questionData['question_type'],
                    'options' => $questionData['options'] ?? null,
                    'min_score' => $questionData['min_score'] ?? 0,
                    'max_score' => $questionData['max_score'] ?? 10,
                    'order' => $index + 1,
                    'is_required' => $questionData['is_required'] ?? true,
                    'category' => $questionData['category'] ?? null,
                    'description' => $questionData['description'] ?? null,
                ]);
            }

            DB::commit();

            $questionnaire->load(['questions', 'creator']);
            return response()->json([
                'message' => 'Evaluation questionnaire updated successfully',
                'data' => $questionnaire
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error updating questionnaire',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $questionnaire = EvaluationQuestionnaire::findOrFail($id);
        
        // Check if questionnaire has assignments
        if ($questionnaire->assignments()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete questionnaire with existing assignments'
            ], 422);
        }

        $questionnaire->delete();

        return response()->json([
            'message' => 'Evaluation questionnaire deleted successfully'
        ]);
    }

    public function publish($id)
    {
        $questionnaire = EvaluationQuestionnaire::findOrFail($id);
        $questionnaire->update(['status' => 'published']);

        return response()->json([
            'message' => 'Questionnaire published successfully',
            'data' => $questionnaire
        ]);
    }

    public function unpublish($id)
    {
        $questionnaire = EvaluationQuestionnaire::findOrFail($id);
        $questionnaire->update(['status' => 'draft']);

        return response()->json([
            'message' => 'Questionnaire unpublished successfully',
            'data' => $questionnaire
        ]);
    }

    public function duplicate($id)
    {
        $original = EvaluationQuestionnaire::with('questions')->findOrFail($id);

        DB::beginTransaction();
        try {
            $newQuestionnaire = EvaluationQuestionnaire::create([
                'title' => $original->title . ' (Copy)',
                'description' => $original->description,
                'status' => 'draft',
                'created_by' => Auth::id(),
                'is_template' => $original->is_template,
                'template_source_id' => $original->id,
                'evaluation_period' => $original->evaluation_period,
                'instructions' => $original->instructions,
            ]);

            foreach ($original->questions as $question) {
                QuestionnaireQuestion::create([
                    'evaluation_questionnaire_id' => $newQuestionnaire->id,
                    'question_text' => $question->question_text,
                    'question_type' => $question->question_type,
                    'options' => $question->options,
                    'min_score' => $question->min_score,
                    'max_score' => $question->max_score,
                    'order' => $question->order,
                    'is_required' => $question->is_required,
                    'category' => $question->category,
                    'description' => $question->description,
                ]);
            }

            DB::commit();

            $newQuestionnaire->load(['questions', 'creator']);
            return response()->json([
                'message' => 'Questionnaire duplicated successfully',
                'data' => $newQuestionnaire
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error duplicating questionnaire',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTemplates()
    {
        $templates = EvaluationQuestionnaire::templates()
            ->with(['questions', 'creator'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($templates);
    }
}