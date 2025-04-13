import makeRequest from "../../common/utils/makeRequest";
import apiService from "../api/apiService";
import endpoints from "../api/endpoints.constants";

const login = (credentials) => {
  return makeRequest(() => apiService.post(endpoints.auth.login, credentials));
};

const requestPasswordResetRepository = (email) => {
  return makeRequest(() =>
    apiService.post(endpoints.auth.requestPasswordReset, { email }),
  );
};

const sendNewPassword = ({ newPassword, token }) => {
  return makeRequest(() =>
    apiService.post(endpoints.auth.resetPassword, {
      newPassword: newPassword,
      token: token,
    }),
  );
};

const getUser = () => {
  return makeRequest(() => apiService.get(endpoints.auth.loginWithJwt));
};

const refreshToken = (tokenToRefresh) => {
  return makeRequest(() =>
    apiService.post(endpoints.auth.refreshToken, { token: tokenToRefresh }),
  );
};

// const confirm2FAToken = (credentials) => {
//     return makeRequest(() => apiService.post(endpoints.auth.loginWithToken, credentials));
// };

export default {
  login,
  requestPasswordResetRepository,
  sendNewPassword,
  getUser,
  refreshToken,
  // confirm2FAToken,
};
