<?php

namespace App\Http\Controllers;

use App\Models\AchievedMilestone;
use App\Models\Baby;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MilestoneController extends Controller
{
    public function index(Request $request, $babyId)
    {
        // Verify baby belongs to authenticated user
        $baby = $request->user()->babies()->findOrFail($babyId);

        $achievedMilestones = AchievedMilestone::where('baby_id', $babyId)
            ->orderBy('achieved_at', 'desc')
            ->get();

        return response()->json($achievedMilestones);
    }

    public function store(Request $request, $babyId)
    {
        // Verify baby belongs to authenticated user
        $baby = $request->user()->babies()->findOrFail($babyId);

        $request->validate([
            'milestone_id' => 'required|integer|min:1|max:12',
            'achieved_at' => 'required|date',
            'photo' => 'nullable|image|max:2048',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Parse and format the date to ensure it's just a date (no time)
        $achievedAt = \Carbon\Carbon::parse($request->input('achieved_at'))->startOfDay();
        $today = \Carbon\Carbon::today()->startOfDay();

        // Validate that the date is not in the future
        if ($achievedAt->gt($today)) {
            return response()->json([
                'message' => 'The achieved_at date must be today or earlier.',
                'errors' => [
                    'achieved_at' => ['The achieved_at date must be today or earlier.']
                ]
            ], 422);
        }

        $achievedAtFormatted = $achievedAt->format('Y-m-d');

        $data = [
            'baby_id' => $babyId,
            'milestone_id' => $request->input('milestone_id'),
            'achieved_at' => $achievedAtFormatted,
            'notes' => $request->input('notes'),
        ];

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('milestones', 'public');
            $data['photo_url'] = asset('storage/' . $path);
        }

        $achievedMilestone = AchievedMilestone::create($data);

        return response()->json($achievedMilestone, 201);
    }

    public function destroy(Request $request, $babyId, $id)
    {
        // Verify baby belongs to authenticated user
        $baby = $request->user()->babies()->findOrFail($babyId);

        // Verify milestone belongs to this baby
        $achievedMilestone = AchievedMilestone::where('baby_id', $babyId)
            ->findOrFail($id);

        // Delete photo if exists
        if ($achievedMilestone->photo_url) {
            $path = str_replace(asset('storage/'), '', $achievedMilestone->photo_url);
            Storage::disk('public')->delete($path);
        }

        $achievedMilestone->delete();

        return response()->json(['message' => 'Milestone deleted successfully'], 200);
    }
}

