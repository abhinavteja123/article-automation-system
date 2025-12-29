# Article Automation System

A full-stack application that scrapes blog articles from BeyondChats, enhances them using AI, and displays them through a modern web interface. Built with Laravel, Node.js, and React.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 1: SCRAPING                       │
│                                                                 │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │   Node.js    │─scrape─▶│ BeyondChats  │                    │
│  │ scraper.js   │         │    Blogs     │                    │
│  └──────┬───────┘         └──────────────┘                    │
│         │                                                       │
│         │ POST /api/articles                                   │
│         ▼                                                       │
│  ┌──────────────────────────────────────┐                     │
│  │      Laravel REST API (Backend)       │                     │
│  │    ┌─────────────────────────────┐   │                     │
│  │    │   ArticleController (CRUD)   │   │                     │
│  │    └─────────────┬───────────────┘   │                     │
│  │                  │                    │                     │
│  │    ┌─────────────▼───────────────┐   │                     │
│  │    │      MySQL Database          │   │                     │
│  │    │  - id, title, content        │   │                     │
│  │    │  - version (original/updated)│   │                     │
│  │    │  - references                │   │                     │
│  │    └─────────────────────────────┘   │                     │
│  └──────────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2: AI ENHANCEMENT                      │
│                                                                 │
│  ┌──────────────┐    GET /api/articles    ┌───────────────┐   │
│  │   Node.js    │◀─────────────────────────│  Laravel API  │   │
│  │automation.js │                          └───────────────┘   │
│  └──────┬───────┘                                              │
│         │                                                       │
│         │ 1. Search title                                      │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │   SerpAPI    │  Returns top 2 competitor URLs               │
│  │ (Google Search)                                             │
│  └──────┬───────┘                                              │
│         │                                                       │
│         │ 2. Scrape content                                    │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │   Cheerio    │  Extract article content                     │
│  │ Web Scraper  │                                              │
│  └──────┬───────┘                                              │
│         │                                                       │
│         │ 3. Send to AI                                        │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │  OpenAI API  │  Rewrite & improve article                  │
│  │  (GPT-4o)    │                                              │
│  └──────┬───────┘                                              │
│         │                                                       │
│         │ 4. POST updated article                              │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │ Laravel API  │  Store with references                       │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 3: FRONTEND                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │          React Frontend (Tailwind CSS)           │          │
│  │  ┌────────────────────────────────────────────┐  │          │
│  │  │  HomePage - Article List                   │  │          │
│  │  │  - Statistics dashboard                    │  │          │
│  │  │  - Filter (all/original/updated)           │  │          │
│  │  │  - Article cards with metadata             │  │          │
│  │  └────────────────────────────────────────────┘  │          │
│  │  ┌────────────────────────────────────────────┐  │          │
│  │  │  ArticleDetailPage                         │  │          │
│  │  │  - Full content display                    │  │          │
│  │  │  - Version comparison                      │  │          │
│  │  │  - References list                         │  │          │
│  │  └────────────────────────────────────────────┘  │          │
│  └───────────────┬──────────────────────────────────┘          │
│                  │                                              │
│                  │ GET /api/articles                            │
│                  ▼                                              │
│  ┌──────────────────────────────────────────────────┐          │
│  │          Laravel REST API (Backend)              │          │
│  │          Returns JSON response                   │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Scraping Flow**: scraper.js → BeyondChats → Laravel API → MySQL
2. **Enhancement Flow**: Laravel API → automation.js → SerpAPI → Competitor Sites → OpenAI → Laravel API → MySQL
3. **Display Flow**: React UI → Laravel API → MySQL → JSON Response → React UI

## Features

- 📰 **Article Scraping**: Automatically fetches articles from BeyondChats blog
- 🤖 **AI Enhancement**: Uses OpenAI to improve and rewrite articles based on competitor research
- 🔍 **Google Search Integration**: Finds top competitor articles using SerpAPI
- 💾 **Version Control**: Maintains both original and AI-enhanced versions
- 🎨 **Modern UI**: Clean, responsive React interface with Tailwind CSS

