import makeRequest from "../../common/utils/makeRequest";
import apiService from "../../infraestructure/api/apiService";

import endpoints from "../../infraestructure/api/endpoints.constants";

const readAllRooms = (businessId, page = 1, limit = 10, filters = {}) =>
  makeRequest(() =>
    apiService.get(endpoints.read.rooms.replace("${BUSINESS-ID}", businessId), {
      params: { page, limit, filters },
    }),
  );
const createRoom = (businessId, roomData) =>
  makeRequest(() =>
    apiService.post(
      endpoints.create.rooms.replace("${BUSINESS-ID}", businessId),
      roomData,
    ),
  );
const updateRoom = (roomId, roomData) =>
  makeRequest(() =>
    apiService.put(
      endpoints.update.rooms.replace("${ROOM-ID}", roomId),
      roomData,
    ),
  );
const deleteRoom = (roomId) =>
  makeRequest(() =>
    apiService.delete(endpoints.delete.rooms.replace("${ROOM-ID}", roomId)),
  );

export default {
  readAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};
