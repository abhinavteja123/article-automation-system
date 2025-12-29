<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'content',
        'source_url',
        'version',
        'original_article_id',
        'references',
        'is_enhanced',
        'enhanced_by',
        'enhanced_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'references' => 'array',
        'is_enhanced' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'enhanced_at' => 'datetime',
    ];

    /**
     * Get the original article if this is an updated version.
     */
    public function originalArticle()
    {
        return $this->belongsTo(Article::class, 'original_article_id');
    }

    /**
     * Get all updated versions of this article.
     */
    public function updatedVersions()
    {
        return $this->hasMany(Article::class, 'original_article_id')->orderBy('version', 'desc');
    }

    /**
     * Get the latest enhanced version.
     */
    public function latestVersion()
    {
        return $this->hasOne(Article::class, 'original_article_id')->latest('version');
    }
}
