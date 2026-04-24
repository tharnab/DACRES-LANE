import axios from 'axios';
import toast from 'react-hot-toast';

// Change this to your Render backend URL
const API = axios.create({ baseURL: 'https://dacres-lane.onrender.com/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Global error interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        } else if (error.response?.status === 500) {
            toast.error('Server error. Please try again later.');
        } else if (error.code === 'ERR_NETWORK') {
            toast.error('Network error. Check your connection.');
        }
        return Promise.reject(error);
    }
);

export default API;