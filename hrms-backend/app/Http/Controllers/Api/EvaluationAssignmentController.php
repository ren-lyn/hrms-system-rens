<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvaluationAssignment;
use App\Models\EvaluationQuestionnaire;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EvaluationAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $query = EvaluationAssignment::with([
            'questionnaire',
            'evaluator',
            'evaluatee',
            'assignedBy'
        ])->orderBy('assigned_at', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by evaluator
        if ($request->filled('evaluator_id')) {
            $query->where('evaluator_id', $request->evaluator_id);
        }

        // Filter by evaluatee
        if ($request->filled('evaluatee_id')) {
            $query->where('evaluatee_id', $request->evaluatee_id);
        }

        // Filter by questionnaire
        if ($request->filled('questionnaire_id')) {
            $query->where('evaluation_questionnaire_id', $request->questionnaire_id);
        }

        $assignments = $query->get();

        return response()->json($assignments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'evaluation_questionnaire_id' => 'required|exists:evaluation_questionnaires,id',
            'assignments' => 'required|array|min:1',
            'assignments.*.evaluator_id' => 'required|exists:users,id',
            'assignments.*.evaluatee_id' => 'required|exists:users,id',
        ]);

        $questionnaire = EvaluationQuestionnaire::findOrFail($validated['evaluation_questionnaire_id']);

        if ($questionnaire->status !== 'published') {
            return response()->json([
                'message' => 'Cannot assign unpublished questionnaire'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $createdAssignments = [];

            foreach ($validated['assignments'] as $assignmentData) {
                // Check if assignment already exists
                $existingAssignment = EvaluationAssignment::where([
                    'evaluation_questionnaire_id' => $validated['evaluation_questionnaire_id'],
                    'evaluator_id' => $assignmentData['evaluator_id'],
                    'evaluatee_id' => $assignmentData['evaluatee_id'],
                ])->first();

                if ($existingAssignment) {
                    continue; // Skip duplicate assignments
                }

                $assignment = EvaluationAssignment::create([
                    'evaluation_questionnaire_id' => $validated['evaluation_questionnaire_id'],
                    'evaluator_id' => $assignmentData['evaluator_id'],
                    'evaluatee_id' => $assignmentData['evaluatee_id'],
                    'assigned_by' => Auth::id(),
                    'assigned_at' => now(),
                    'status' => 'pending',
                ]);

                $assignment->load(['questionnaire', 'evaluator', 'evaluatee', 'assignedBy']);
                $createdAssignments[] = $assignment;
            }

            DB::commit();

            return response()->json([
                'message' => 'Evaluations assigned successfully',
                'data' => $createdAssignments
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error creating assignments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $assignment = EvaluationAssignment::with([
            'questionnaire.questions' => function($query) {
                $query->ordered();
            },
            'evaluator',
            'evaluatee',
            'assignedBy'
        ])->findOrFail($id);

        return response()->json($assignment);
    }

    public function update(Request $request, $id)
    {
        $assignment = EvaluationAssignment::findOrFail($id);

        $validated = $request->validate([
            'responses' => 'required|array',
            'total_score' => 'nullable|numeric',
            'comments' => 'nullable|string',
            'status' => 'in:in_progress,completed',
        ]);

        $assignment->update([
            'responses' => $validated['responses'],
            'total_score' => $validated['total_score'],
            'comments' => $validated['comments'],
            'status' => $validated['status'],
            'completed_at' => $validated['status'] === 'completed' ? now() : null,
        ]);

        $assignment->load(['questionnaire', 'evaluator', 'evaluatee']);

        return response()->json([
            'message' => 'Evaluation updated successfully',
            'data' => $assignment
        ]);
    }

    public function destroy($id)
    {
        $assignment = EvaluationAssignment::findOrFail($id);

        if ($assignment->status === 'completed') {
            return response()->json([
                'message' => 'Cannot delete completed evaluation'
            ], 422);
        }

        $assignment->delete();

        return response()->json([
            'message' => 'Assignment deleted successfully'
        ]);
    }

    public function getMyAssignments(Request $request)
    {
        $query = EvaluationAssignment::with([
            'questionnaire',
            'evaluatee',
            'assignedBy'
        ])->where('evaluator_id', Auth::id())
          ->orderBy('assigned_at', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $assignments = $query->get();

        return response()->json($assignments);
    }

    public function startEvaluation($id)
    {
        $assignment = EvaluationAssignment::findOrFail($id);

        if ($assignment->evaluator_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized to start this evaluation'
            ], 403);
        }

        if ($assignment->status !== 'pending') {
            return response()->json([
                'message' => 'Evaluation is not in pending status'
            ], 422);
        }

        $assignment->update(['status' => 'in_progress']);

        return response()->json([
            'message' => 'Evaluation started successfully',
            'data' => $assignment
        ]);
    }

    public function submitEvaluation(Request $request, $id)
    {
        $assignment = EvaluationAssignment::findOrFail($id);

        if ($assignment->evaluator_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized to submit this evaluation'
            ], 403);
        }

        $validated = $request->validate([
            'responses' => 'required|array',
            'comments' => 'nullable|string',
        ]);

        // Calculate total score based on responses
        $totalScore = 0;
        $responseCount = 0;

        foreach ($validated['responses'] as $questionId => $response) {
            if (is_numeric($response)) {
                $totalScore += $response;
                $responseCount++;
            }
        }

        $averageScore = $responseCount > 0 ? $totalScore / $responseCount : 0;

        $assignment->update([
            'responses' => $validated['responses'],
            'total_score' => $averageScore,
            'comments' => $validated['comments'],
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $assignment->load(['questionnaire', 'evaluator', 'evaluatee']);

        return response()->json([
            'message' => 'Evaluation submitted successfully',
            'data' => $assignment
        ]);
    }

    public function saveDraft(Request $request, $id)
    {
        $assignment = EvaluationAssignment::findOrFail($id);

        if ($assignment->evaluator_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized to save this evaluation'
            ], 403);
        }

        $validated = $request->validate([
            'responses' => 'required|array',
            'comments' => 'nullable|string',
        ]);

        $assignment->update([
            'responses' => $validated['responses'],
            'comments' => $validated['comments'],
            'status' => 'in_progress',
        ]);

        return response()->json([
            'message' => 'Draft saved successfully',
            'data' => $assignment
        ]);
    }

    public function bulkAssign(Request $request)
    {
        $validated = $request->validate([
            'evaluation_questionnaire_id' => 'required|exists:evaluation_questionnaires,id',
            'evaluator_ids' => 'required|array|min:1',
            'evaluator_ids.*' => 'exists:users,id',
            'evaluatee_ids' => 'required|array|min:1',
            'evaluatee_ids.*' => 'exists:users,id',
        ]);

        $questionnaire = EvaluationQuestionnaire::findOrFail($validated['evaluation_questionnaire_id']);

        if ($questionnaire->status !== 'published') {
            return response()->json([
                'message' => 'Cannot assign unpublished questionnaire'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $createdAssignments = [];

            foreach ($validated['evaluator_ids'] as $evaluatorId) {
                foreach ($validated['evaluatee_ids'] as $evaluateeId) {
                    // Skip self-evaluation unless explicitly allowed
                    if ($evaluatorId === $evaluateeId) {
                        continue;
                    }

                    // Check if assignment already exists
                    $existingAssignment = EvaluationAssignment::where([
                        'evaluation_questionnaire_id' => $validated['evaluation_questionnaire_id'],
                        'evaluator_id' => $evaluatorId,
                        'evaluatee_id' => $evaluateeId,
                    ])->first();

                    if ($existingAssignment) {
                        continue; // Skip duplicate assignments
                    }

                    $assignment = EvaluationAssignment::create([
                        'evaluation_questionnaire_id' => $validated['evaluation_questionnaire_id'],
                        'evaluator_id' => $evaluatorId,
                        'evaluatee_id' => $evaluateeId,
                        'assigned_by' => Auth::id(),
                        'assigned_at' => now(),
                        'status' => 'pending',
                    ]);

                    $assignment->load(['questionnaire', 'evaluator', 'evaluatee', 'assignedBy']);
                    $createdAssignments[] = $assignment;
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Bulk assignments created successfully',
                'data' => $createdAssignments,
                'count' => count($createdAssignments)
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error creating bulk assignments',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}