<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BabyController;
use App\Http\Controllers\GrowthController;
use App\Http\Controllers\MilestoneController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/babies', [BabyController::class, 'index']);
    Route::post('/babies', [BabyController::class, 'store']);
    Route::put('/babies/{id}', [BabyController::class, 'update']);
    Route::delete('/babies/{id}', [BabyController::class, 'destroy']);
    Route::get('/growth', [GrowthController::class, 'index']);
    Route::post('/growth', [GrowthController::class, 'store']);
    Route::get('/babies/{id}/growth', [GrowthController::class, 'index']);
    Route::get('/babies/{id}/growth/latest', [GrowthController::class, 'latest']);
    Route::get('/babies/{id}/milestones', [MilestoneController::class, 'index']);
    Route::post('/babies/{id}/milestones', [MilestoneController::class, 'store']);
    Route::delete('/babies/{babyId}/milestones/{id}', [MilestoneController::class, 'destroy']);
});