## Tech Stack

**Backend:**
- Laravel 9.x (PHP 8.0+)
- MySQL 8.0
- RESTful API

**Frontend:**
- React 18
- Tailwind CSS
- Axios

**Automation:**
- Node.js
- OpenAI GPT-4
- SerpAPI (Google Search)
- Cheerio (web scraping)

## Prerequisites

- PHP >= 8.0
- Composer
- Node.js >= 16.x
- MySQL 8.0
- OpenAI API Key
- SerpAPI Key

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Assignment
```

### 2. Backend Setup (Laravel)

```bash
cd backend/laravel-api
composer install
cp .env.example .env
```

Configure your `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=article_automation
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Run migrations:
```bash
php artisan migrate
php artisan serve
```

Backend will run on `http://127.0.0.1:8000`

### 3. Frontend Setup (React)

```bash
cd frontend/react-ui
npm install
npm start
```

Frontend will run on `http://localhost:3000`

### 4. Automation Scripts Setup

```bash
cd scripts/article-automation
npm install
cp .env.example .env
```

Configure your `.env` file:
```env
API_BASE_URL=http://localhost:8000/api
BLOG_URL=https://beyondchats.com/blogs/
SERPAPI_KEY=your_serpapi_key
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
```

## Usage

### 1. Scrape Articles

Fetches the last 5 articles from BeyondChats blog:

```bash
cd scripts/article-automation
node scraper.js
```

### 2. Run AI Automation

Enhances articles with AI (requires OpenAI credits):

```bash
node automation.js
```

This will:
- Search Google for competitor articles
- Scrape competitor content
- Use AI to rewrite and improve articles
- Save enhanced versions with references

### 3. View in Browser

Open `http://localhost:3000` to see all articles in the web interface.

## API Endpoints

### Articles

- `GET /api/articles` - Get all articles
- `GET /api/articles/{id}` - Get single article
- `POST /api/articles` - Create new article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Article Title",
      "slug": "article-title",
      "content": "Article content...",
      "source_url": "https://...",
      "version": "original",
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

## Project Structure

```
Assignment/
├── backend/
│   └── laravel-api/          # Laravel API
│       ├── app/
│       ├── database/
│       └── routes/
├── frontend/
│   └── react-ui/             # React frontend
│       ├── src/
│       └── public/
├── scripts/
│   └── article-automation/   # Node.js automation
│       ├── scraper.js
│       ├── automation.js
│       └── .env
└── README.md
```

## Environment Variables

### Backend (.env)
- `DB_*` - Database configuration
- `APP_URL` - Application URL

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

