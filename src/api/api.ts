import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth endpoints must never trigger the token-refresh flow. A failed login or
// register returns 401 by design, and the UI needs that error to display
// (e.g. "Invalid email or password") instead of being hijacked into a refresh
// attempt that clears storage and hard-redirects to /login.
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/logout'];

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const url: string = originalRequest?.url || '';
        const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => url.includes(path));

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            try {
                const response = await api.post('/auth/refresh-token');
                const { token } = response.data.data;

                localStorage.setItem('token', token);

                // Update header for future requests
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // Update header for this request
                originalRequest.headers['Authorization'] = `Bearer ${token}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
