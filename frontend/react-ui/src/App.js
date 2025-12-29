import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ComparePage from './pages/ComparePage';
import AutomationPage from './pages/AutomationPage';
import ScraperPage from './pages/ScraperPage';
import { ToastProvider } from './components/ui/Toast';

// Wrapper to access useLocation hook
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/articles" element={<HomePage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/compare/:id" element={<ComparePage />} />
        <Route path="/scraper" element={<ScraperPage />} />
        <Route path="/automation" element={<AutomationPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </ToastProvider>
    </Router>
  );
}

export default App;