### Automation (.env)
- `API_BASE_URL` - Laravel API endpoint
- `BLOG_URL` - Source blog URL
- `SERPAPI_KEY` - SerpAPI key for Google Search
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_MODEL` - GPT model to use

## Known Issues

- OpenAI API requires sufficient credits for automation script
- Scraper may occasionally pick up sidebar links
- Rate limiting not implemented yet

## Future Improvements

- [ ] Add pagination to frontend
- [ ] Implement search functionality
- [ ] Add rate limiting
- [ ] Better error handling
- [ ] Add unit tests
- [ ] Deploy to production

## Author

Built as part of a web development assignment.
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MySQL DB      │ ← Database (Railway)
└─────────────────┘

┌─────────────────┐
│  Node.js Scripts│ ← Automation Scripts
│  - Scraper      │   (Run locally or scheduled)
│  - AI Enhancer  │
└─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Laravel 9+**: PHP framework for REST APIs
- **MySQL**: Relational database
- **Eloquent ORM**: Database interactions
- **CORS Enabled**: Cross-origin resource sharing

### Automation
- **Node.js**: Runtime environment
- **Axios**: HTTP client
- **Cheerio**: Web scraping
- **SerpAPI**: Google search integration
- **OpenAI API**: GPT-4 for content generation
- **dotenv**: Environment configuration

### Frontend
- **React 18**: JavaScript library
- **React Router**: Navigation
- **Axios**: API communication
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-friendly

## ✨ Features

### Backend Features
- ✅ Full CRUD operations for articles
- ✅ Version tracking (original vs updated)
- ✅ Article relationships and references
- ✅ Request validation
- ✅ Proper HTTP status codes
- ✅ JSON responses
- ✅ Database migrations and factories

### Automation Features
- ✅ Web scraping with retry logic
- ✅ Pagination handling
- ✅ Google search integration
- ✅ Competitor content extraction
- ✅ AI-powered content rewriting
- ✅ Reference tracking
- ✅ Error handling and logging
- ✅ Rate limiting

### Frontend Features
- ✅ Article listing with filters
- ✅ Article detail view
- ✅ Version badges (Original/Updated)
- ✅ Side-by-side version comparison
- ✅ Reference section display
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Professional typography

## 📁 Project Structure

```
Assignment/
├── backend/
│   └── laravel-api/
│       ├── app/
│       │   ├── Http/Controllers/Api/
│       │   │   └── ArticleController.php
│       │   └── Models/
│       │       └── Article.php
│       ├── database/
│       │   ├── migrations/
│       │   │   └── 2024_01_01_000000_create_articles_table.php
│       │   └── factories/
│       │       └── ArticleFactory.php
│       ├── routes/
│       │   └── api.php
│       ├── config/
│       ├── .env.example
│       ├── composer.json
│       └── README.md
│
├── scripts/
│   └── article-automation/
│       ├── scraper.js          # Phase 1: Blog scraper
│       ├── automation.js        # Phase 2: AI enhancement
│       ├── package.json
│       ├── .env.example
│       └── .gitignore
│
├── frontend/
│   └── react-ui/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Navbar.js
│       │   │   ├── ArticleCard.js
│       │   │   ├── LoadingSpinner.js
│       │   │   └── ErrorMessage.js
│       │   ├── pages/
│       │   │   ├── HomePage.js
│       │   │   └── ArticleDetailPage.js
│       │   ├── services/
│       │   │   └── api.js
│       │   ├── App.js
│       │   └── index.js
│       ├── public/
│       ├── package.json
│       ├── tailwind.config.js
│       ├── .env.example
│       └── README.md
│
└── README.md (this file)
```

## 🚀 Setup Instructions

### Prerequisites

- **PHP** >= 8.0
- **Composer**
- **MySQL** >= 5.7
- **Node.js** >= 14
- **npm** or **yarn**
- **Git**

### 1. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend/laravel-api

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Configure database in .env
# DB_DATABASE=article_automation
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Generate application key
php artisan key:generate

# Create database
mysql -u root -p
CREATE DATABASE article_automation;
EXIT;

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

Backend will run at: **http://localhost:8000**

### 2. Scripts Setup (Node.js)

```bash
# Navigate to scripts directory
cd scripts/article-automation

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env file
# API_BASE_URL=http://localhost:8000/api
# SERPAPI_KEY=your_serpapi_key
# OPENAI_API_KEY=your_openai_key
```

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend/react-ui

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env file
# REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
```

