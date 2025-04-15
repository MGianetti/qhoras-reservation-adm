import makeRequest from "../../common/utils/makeRequest";
import apiService from "../../infraestructure/api/apiService";
import endpoints from "../../infraestructure/api/endpoints.constants";

const readAllAppointments = (roomId, start, end) =>
  makeRequest(() =>
    apiService.get(endpoints.read.appointments.replace("${ROOM-ID}", roomId), {
      params: { start, end },
    })
  );
const createAppointment = (businessId, appointmentData) =>
  makeRequest(() =>
    apiService.post(
      endpoints.create.appointments.replace("${BUSINESS-ID}", businessId),
      appointmentData
    )
  );
const updateAppointment = (appointmentId, appointmentData, scope = "single") =>
  makeRequest(() =>
    apiService.put(
      endpoints.update.appointments.replace(
        "${APPOINTMENT-ID}",
        appointmentId
      ) + `?scope=${scope}`,
      appointmentData
    )
  );

const deleteAppointment = (appointmentId, scope = "single") =>
  makeRequest(() =>
    apiService.delete(
      endpoints.delete.appointments.replace(
        "${APPOINTMENT-ID}",
        appointmentId
      ) + `?scope=${scope}`
    )
  );
const readCalendarList = (businessId, page, limit, order, orderBy) =>
  makeRequest(() =>
    apiService.post(
      endpoints.read.calendarList.replace("${BUSINESS-ID}", businessId),
      { page, limit, order, orderBy }
    )
  );

export default {
  readAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  readCalendarList,
};
