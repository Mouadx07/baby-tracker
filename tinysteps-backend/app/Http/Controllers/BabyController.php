<?php

namespace App\Http\Controllers;

use App\Models\Baby;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BabyController extends Controller
{
    public function index(Request $request)
    {
        $babies = $request->user()->babies;
        return response()->json($babies);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|string',
            'birth_date' => 'required|date',
            'theme_color' => 'required|string',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'gender', 'birth_date', 'theme_color']);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            // Save relative path to database
            $data['avatar_url'] = $path;
        }

        $baby = $request->user()->babies()->create($data);

        return response()->json($baby, 201);
    }

    public function update(Request $request, $id)
    {
        $baby = $request->user()->babies()->findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'theme_color' => 'sometimes|required|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->only(['name', 'theme_color']);

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($baby->avatar_url) {
                // Get the raw attribute value (relative path) before accessor
                $oldPath = $baby->getRawOriginal('avatar_url');
                // Delete from storage using Storage facade
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            
            // Store new image to avatars folder on public disk
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Save relative path to database
            $data['avatar_url'] = $path;
        }

        $baby->update($data);

        // Refresh to get the accessor value
        $baby->refresh();

        return response()->json($baby);
    }

    public function destroy(Request $request, $id)
    {
        $baby = $request->user()->babies()->findOrFail($id);

        // Delete avatar if exists
        if ($baby->avatar_url) {
            // Get the raw attribute value (relative path) before accessor
            $oldPath = $baby->getRawOriginal('avatar_url');
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $baby->delete();

        return response()->json(['message' => 'Baby profile deleted successfully'], 200);
    }
}
