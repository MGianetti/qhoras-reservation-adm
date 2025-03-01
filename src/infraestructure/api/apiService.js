import axios from 'axios';

import axiosConfig from './api.constants';
import intercept401 from './intercept401';

const apiService = axios.create(axiosConfig);

export const setToken = (refreshedToken) => {
    refreshedToken ? (apiService.defaults.headers.common['Authorization'] = `Bearer ${refreshedToken}`) : delete apiService.defaults.headers.common['Authorization'];
};

if (localStorage.getItem('token_qhoras_reservation')) apiService.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token_qhoras_reservation')}`;

apiService.interceptors.response.use((response) => response, intercept401);

export default apiService;
