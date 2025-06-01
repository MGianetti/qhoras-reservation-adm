import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';

import endpoints from '../../infraestructure/api/endpoints.constants';

const readAllClients = (businessId, page = 1, limit = 10, search = '') =>
    makeRequest(() =>
        apiService.get(endpoints.read.clients.replace('${BUSINESS-ID}', businessId), {
            params: { page, limit, search }
        })
    );
const createClient = (businessId, clientData) => makeRequest(() => apiService.post(endpoints.create.clients.replace('${BUSINESS-ID}', businessId), clientData));
const updateClient = (clientId, clientData) => makeRequest(() => apiService.put(endpoints.update.clients.replace('${CLIENT-ID}', clientId), clientData));

export default {
    readAllClients,
    createClient,
    updateClient
};
