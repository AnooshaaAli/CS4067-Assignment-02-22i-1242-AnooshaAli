// src/services/auth.service.js
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update with your backend URL

const AuthService = {
  async login(email, password) {
    // FastAPI expects form data for OAuth2PasswordRequestForm
    const formData = new FormData();
    formData.append('username', email); // FastAPI OAuth2 uses 'username'
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/token`, formData);
    return response.data;
  },

  async register(name, email, password) {
    const response = await axios.post(`${API_URL}/users`, {
      name,
      email,
      password
    });
    return response.data;
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken() {
    return localStorage.getItem('token');
  }
};

export default AuthService;