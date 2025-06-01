import { createSlice } from '@reduxjs/toolkit';

import createStandardReducers from '../../infraestructure/reducers/baseReducers';

export const initialState = {
    data: [],
    roomId: null,
    isLoading: false,
    pageData: {}
};

const sliceName = 'appointments';

const appointmentSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: createStandardReducers(sliceName)
});

export const { readItem, addItem, updateItem, removeItem, setLoading } = appointmentSlice.actions;

export default appointmentSlice.reducer;
