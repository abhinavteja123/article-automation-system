import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';

// TODO: maybe add a 404 page later?
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
