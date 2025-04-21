import makeRequest from "../../common/utils/makeRequest";
import apiService from "../../infraestructure/api/apiService";

import endpoints from "../../infraestructure/api/endpoints.constants";

const readRoomsPublic = (businessId, page = 1, limit = 10, filters = {}) =>
  makeRequest(() =>
    apiService.get(
      endpoints.read.roomsPublic.replace("${BUSINESS-ID}", businessId),
      {
        params: { page, limit, filters },
      },
    ),
  );

const readCalendarPublic = (businessId, page, limit, order, orderBy) =>
  makeRequest(() =>
    apiService.post(
      endpoints.read.calendarListPublic.replace("${BUSINESS-ID}", businessId),
      { page, limit, order, orderBy },
    ),
  );

const readAppointmentsPublic = (roomId, start, end) =>
  makeRequest(() =>
    apiService.get(
      endpoints.read.appointmentsPublic.replace("${ROOM-ID}", roomId),
      {
        params: { start, end },
      },
    ),
  );

export default {
  readRoomsPublic,
  readCalendarPublic,
  readAppointmentsPublic,
};
