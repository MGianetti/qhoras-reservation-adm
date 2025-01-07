import { createSlice } from '@reduxjs/toolkit';

import createStandardReducers from '../../infraestructure/reducers/baseReducers';

export const initialState = { schedule: [], suggestionTime: '',  employees: [], isLoading: false };
const sliceName = 'user';

const userSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        ...createStandardReducers(sliceName),
        setEmployees: (state, action) => {
            state.employees = action.payload;
        }
    }
});

export const { readItem, updateItem, clearItems, setLoading, setEmployees } = userSlice.actions;

export default userSlice.reducer;
