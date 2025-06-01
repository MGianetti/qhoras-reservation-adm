import apiService, { setToken } from './apiService';
import authService from '../auth/authService';
import endpoints from '../api/endpoints.constants';
import { useNavigate } from 'react-router-dom';

export const refreshAccessToken = async (oldToken) => {
    const token = await authService.refreshAccessToken(oldToken);
    return token;
};

const intercept401 = async (error) => {
    const originalRequest = error.config;

    if (error.response.data.message === 'No token provided' || originalRequest._retry) {
        localStorage.removeItem('token_qhoras_reservation');
        window.location.href = '/login';
    }

    if (originalRequest.url.includes(endpoints.auth.refreshToken)) {
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const oldToken = localStorage.getItem('token_qhoras_reservation');
        const newToken = await refreshAccessToken(oldToken);
        if (!newToken) {
            return Promise.reject(error);
        }
        setToken(newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        const method = originalRequest.method.toLowerCase();
        const url = originalRequest.url;
        const data = originalRequest.data;

        switch (method) {
            case 'get':
            case 'delete':
            case 'head':
            case 'options':
                return apiService[method](url, originalRequest);
            case 'post':
            case 'put':
            case 'patch':
                return apiService[method](url, data, originalRequest);
            default:
                throw new Error(`Unsupported request method: ${method}`);
        }
    }

    return Promise.reject(error);
};

export default intercept401;
