const apiURL = {
    development: import.meta.env.VITE_DEV_API,
    production: import.meta.env.VITE_PROD_API
};

const timeOutAmount = {
    development: import.meta.env.VITE_DEV_TIMEOUT,
    production: import.meta.env.VITE_PROD_TIMEOUT 
};

const axiosConfig = {
    baseURL: apiURL[import.meta.env.MODE] || 'http://104.248.235.54',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: timeOutAmount[import.meta.env.MODE] || 40000 
};

export default axiosConfig;
