import makeRequest from '../../common/utils/makeRequest';
import apiService from '../../infraestructure/api/apiService';

import endpoints from '../../infraestructure/api/endpoints.constants';

const readCalendarBlocks = (userId, start, end) => makeRequest(() => apiService.get(endpoints.read.calendarBlocks.replace('${USER-ID}', userId), { params: { start, end } }));
const createCalendarBlock = (userId, initialDate, endDate, initialTime, endTime) => makeRequest(() => apiService.post(endpoints.create.calendarBlock.replace('${USER-ID}', userId), { initialDate, endDate, initialTime, endTime }));
const deleteCalendarBlock = (blockId) => makeRequest(() => apiService.delete(endpoints.delete.calendarBlocks.replace('${BLOCK-ID}', blockId)));

export default {
    readCalendarBlocks,
    createCalendarBlock,
    deleteCalendarBlock
};
