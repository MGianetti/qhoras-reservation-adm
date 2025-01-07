import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';

import endpoints from '../../infraestructure/api/endpoints.constants';

const readAllClients = (userId, page = 1, limit = 10, search = '') =>
    makeRequest(() =>
        apiService.get(endpoints.read.clients.replace('${USER-ID}', userId), {
            params: { page, limit, search }
        })
    );
const createClient = (userId, clientData) => makeRequest(() => apiService.post(endpoints.create.clients.replace('${USER-ID}', userId), clientData));
const updateClient = (userId, clientData) => makeRequest(() => apiService.put(endpoints.update.clients.replace.replace('${USER-ID}', userId), clientData));

export default {
    readAllClients,
    createClient,
    updateClient
};
