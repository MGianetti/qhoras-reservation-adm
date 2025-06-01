import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';
import endpoints from '../../infraestructure/api/endpoints.constants';

const initializeWhatsAppClient = (userId) => makeRequest(() => apiService.post(endpoints.whatsapp.initializeClient, { userId }));

const deleteWhatsAppClient = (userId) => makeRequest(() => apiService.post(endpoints.whatsapp.deleteClient, { userId }));

const generateQRCode = (userId) => makeRequest(() => apiService.post(endpoints.whatsapp.generateQRCode, { userId }));

const checkWhatsAppHeartbeat = (userId) => makeRequest(() => apiService.get(`${endpoints.whatsapp.checkWhatsAppHeartbeat}?userId=${userId}`));

export default {
    initializeWhatsAppClient,
    deleteWhatsAppClient,
    generateQRCode,
    checkWhatsAppHeartbeat
};
