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
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'references' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
        return $this->hasMany(Article::class, 'original_article_id');
    }
}
