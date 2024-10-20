import axios from 'axios';

const api = axios.create({
    baseURL: 'https://interview-scheduler-0s3o.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors to handle JWT token for authorization
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
