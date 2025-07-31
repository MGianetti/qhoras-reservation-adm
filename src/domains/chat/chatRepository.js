import makeRequest from "../../common/utils/makeRequest";
import apiService from "../../infraestructure/api/apiService";

import endpoints from "../../infraestructure/api/endpoints.constants";

const readAvailableTimeSlots = (roomId, date) =>
  makeRequest(() =>
    apiService.get(
      endpoints.read.availableTimeSlots.replace("${ROOM-ID}", roomId),
      {
        params: { date },
      },
    ),
  );

const readAvailableEndTimeSlots = (roomId, date, startTime) =>
  makeRequest(() =>
    apiService.get(
      endpoints.read.availableEndTimeSlots.replace("${ROOM-ID}", roomId),
      { params: { date, startTime } },
    ),
  );

export default {
  readAvailableTimeSlots,
  readAvailableEndTimeSlots,
};
