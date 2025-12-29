# Article Automation System

Full-stack app that scrapes articles from BeyondChats, uses AI to improve them with version tracking, and displays everything in a web interface.

## How it works

**Phase 1 - Scraping:**
- Node.js script scrapes last 5 articles from beyondchats.com/blogs
- Stores them in MySQL via Laravel API

**Phase 2 - AI Enhancement with Versioning:**
- Searches article title on Google using SerpAPI
- Scrapes top 2 competitor articles
- Uses Google Gemini to rewrite article based on competitors
- Creates new enhanced versions (v1, v2, v3...) each time you run automation
- Keeps all previous versions for comparison
- Saves each version with references and metadata

**Phase 3 - Frontend:**
- React app displays all articles
- Shows both original and AI-enhanced versions
- Compare view with version selector
- View any previous enhancement iteration
- Responsive design with Tailwind

## Architecture Diagram

```
BeyondChats Blog
      |
      v
[Scraper.js] -----> [Laravel API] -----> [MySQL Database]
                         ^                      |
                         |                      |
                         |                      v
                    [automation.js] <----- fetch articles
                         |
                         v
                  [SerpAPI/Google] ---> scrape competitors
                         |
                         v
                    [OpenAI API] ---> generate new article
                         |
                         v
                  [Laravel API] ---> save updated article
                         |
                         v
                  [React Frontend] ---> display to users
```

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
- Google Gemini AI
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
GEMINI_API_KEY=your_key
```

## Known Issues

- Gemini API needs API key (free tier available)
- Scraper sometimes picks up wrong links
- No rate limiting yet

## Features

✨ **Landing Page** - Welcome page with project overview and feature highlights

🔍 **Search** - Search articles by title, content, or URL in real-time

📊 **Compare View** - Side-by-side comparison of original vs AI-enhanced articles with statistics

🔄 **Version Control** - Keep history of all enhancement iterations (v1, v2, v3...)
   - Select any version to compare with original
   - Track when each version was created
   - See which AI model generated each version

🤖 **Automation Control** - Trigger scraping and AI enhancement from the frontend with live logs
   - Each run creates a new version instead of overwriting
   - All previous versions remain accessible

📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

🎨 **Smooth Animations** - Fade-in effects and hover animations for better UX

## Documentation

- [VERSIONING_GUIDE.md](./VERSIONING_GUIDE.md) - Detailed guide on article versioning system
- [SERVER_README.md](./scripts/article-automation/SERVER_README.md) - Automation server documentation

## TODO

- Add pagination
- Version diff view (show exact changes between versions)
- Better error handling
- Add tests

## Author

Built for web development assignment
