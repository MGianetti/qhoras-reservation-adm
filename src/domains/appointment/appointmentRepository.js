import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';

import endpoints from '../../infraestructure/api/endpoints.constants';
// TODO fix
const readAllAppointments = (roomId, start, end) => makeRequest(() => apiService.get(endpoints.read.appointments.replace('${ROOM-ID}', roomId), { params: { start, end } }));
const createAppointment = (businessId, appointmentData) => makeRequest(() => apiService.post(endpoints.create.appointments.replace('${BUSINESS-ID}', businessId), appointmentData));
const updateAppointment = (appointmentId, appointmentData) =>
    makeRequest(() => apiService.put(endpoints.update.appointments.replace('${APPOINTMENT-ID}', appointmentId), appointmentData));
const deleteAppointment = (appointmentId) => makeRequest(() => apiService.delete(endpoints.delete.appointments.replace('${APPOINTMENT-ID}', appointmentId)));

export default {
    readAllAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
};