Frontend will run at: **http://localhost:3000**

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Get All Articles
```http
GET /articles
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Article Title",
      "slug": "article-title",
      "content": "Article content...",
      "source_url": "https://example.com/article",
      "version": "original",
      "original_article_id": null,
      "references": null,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

#### Get Single Article
```http
GET /articles/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Article Title",
    "content": "...",
    "version": "original",
    "updated_versions": [...],
    "original_article": {...}
  }
}
```

#### Create Article
```http
POST /articles
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Article Title",
  "content": "Article content here...",
  "source_url": "https://example.com/article",
  "version": "original",
  "original_article_id": null,
  "references": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {...}
}
```

#### Update Article
```http
PUT /articles/{id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Article
```http
DELETE /articles/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

## 🔐 Environment Variables

### Backend (.env)
```env
APP_NAME=ArticleAutomation
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=article_automation
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Scripts (.env)
```env
# Backend API
API_BASE_URL=http://localhost:8000/api

# SerpAPI (Google Search)
SERPAPI_KEY=your_serpapi_key_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Scraping Config
BLOG_URL=https://beyondchats.com/blogs/
MAX_RETRIES=3
RETRY_DELAY=2000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📖 Usage Guide

### Step 1: Scrape Original Articles

```bash
cd scripts/article-automation
npm run scrape
```

This will:
- Navigate to BeyondChats blog
- Find the last page
- Scrape 5 oldest articles
- Save them to database as "original" version

### Step 2: Enhance Articles with AI

```bash
cd scripts/article-automation
node automation.js
```

This will:
- Fetch all original articles
- For each article:
  - Search Google for competitor articles
  - Scrape competitor content
  - Use OpenAI to rewrite and improve
  - Save enhanced version with references

### Step 3: View in Browser

1. Open http://localhost:3000
2. Browse articles with filter options
3. Click on any article to view details
4. Compare original vs enhanced versions
5. View references used for enhancement

## 🌐 Deployment

### Backend Deployment (Railway)

1. Create Railway account at https://railway.app
2. Create new project
3. Add MySQL database service
4. Add web service from GitHub repo
5. Configure environment variables
6. Deploy!

**Railway Configuration:**
```
Build Command: composer install
Start Command: php artisan serve --host=0.0.0.0 --port=$PORT
```

### Frontend Deployment (Vercel)

1. Create Vercel account at https://vercel.com
2. Import GitHub repository
3. Configure build settings:
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variable: `REACT_APP_API_URL`
5. Deploy!

### Scripts Deployment (Optional)

For automated runs, consider:
- **GitHub Actions**: Scheduled workflows
- **Railway Cron**: Scheduled tasks
- **AWS Lambda**: Serverless functions
- **Heroku Scheduler**: Periodic jobs

## 🧪 Testing

### Test Backend API

```bash
# Using curl
curl http://localhost:8000/api/articles

# Using Postman
Import the API endpoints and test each one
```

### Test Scraper

```bash
cd scripts/article-automation
npm run scrape
```

### Test Automation

```bash
cd scripts/article-automation
node automation.js
```

## 📝 Code Quality

### Clean Code Practices
- ✅ Meaningful variable and function names
- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Comments for complex logic

### Security
- ✅ Environment variables for secrets
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Input sanitization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ by a Senior Full-Stack Engineer

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Article categories and tags
- [ ] Search functionality
- [ ] Article analytics
- [ ] Scheduled automation runs
- [ ] Multiple source support
- [ ] Image scraping and optimization
- [ ] SEO metadata generation
- [ ] Social media integration
- [ ] Admin dashboard

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Migration fails
```bash
# Solution: Check database connection
php artisan config:clear
php artisan migrate:fresh
```

**Problem**: CORS errors
```bash
# Solution: Clear config cache
php artisan config:cache
```

### Script Issues

**Problem**: Scraping fails
- Check internet connection
- Verify website structure hasn't changed
- Increase retry delays

**Problem**: OpenAI API errors
- Verify API key is valid
- Check API quota/billing
- Ensure model name is correct

### Frontend Issues

**Problem**: API connection fails
- Verify backend is running
- Check REACT_APP_API_URL in .env
- Inspect browser console for errors

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation
- Review error logs

---

**Built with Laravel, Node.js, React, and ❤️**

*This project demonstrates production-ready full-stack development with modern best practices, clean architecture, and comprehensive documentation.*
