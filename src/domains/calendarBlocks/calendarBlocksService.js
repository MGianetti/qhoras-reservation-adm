import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import store from '../../infraestructure/store/store';
import notification from '../../common/utils/notification';
import calendarBlocksRepository from './calendarBlocksRepository';
import { addItem, readItem, removeItem, setLoading } from './calendarBlocksSlice';

import {
    createdCalendarBlockSuccess,
    createdCalendarBlockFail,
    deletedCalendarBlockSuccess,
    deletedCalendarBlockFail
} from './calendarBlocks.constants';

dayjs.extend(utc);
dayjs.extend(timezone);

const dispatch = (action) => store.dispatch(action);

const { create, read, remove } = {
    read: async (userId, start, end) => {
        dispatch(setLoading(true));
        try {
            // TODO: Implementar a leitura dos bloqueios de acordo com o horário e a sala
            // const response = await calendarBlocksRepository.readCalendarBlocks(userId, start, end);
            // const responseSorted = response.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
            // dispatch(readItem({ data: responseSorted }));
            return true;
        } catch (error) {
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    create: async ({userId, initialDate, endDate, initialTime, endTime}) => {
        dispatch(setLoading(true));
        try {
            await calendarBlocksRepository.createCalendarBlock(userId, initialDate, endDate, initialTime, endTime);
            notification(createdCalendarBlockSuccess);
        } catch (error) {
            console.log(error);
            notification(createdCalendarBlockFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    },
    remove: async (blockId) => {
        dispatch(setLoading(true));
        try {
            await calendarBlocksRepository.deleteCalendarBlock(blockId);
            dispatch(removeItem({ id: blockId }));
            notification(deletedCalendarBlockSuccess);
        } catch (error) {
            notification(deletedCalendarBlockFail);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
};

const calendarBlocksService = {
    read,
    create,
    remove
    // update,
};

export default calendarBlocksService;
