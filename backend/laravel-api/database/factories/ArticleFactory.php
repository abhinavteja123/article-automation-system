<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Article::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $title = $this->faker->sentence(6);
        
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $this->faker->paragraphs(5, true),
            'source_url' => $this->faker->url(),
            'version' => 'original',
            'original_article_id' => null,
            'references' => null,
        ];
    }

    /**
     * Indicate that the article is an updated version.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function updated($originalArticleId)
    {
        return $this->state(function (array $attributes) use ($originalArticleId) {
            return [
                'version' => 'updated',
                'original_article_id' => $originalArticleId,
                'references' => json_encode([
                    'https://example.com/reference1',
                    'https://example.com/reference2'
                ]),
            ];
        });
    }
}
