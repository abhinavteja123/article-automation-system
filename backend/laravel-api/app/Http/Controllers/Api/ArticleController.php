<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ArticleController extends Controller
{
    public function index()
    {
        try {
            $articles = Article::orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $articles
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch articles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:articles,slug',
                'content' => 'required|string',
                'source_url' => 'required|url',
                'version' => ['required', Rule::in(['original', 'updated'])],
                'original_article_id' => 'nullable|exists:articles,id',
                'references' => 'nullable|json'
            ]);

            // auto generate slug if not provided
            if (!isset($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
                
                // make sure slug is unique
                $originalSlug = $validated['slug'];
                $counter = 1;
                while (Article::where('slug', $validated['slug'])->exists()) {
                    $validated['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            $article = Article::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Article created successfully',
                'data' => $article
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $article = Article::find($id);

            if (!$article) {
                return response()->json([
                    'success' => false,
                    'message' => 'Article not found'
                ], 404);
            }

            // load original article if this is an updated version
            if ($article->original_article_id) {
                $article->load('originalArticle');
            }

            // load updated versions if this is an original
            if ($article->version === 'original') {
                $article->load('updatedVersions');
            }

            return response()->json([
                'success' => true,
                'data' => $article
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified article.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $article = Article::find($id);

            if (!$article) {
                return response()->json([
                    'success' => false,
                    'message' => 'Article not found'
                ], 404);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|max:255|unique:articles,slug,' . $id,
                'content' => 'sometimes|required|string',
                'source_url' => 'sometimes|required|url',
                'version' => ['sometimes', 'required', Rule::in(['original', 'updated'])],
                'original_article_id' => 'nullable|exists:articles,id',
                'references' => 'nullable|json'
            ]);

            // Update slug if title is changed
            if (isset($validated['title']) && !isset($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
                
                // Ensure slug is unique
                $originalSlug = $validated['slug'];
                $counter = 1;
                while (Article::where('slug', $validated['slug'])->where('id', '!=', $id)->exists()) {
                    $validated['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            $article->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Article updated successfully',
                'data' => $article
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified article.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $article = Article::find($id);

            if (!$article) {
                return response()->json([
                    'success' => false,
                    'message' => 'Article not found'
                ], 404);
            }

            $article->delete();

            return response()->json([
                'success' => true,
                'message' => 'Article deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Run the automation script to enhance articles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function runAutomation()
    {
        try {
            // Get absolute path to script
            $scriptPath = realpath(base_path('../scripts/article-automation'));
            
            if (!$scriptPath || !file_exists($scriptPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Script directory not found',
                    'path' => base_path('../scripts/article-automation')
                ], 500);
            }
            
            // Build command based on OS
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                // Windows: Use cmd.exe with /c flag
                $scriptPath = str_replace('/', '\\', $scriptPath);
                $command = "cmd /c \"cd /d \"$scriptPath\" && node automation.js 2>&1\"";
            } else {
                // Unix/Linux/Mac
                $command = "cd \"$scriptPath\" && node automation.js 2>&1";
            }
            
            // Set longer timeout for automation
            set_time_limit(300); // 5 minutes
            
            // Execute command
            $output = [];
            $returnVar = 0;
            exec($command, $output, $returnVar);
            
            $outputText = implode("\n", $output);
            
            // Return success if we got any output
            if (!empty($outputText)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Automation executed',
                    'output' => $outputText,
                    'return_code' => $returnVar
                ], 200);
            }
            
            // No output means something went wrong
            return response()->json([
                'success' => false,
                'message' => 'Automation produced no output',
                'command' => $command,
                'return_code' => $returnVar,
                'script_path' => $scriptPath
            ], 500);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to run automation',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Get comparison between original and enhanced article.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getComparison($id)
    {
        try {
            $article = Article::find($id);

            if (!$article) {
                return response()->json([
                    'success' => false,
                    'message' => 'Article not found'
                ], 404);
            }

            $comparison = [];

            if ($article->version === 'original') {
                // If this is original, find its updated version
                $enhanced = Article::where('original_article_id', $id)
                    ->where('version', 'updated')
                    ->latest()
                    ->first();

                $comparison = [
                    'original' => $article,
                    'enhanced' => $enhanced
                ];
            } else {
                // If this is updated, find its original
                $original = Article::find($article->original_article_id);
                
                $comparison = [
                    'original' => $original,
                    'enhanced' => $article
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $comparison
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch comparison',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
