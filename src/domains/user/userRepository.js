import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';

import endpoints from '../../infraestructure/api/endpoints.constants';

const updateUserConfig = (businessId, userConfigData) => makeRequest(() => apiService.post(endpoints.update.userConfig.replace('${BUSINESS-ID}', businessId), userConfigData));
const updateCompany = (userId, companyData) => makeRequest(() => apiService.post(endpoints.update.company.replace('${USER-ID}', userId), companyData));
const readUserConfig = (businessId) => makeRequest(() => apiService.get(endpoints.read.userConfig.replace('${BUSINESS-ID}', businessId)));
const readBusinessEmployees = (businessId, role) => {
    const bodyPayload = { role };
    return makeRequest(() => apiService.get(`${endpoints.read.employees.replace('${BUSINESS-ID}', businessId)}`, bodyPayload));
};


export default {
    readBusinessEmployees,
    updateUserConfig,
    updateCompany,
    readUserConfig
};
