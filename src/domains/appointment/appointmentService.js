import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import store from '../../infraestructure/store/store';
import notification from '../../common/utils/notification';
import appointmentRepository from './appointmentRepository';
import { readItem, addItem, updateItem, removeItem, setLoading } from './appointmentSlice';

import {
    createdAppointmentSuccess,
    createdAppointmentFail,
    updatedAppointmentSuccess,
    updatedAppointmentFail,
    deletedAppointmentSuccess,
    deletedAppointmentFail,
    appointmentConflict,
    appointmentOutsideBusinessHours
} from './appointment.constants';

dayjs.extend(utc);
dayjs.extend(timezone);

const dispatch = (action) => store.dispatch(action);

const { read, create, update, remove } = {
    read: async (roomId, start, end) => {
        dispatch(setLoading(true));
        try {
            const response = await appointmentRepository.readAllAppointments(roomId, start, end);
            const responseSorted = response.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
            dispatch(readItem({ data: responseSorted, roomId }));
            return responseSorted;
        } catch (error) {
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    create: async (businessId, newAppointmentPayload) => {
        dispatch(setLoading(true));
        try {
            const response = await appointmentRepository.createAppointment(businessId, newAppointmentPayload);
            const actualRoomId = store.getState().appointments.roomId;
            if (response.roomId == actualRoomId) {
                dispatch(addItem(response));
            }
            notification(createdAppointmentSuccess);
        } catch (error) {
            if (error?.response?.data?.error === 'The selected time conflicts with another schedule') {
                notification(appointmentConflict);
            } else {
                notification(createdAppointmentFail);
            }
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    update: async (appointmentId, updateAppointmentPayload) => {
        dispatch(setLoading(true));
        try {
            const response = await appointmentRepository.updateAppointment(appointmentId, updateAppointmentPayload);
            const actualRoomId = store.getState().appointments.roomId;
            if (response.roomId == actualRoomId) {
                dispatch(updateItem(response));
            }
            notification(updatedAppointmentSuccess);
        } catch (error) {
            if (error?.response?.data?.error === 'The selected time conflicts with another schedule') {
                notification(appointmentConflict);
            } else if (error?.response?.data?.error === 'The selected time is outside of business hours') {
                notification(appointmentOutsideBusinessHours);
            } else {
                notification(updatedAppointmentFail);
            }
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    remove: async (appointmentId) => {
        dispatch(setLoading(true));
        try {
            await appointmentRepository.deleteAppointment(appointmentId);
            dispatch(removeItem({ id: appointmentId }));
            notification(deletedAppointmentSuccess);
        } catch (error) {
            notification(deletedAppointmentFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
};

const appointmentService = {
    read,
    create,
    update,
    remove
};

export default appointmentService;
