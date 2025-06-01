import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../auth/authSlice';
import clientSlice from '../../domains/client/clientSlice';
import roomSlice from '../../domains/room/roomSlice';
import appointmentSlice from '../../domains/appointment/appointmentSlice';
import userSlice from '../../domains/user/userSlice';
import calendarBlocksSlice from '../../domains/calendarBlocks/calendarBlocksSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        clients: clientSlice,
        rooms: roomSlice,
        appointments: appointmentSlice,
        user: userSlice,
        calendarBlocks: calendarBlocksSlice
    }
});

export default store;
