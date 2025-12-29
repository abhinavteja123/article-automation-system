import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

export const articleService = {
  getAllArticles: async () => {
    try {
      const response = await api.get('/articles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getArticleById: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new article
  createArticle: async (articleData) => {
    try {
      const response = await api.post('/articles', articleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update article
  updateArticle: async (id, articleData) => {
    try {
      const response = await api.put(`/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete article
  deleteArticle: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Run automation to enhance articles
  runAutomation: async () => {
    try {
      const response = await api.post('/articles/run-automation');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get comparison between original and enhanced article
  getComparison: async (id) => {
    try {
      const response = await api.get(`/articles/${id}/comparison`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
