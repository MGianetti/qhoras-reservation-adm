const apiURL = {
    development: import.meta.env.VITE_DEV_API,
    production: import.meta.env.VITE_PROD_API
};

const timeOutAmount = {
    development: import.meta.env.VITE_DEV_TIMEOUT,
    production: import.meta.env.VITE_PROD_TIMEOUT 
};

const axiosConfig = {
    baseURL: apiURL[import.meta.env.MODE] || 'http://157.230.2.51',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: timeOutAmount[import.meta.env.MODE] || 40000 
};

export default axiosConfig;
