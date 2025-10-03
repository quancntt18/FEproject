// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // URL của backend server
  withCredentials: true, // Rất quan trọng để gửi và nhận cookie session
});

export default api;