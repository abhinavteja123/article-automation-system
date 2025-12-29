<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->string('source_url');
            $table->enum('version', ['original', 'updated'])->default('original');
            $table->unsignedBigInteger('original_article_id')->nullable();
            $table->text('references')->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('original_article_id')
                  ->references('id')
                  ->on('articles')
                  ->onDelete('cascade');

            // Indexes for better query performance
            $table->index('version');
            $table->index('original_article_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
};
