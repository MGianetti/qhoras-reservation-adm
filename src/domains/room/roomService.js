import dayjs from 'dayjs';

import roomRepository from './roomRepository';
import store from '../../infraestructure/store/store';
import notification from '../../common/utils/notification';
import { readItem, addItem, updateItem, deleteItem, setLoading } from './roomSlice';

import { createdRoomSuccess, createdRoomFail, updatedRoomSuccess, updatedRoomFail, deletedRoomSuccess, deletedRoomFail } from './room.constants';

const dispatch = (action) => store.dispatch(action);

const { read, create, update, deleteRoom } = {
    read: async ({businessId, page = 1, limit = 10, ...filters}) => {
        try {
            dispatch(setLoading(true));
            const response = await roomRepository.readAllRooms(businessId, page, limit, filters);
            const newData = response.rooms;

            dispatch(
                readItem({
                    data: newData,
                    page,
                    totalCount: response.totalCount
                })
            );
        } catch (error) {
            console.error('Error reading rooms with pagination:', error);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    create: async (businessId, newRoomPayload) => {
        try {
            dispatch(setLoading(true));
            const response = await roomRepository.createRoom(businessId, newRoomPayload);
            dispatch(addItem(response));
            notification(createdRoomSuccess);
        } catch (error) {
            notification(createdRoomFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    update: async (roomId, updateRoomPayload) => {
        try {
            dispatch(setLoading(true));
            const response = await roomRepository.updateRoom(roomId, updateRoomPayload);
            dispatch(updateItem(response));
            notification(updatedRoomSuccess);
        } catch (error) {
            notification(updatedRoomFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },

    deleteRoom: async (roomId) => {
        try {
            dispatch(setLoading(true));
            const response = await roomRepository.deleteRoom(roomId);
            const deletedRoomId = response.deletedRoom.id;
            dispatch(deleteItem(deletedRoomId)); // Passe o ID do serviço deletado
            notification(deletedRoomSuccess);
        } catch (error) {
            notification(deletedRoomFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
};

const roomsService = {
    read,
    create,
    update,
    deleteRoom
};

export default roomsService;
