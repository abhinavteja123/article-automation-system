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
        Schema::table('articles', function (Blueprint $table) {
            $table->integer('version')->default(1)->after('is_enhanced');
            $table->unsignedBigInteger('original_article_id')->nullable()->after('version');
            $table->timestamp('enhanced_at')->nullable()->after('updated_at');
            
            $table->index('original_article_id');
            $table->index('version');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['original_article_id']);
            $table->dropIndex(['version']);
            $table->dropColumn(['version', 'original_article_id', 'enhanced_at']);
        });
    }
};
