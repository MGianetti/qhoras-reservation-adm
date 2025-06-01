import { createSlice } from '@reduxjs/toolkit';

import createStandardReducers from '../../infraestructure/reducers/baseReducers';

export const initialState = { data: [], isLoading: false };

const sliceName = 'calendarBlocks';

const appointmentSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: createStandardReducers(sliceName)
});

export const { readItem, addItem, updateItem, removeItem, setLoading } = appointmentSlice.actions;

export default appointmentSlice.reducer;
