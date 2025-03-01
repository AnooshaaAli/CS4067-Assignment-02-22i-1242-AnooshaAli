// src/services/user.service.js
import axios from 'axios';
import AuthService from './auth.servic.jse';

const API_URL = 'http://localhost:8000'; // Update with your backend URL

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const UserService = {
  async getCurrentUserProfile() {
    return axios.get(`${API_URL}/users/me`);
  },
  
  async getAllEvents() {
    // This would call your Event Service
    return axios.get(`${API_URL}/events`);
  }
};

export default UserService;