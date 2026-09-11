import axios from 'axios';

/**
 * Pre-configured Axios instance for all OffSole API requests
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global auth redirects or alerts here if needed
    return Promise.reject(error);
  }
);

export default api;
