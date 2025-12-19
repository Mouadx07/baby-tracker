<?php

namespace App\Http\Controllers;

use App\Models\GrowthRecord;
use Illuminate\Http\Request;

class GrowthController extends Controller
{
    public function index(Request $request, $babyId = null)
    {
        // Support both route parameter and query parameter
        $baby_id = $babyId ?? $request->input('baby_id');
        
        if (!$baby_id) {
            return response()->json(['error' => 'Baby ID is required'], 400);
        }

        $records = GrowthRecord::where('baby_id', $baby_id)
            ->orderBy('recorded_at', 'asc') // Oldest to newest
            ->get();

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $request->validate([
            'baby_id' => 'required|exists:babies,id',
            'weight' => 'required|numeric|min:0',
            'height' => 'required|numeric|min:0',
            'recorded_at' => 'required|date',
        ]);

        $record = GrowthRecord::create($request->all());

        return response()->json($record, 201);
    }

    public function latest(Request $request, $babyId)
    {
        $record = GrowthRecord::where('baby_id', $babyId)
            ->orderBy('recorded_at', 'desc')
            ->first();

        if (!$record) {
            return response()->json(['message' => 'No growth records found'], 404);
        }

        return response()->json($record);
    }
}
