import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../auth/authSlice';
import clientSlice from '../../domains/client/clientSlice';
import servicesSlice from '../../domains/services/servicesSlice';
import appointmentSlice from '../../domains/appointment/appointmentSlice';
import userSlice from '../../domains/user/userSlice';
import calendarBlocksSlice from '../../domains/calendarBlocks/calendarBlocksSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        clients: clientSlice,
        services: servicesSlice,
        appointments: appointmentSlice,
        user: userSlice,
        calendarBlocks: calendarBlocksSlice
    }
});

export default store;
