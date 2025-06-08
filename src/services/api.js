import axios from 'axios';

const API_BASE_URL = '/api'; // using proxy

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API methods
export const authAPI = {
    login: (email, password) => api.post('/sessions', { email, password }),
};

export const usersAPI = {
    create: (userData) => api.post('/users', userData),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.patch(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
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
    create: (data) => api.post('/orders', data),
    getById: (id) => api.get(`/orders/${id}`),
    update: (id, data) => api.patch(`/orders/${id}`, data),
    cancel: (id, data) => api.patch(`/orders/${id}/cancel`, data),
    updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data)
};