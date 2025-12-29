# Article Automation System

Full-stack app that scrapes articles from BeyondChats, uses AI to improve them, and displays everything in a web interface.

## How it works

**Phase 1 - Scraping:**
- Node.js script scrapes last 5 articles from beyondchats.com/blogs
- Stores them in MySQL via Laravel API

**Phase 2 - AI Enhancement:**
- Searches article title on Google using SerpAPI
- Scrapes top 2 competitor articles
- Uses OpenAI to rewrite article based on competitors
- Saves updated version with references

**Phase 3 - Frontend:**
- React app displays all articles
- Shows both original and AI-enhanced versions
- Responsive design with Tailwind

## Tech Stack

**Backend:**
- Laravel 9 (PHP 8.0+)
- MySQL 8.0
- REST API

**Frontend:**
- React 18
- Tailwind CSS
- Axios

**Automation:**
- Node.js
- OpenAI GPT-4
- SerpAPI
- Cheerio

## Setup

### Backend

```bash
cd backend/laravel-api
composer install
cp .env.example .env
# configure DB settings in .env
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend/react-ui
npm install
npm start
```

### Automation Scripts

```bash
cd scripts/article-automation
npm install
cp .env.example .env
# add your API keys
node scraper.js
node automation.js
```

## API Endpoints

- `GET /api/articles` - Get all articles
- `GET /api/articles/{id}` - Get single article
- `POST /api/articles` - Create article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article

## Environment Variables

**Backend (.env)**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=article_automation
DB_USERNAME=root
DB_PASSWORD=
```

**Automation (.env)**
```
API_BASE_URL=http://localhost:8000/api
SERPAPI_KEY=your_key
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
```

## Known Issues

- OpenAI API needs credits
- Scraper sometimes picks up wrong links
- No rate limiting yet

## TODO

- Add pagination
- Implement search
- Better error handling
- Add tests

## Author

Built for web development assignment
