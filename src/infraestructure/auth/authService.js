import { hasLoginFail, hasLoginSuccess, passwordResetSuccess, requestGetUserFail, requestPasswordResetFail, requestPasswordResetSuccess } from './auth.constants';
import { setUser } from './authSlice';
import apiService from '../api/apiService';
import authRepository from './authRepository';
import notification from '../../common/utils/notification';
import persistAuthToken from './utils/setAuthToken';
import store from '../store/store';
import { useNavigate } from 'react-router-dom';

const dispatch = (action) => store.dispatch(action);

const login = async (credentials) => {
    try {
        const { token } = await authRepository.login(credentials);
        apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        persistAuthToken(token);
        notification(hasLoginSuccess);
        return true;
    } catch (error) {
        notification(hasLoginFail);
        return false;
    }
};

const requestPasswordReset = async (email) => {
    try {
        const data = await authRepository.requestPasswordResetRepository(email);
        notification(requestPasswordResetSuccess);
        return data;
    } catch (error) {
        notification(requestPasswordResetFail);
        return false;
    }
};

const sendNewPassword = async (newPassword, token) => {
    try {
        const data = await authRepository.sendNewPassword({ newPassword, token });
        notification(passwordResetSuccess);
        return data;
    } catch (error) {
        notification(requestPasswordResetFail);
        return false;
    }
};

const handleAuthFailure = () => {
    notification('Falha ao atualizar o token. Por favor, faça login novamente.');
    removeAuthToken();
    delete apiService.defaults.headers.common['Authorization'];
    const navigate = useNavigate();
    navigate('/login');
};

const refreshAccessToken = async (oldToken) => {
    if (!oldToken) {
        return false;
    }

    try {
        const { accessToken } = await authRepository.refreshToken(oldToken);

        apiService.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        persistAuthToken(accessToken);

        return accessToken;
    } catch (error) {
        handleAuthFailure();
        return false;
    }
};

const getUser = async () => {
    try {
        const user = await authRepository.getUser();
        dispatch(setUser(user));
    } catch (error) {
        localStorage.removeItem('token_qhoras_reservation');
        const navigate = useNavigate();
        navigate('/login');
    }
};

const authService = {
    login,
    requestPasswordReset,
    sendNewPassword,
    getUser,
    refreshAccessToken
};

export default authService;
