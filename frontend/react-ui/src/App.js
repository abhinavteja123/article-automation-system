import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ComparePage from './pages/ComparePage';
import AutomationPage from './pages/AutomationPage';

// TODO: maybe add a 404 page later?
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/articles" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
          <Route path="/compare/:id" element={<ComparePage />} />
          <Route path="/automation" element={<AutomationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
