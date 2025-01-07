import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';

import endpoints from '../../infraestructure/api/endpoints.constants';

const readAllServices = (userId, page = 1, limit = 10, filters = {}) =>
    makeRequest(() =>
        apiService.get(endpoints.read.services.replace('${USER-ID}', userId), {
            params: { page, limit, filters }
        })
    );
const createService = (userId, serviceData) => makeRequest(() => apiService.post(endpoints.create.services.replace('${USER-ID}', userId), serviceData));
const updateService = (userId, serviceData) => makeRequest(() => apiService.put(endpoints.update.services.replace('${USER-ID}', userId), serviceData));
const deleteService = (serviceId) => makeRequest(() => apiService.delete(endpoints.delete.services.replace('${SERVICE-ID}', serviceId)));

export default {
    readAllServices,
    createService,
    updateService,
    deleteService
};
