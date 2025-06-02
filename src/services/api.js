import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://olga-orlova.me';

// Создаем экземпляр axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем токен к запросам если он есть
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API методы
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
    getById: (id) => api.get(`/listings/${id}`),
    update: (id, listingData) => api.patch(`/listings/${id}`, listingData),
    delete: (id) => api.delete(`/listings/${id}`),
};

export const ordersAPI = {
    getAll: (params) => api.get('/orders', { params }),
    create: (orderData) => api.post('/orders', orderData),
};