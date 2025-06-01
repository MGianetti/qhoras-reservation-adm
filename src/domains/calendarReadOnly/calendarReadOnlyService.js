import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import store from '../../infraestructure/store/store';
import { readItem as readItemRoom } from '../room/roomSlice';
import { readItem as readItemCalendar, setLoading } from '../appointment/appointmentSlice';
import calendarReadOnlyRepository from './calendarReadOnlyRepository';

dayjs.extend(utc);
dayjs.extend(timezone);

const dispatch = (action) => store.dispatch(action);

const { readRoom, readCalendarList, readAppointments } = {
    readRoom: async ({ businessId, page = 1, limit = 10, ...filters }) => {
        try {
            const response = await calendarReadOnlyRepository.readRoomsPublic(businessId, page, limit, filters);

            dispatch(
                readItemRoom({
                    data: response.rooms,
                    page,
                    totalCount: response.totalCount
                })
            );
            return response.rooms;
        } catch (error) {
            console.error('Error reading rooms with pagination:', error);
            return false;
        }
    },
    readCalendarList: async ({ businessId, page = 1, limit = 10, order = 'asc', orderBy = 'date' }) => {
        try {
            const response = await calendarReadOnlyRepository.readCalendarPublic(businessId, page, limit, order, orderBy);
            const { reservations, ...pageData } = response;

            dispatch(
                readItemCalendar({
                    data: reservations,
                    roomId: null,
                    pageData
                })
            );
            return response;
        } catch (error) {
            console.error('Error reading calendar list:', error);
            return false;
        }
    },
    readAppointments: async (roomId, start, end) => {
        dispatch(setLoading(true));
        try {
            const response = await calendarReadOnlyRepository.readAppointmentsPublic(roomId, start, end);

            const responseSorted = response.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));

            dispatch(readItemCalendar({ data: responseSorted, roomId }));

            return responseSorted;
        } catch (error) {
            console.error('Error reading appointments:', error);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
};

const calendarReadOnlyService = {
    readRoom,
    readCalendarList,
    readAppointments
};

export default calendarReadOnlyService;
