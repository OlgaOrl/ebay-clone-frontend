import axios from 'axios';

// Use environment variable or fallback to production server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ebayclone.olga-orlova.me';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 second timeout
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Enhanced logging for debugging
    console.log('API Request Details:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: {
            'Content-Type': config.headers['Content-Type'],
            'Authorization': config.headers.Authorization ? `Bearer ${config.headers.Authorization.substring(7, 27)}...` : 'None'
        },
        data: config.data
    });
    
    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('API Response Success:', {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url,
            method: response.config.method?.toUpperCase(),
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error Details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            baseURL: error.config?.baseURL,
            fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown',
            requestData: error.config?.data,
            responseData: error.response?.data,
            message: error.message,
            code: error.code
        });
        return Promise.reject(error);
    }
);

// API methods
export const authAPI = {
    login: (email, password) => api.post('/sessions', { email, password }),
};

export const usersAPI = {
    create: (userData) => {
        console.log('Creating user with data:', userData);
        console.log('Full API URL will be:', `${API_BASE_URL}/users`);
        return api.post('/users', userData);
    },
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.patch(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
    
    // Profile-specific endpoints
    getProfile: () => api.get('/profile'),
    getMe: () => api.get('/users/me'),
    updateProfile: (userData) => api.patch('/profile', userData),
    deleteProfile: () => api.delete('/profile'),
};

export const listingsAPI = {
    getAll: (params) => api.get('/listings', { params }),
    create: (listingData) => api.post('/listings', listingData),
    createWithImages: (formData) => {
        return api.post('/listings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getById: (id) => api.get(`/listings/${id}`),
    update: (id, listingData) => api.patch(`/listings/${id}`, listingData),
    updateWithImages: (id, formData) => {
        return api.patch(`/listings/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    delete: (id) => api.delete(`/listings/${id}`),
};

export const ordersAPI = {
    getAll: () => api.get('/orders'),
    create: (data) => {
        console.log('Creating order with data:', data);
        console.log('Full API URL will be:', `${API_BASE_URL}/orders`);
        
        // Ensure data is properly formatted
        const orderData = {
            listingId: parseInt(data.listingId),
            quantity: parseInt(data.quantity) || 1
        };
        
        console.log('Formatted order data:', orderData);
        
        return api.post('/orders', orderData);
    },
    getById: (id) => api.get(`/orders/${id}`),
    update: (id, data) => api.patch(`/orders/${id}`, data),
    cancel: (id, data) => api.patch(`/orders/${id}/cancel`, data),
    updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data)
};

export const healthAPI = {
    check: () => {
        console.log('Health check - testing API connection...');
        return api.get('/health').catch(error => {
            console.error('Health check failed:', error);
            // Try a simple GET request to see if server is reachable
            return api.get('/').catch(err => {
                console.error('Root endpoint also failed:', err);
                throw err;
            });
        });
    }
};
