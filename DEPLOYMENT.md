# Article Automation System - Deployment Guide

## 🚀 Deploy Frontend to Vercel

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abhinavteja123/article-automation-system)

### Manual Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Frontend Directory**
   ```bash
   cd frontend/react-ui
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **article-automation-system** (or your choice)
   - Directory? **./frontend/react-ui**
   - Override settings? **N**

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Environment Variables

After deployment, add these environment variables in Vercel Dashboard:

- `REACT_APP_API_URL` - Your backend API URL (e.g., https://your-backend.com/api)
- `REACT_APP_AUTOMATION_SERVER_URL` - Your automation server URL (e.g., https://your-automation-server.com)

### Vercel Configuration

The project includes `vercel.json` with proper routing configuration for React Router.

## 🔧 Deploy Backend (Laravel)

### Recommended Platforms:
- **Railway** - https://railway.app
- **Render** - https://render.com
- **Heroku** - https://heroku.com

### Railway Deployment (Recommended)

1. Create account at railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Add root directory: `backend/laravel-api`
5. Add environment variables from `.env`
6. Deploy!

## 🗄️ Database Hosting

### Recommended:
- **PlanetScale** - Free MySQL hosting
- **Railway** - Includes MySQL addon
- **AWS RDS** - Production grade

## 📦 Automation Server Deployment

Deploy the Node.js automation server separately:

### Railway/Render Steps:
1. Create new service
2. Set root directory: `scripts/article-automation`
3. Add environment variables (GEMINI_API_KEY, SERPAPI_KEY)
4. Deploy!

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed (Railway/Render)
- [ ] Database created and migrated
- [ ] Automation server deployed
- [ ] Environment variables configured
- [ ] Update frontend API URLs
- [ ] Test scraper functionality
- [ ] Test automation functionality
- [ ] Test comparison feature

## 🌐 Update API URLs

After deploying backend and automation server, update:

**Frontend** (`frontend/react-ui/src/services/api.js`):
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend.railway.app/api';
```

**Frontend** (`frontend/react-ui/src/pages/ScraperPage.js` and `AutomationPage.js`):
```javascript
const response = await fetch(process.env.REACT_APP_AUTOMATION_SERVER_URL || 'https://your-automation-server.com/run-scraper', {
```

## 📝 Notes

- Frontend is static and can be deployed to Vercel/Netlify
- Backend requires PHP environment (Railway/Render recommended)
- Automation server is a simple Node.js Express app
- Database can be hosted on PlanetScale (free tier available)
