# Article Versioning System

## Overview

The system now supports multiple enhanced versions of each article, allowing you to:
- Keep history of all AI enhancements (v1, v2, v3, etc.)
- Compare any version with the original article
- Track when each version was created and by which AI model

## Database Schema Changes

### New Columns in `articles` table:
- `version` (integer): Version number (1, 2, 3, etc.)
- `original_article_id` (bigint): References the original article ID
- `is_enhanced` (boolean): Marks if article is AI-enhanced
- `enhanced_by` (string): Name of AI model used (e.g., "Google Gemini 2.5 Flash")
- `enhanced_at` (timestamp): When the enhancement was created

### Article Types:
1. **Original Articles**: `original_article_id` is NULL, version = 1
2. **Enhanced Articles**: `original_article_id` points to original, version = 1, 2, 3, etc.

## How It Works

### 1. Creating Enhanced Versions

When you run the automation script:

```bash
cd scripts/article-automation
npm run server   # Start automation server
```

Then from frontend at http://localhost:3000/automation, click "Run Automation"

**What happens:**
1. Script fetches all original articles
2. For each article:
   - Checks existing enhanced versions
   - Creates new version with incremented number (v1, v2, v3...)
   - Saves with title: "Article Title (Enhanced v2)"
3. Each version is stored as a separate database row

### 2. Viewing Versions

**Articles Page** (http://localhost:3000/articles):
- Shows all articles (originals + enhanced versions)
- Enhanced articles have badge showing version number
- Click "Compare" to view differences

**Compare Page** (http://localhost:3000/compare/{id}):
- Dropdown selector shows all available versions
- Select any version to compare with original
- Shows version creation date and AI model used
- Displays statistics (word count, improvement percentage)

### 3. API Endpoints

#### Get Comparison with Version Selection
```
GET /api/articles/{id}/comparison?version={version_number}
```

**Example:**
```bash
# Get latest version comparison
GET /api/articles/1/comparison

# Get specific version comparison
GET /api/articles/1/comparison?version=2
```

**Response:**
```json
{
  "success": true,
  "data": {
    "original": { ... },
    "enhanced": { ... }
  },
  "versions": [
    {
      "id": 15,
      "version": 3,
      "enhanced_at": "2024-12-29 10:30:00",
      "enhanced_by": "Google Gemini 2.5 Flash"
    },
    {
      "id": 12,
      "version": 2,
      "enhanced_at": "2024-12-28 15:20:00",
      "enhanced_by": "Google Gemini 2.5 Flash"
    },
    {
      "id": 10,
      "version": 1,
      "enhanced_at": "2024-12-27 09:15:00",
      "enhanced_by": "Google Gemini 2.5 Flash"
    }
  ]
}
```

#### Filter Articles by Original ID
```
GET /api/articles?original_article_id={id}
```

Returns all enhanced versions of a specific original article.

#### Get Only Original Articles
```
GET /api/articles?original_only=true
```

Returns only original articles (no enhanced versions).

## Database Migration

To apply the versioning changes:

```bash
cd backend/laravel-api
php artisan migrate
```

This will add the new columns to your existing `articles` table.

## Frontend Features

### Version Selector
- Located in the Compare page header
- Dropdown shows all versions with creation dates
- Select any version to view that comparison
- Shows total version count

### Version Badge
- Articles with enhancements show "Enhanced v{X}" badge
- Original articles show no badge or "Original" badge
- Color-coded for easy identification

## Example Workflow

1. **Initial Setup** (Already Done):
   - Original 5 articles scraped from BeyondChats
   - Stored in database as "original" articles

2. **First Enhancement Run**:
   - Click "Run Automation" in frontend
   - Creates 5 enhanced articles (v1 for each original)
   - Articles saved with title: "Title (Enhanced v1)"

3. **Second Enhancement Run** (New Feature!):
   - Click "Run Automation" again
   - Creates 5 new enhanced articles (v2 for each original)
   - Articles saved with title: "Title (Enhanced v2)"
   - Previous v1 versions remain in database

4. **Comparison**:
   - Go to any original article
   - Click "Compare"
   - Select version from dropdown (v1, v2, v3...)
   - View side-by-side comparison

## Benefits

### 1. History Tracking
- Keep all enhancement iterations
- See how AI improvements evolved over time
- Revert to previous versions if needed

### 2. A/B Testing
- Compare different AI enhancement approaches
- Evaluate which version performs better
- Choose best version for publication

### 3. Audit Trail
- Know when each version was created
- Track which AI model generated each version
- Maintain complete enhancement history

## Storage Considerations

Each enhanced version is a full copy of the article. With 5 original articles:
- Run 1: 5 originals + 5 enhanced (v1) = 10 total
- Run 2: 5 originals + 5 v1 + 5 v2 = 15 total
- Run 3: 5 originals + 5 v1 + 5 v2 + 5 v3 = 20 total

**Cleanup Strategy** (Optional):
You can delete old versions if storage is a concern:

```sql
-- Keep only latest 2 versions per article
DELETE FROM articles 
WHERE original_article_id IS NOT NULL 
AND version < (
  SELECT MAX(version) - 1 
  FROM articles a2 
  WHERE a2.original_article_id = articles.original_article_id
);
```

## Technical Details

### Automation Script Logic
```javascript
// Get latest version number
const existingVersions = await fetchVersions(originalArticle.id);
const nextVersion = Math.max(...existingVersions.map(v => v.version), 0) + 1;

// Create new enhanced version
await createEnhancedArticle({
  title: `${originalTitle} (Enhanced v${nextVersion})`,
  version: nextVersion,
  original_article_id: originalArticle.id,
  // ... other fields
});
```

### Database Relationships
```php
// Article Model
public function originalArticle() {
  return $this->belongsTo(Article::class, 'original_article_id');
}

public function updatedVersions() {
  return $this->hasMany(Article::class, 'original_article_id')
              ->orderBy('version', 'desc');
}

public function latestVersion() {
  return $this->hasOne(Article::class, 'original_article_id')
              ->latest('version');
}
```

## Future Enhancements

Potential improvements to the versioning system:

1. **Version Diff View**: Show exactly what changed between versions
2. **Version Rollback**: Restore a previous version as current
3. **Version Tags**: Label versions with custom tags (e.g., "production", "draft")
4. **Scheduled Enhancements**: Auto-create new versions periodically
5. **Version Analytics**: Track views/engagement per version
