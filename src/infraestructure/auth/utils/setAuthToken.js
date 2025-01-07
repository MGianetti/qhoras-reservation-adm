const persistAuthToken = (token) => {
    if (token) localStorage.setItem('token_qhoras', token);
};

export default persistAuthToken;
