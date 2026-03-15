import axios from 'axios';

const api = axios.create({
    baseURL: 'https://loan-risk-backend-dvwz.onrender.com/api',
    headers: { 'Content-Type': 'application/json' },
});

export default api;