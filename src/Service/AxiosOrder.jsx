import axios from 'axios';

const token = localStorage.getItem('token')

const instance = axios.create({
    baseURL: '/', // Use relative URL since we're using Vite proxy
});

// Automatically update token for every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // Do not attach Authorization for public job search endpoint
        const url = config?.url || '';
        const isPublicSearch = url.includes('/api/job-postings/search') || url.includes('/api/jobpostings/search');
        if (token && !isPublicSearch) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;

