import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';

import endpoints from '../../infraestructure/api/endpoints.constants';

const readAvailableTimeSlots = (roomId, date) =>
    makeRequest(() =>
        apiService.get(endpoints.read.availableTimeSlots.replace('${ROOM-ID}', roomId), {
            params: { date }
        })
    );

const readAvailableEndTimeSlots = (roomId, date, startTime) =>
    makeRequest(() => apiService.get(endpoints.read.availableEndTimeSlots.replace('${ROOM-ID}', roomId), { params: { date, startTime } }));

const getUserByPhoneNumber = (businessId, phoneNumber) => makeRequest(() => apiService.get(endpoints.read.getUserByPhoneNumber.replace('${BUSINESS-ID}', businessId), { params: { phoneNumber } }));

const createClientViaChat = (businessId, clientData) => makeRequest(() => apiService.post(endpoints.create.clientViaChat.replace('${BUSINESS-ID}', businessId), clientData));

const createSolicitationViaChat = (businessId, solicitationData) => makeRequest(() => apiService.post(endpoints.create.createSolicitationViaChat.replace('${BUSINESS-ID}', businessId), solicitationData));

export default {
    readAvailableTimeSlots,
    readAvailableEndTimeSlots,
    getUserByPhoneNumber,
    createClientViaChat,
    createSolicitationViaChat
};
