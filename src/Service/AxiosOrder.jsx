import axios from 'axios';

const token = localStorage.getItem('token')

const instance = axios.create({
    baseURL: '/', // Use relative URL since we're using Vite proxy
});

// Automatically update token for every request
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;

