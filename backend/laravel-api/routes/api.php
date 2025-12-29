<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// articles api
Route::prefix('articles')->group(function () {
    Route::get('/', [ArticleController::class, 'index']);
    Route::post('/', [ArticleController::class, 'store']);
    // Run automation - must be before {id} routes
    Route::post('/run-automation', [ArticleController::class, 'runAutomation']);
    // Comparison - must be before {id} show route
    Route::get('/{id}/comparison', [ArticleController::class, 'getComparison']);
    // Dynamic routes last
    Route::get('/{id}', [ArticleController::class, 'show']);
    Route::put('/{id}', [ArticleController::class, 'update']);
    Route::delete('/{id}', [ArticleController::class, 'destroy']);
});
