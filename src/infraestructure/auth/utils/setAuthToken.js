const persistAuthToken = (token) => {
    if (token) localStorage.setItem('token_qhoras_reservation', token);
};

export default persistAuthToken;
