import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // adjust if backend runs on different port
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('API Request:', config.url);
        console.log('Token exists:', !!token);
        console.log('User exists:', !!user._id);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('No token found in localStorage');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for debugging
API.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.config.url, response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });
        return Promise.reject(error);
    }
);

export default API;
