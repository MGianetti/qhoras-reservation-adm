import { createSlice } from '@reduxjs/toolkit';
import createStandardReducers from '../../infraestructure/reducers/baseReducers';

const initialState = {
    data: [],
    isLoading: false
};

const sliceName = 'tags';

const tagsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        ...createStandardReducers()
    }
});

export const { readItem, addItem, updateItem, removeItem, clearItems, setLoading } = tagsSlice.actions;

export default tagsSlice.reducer;
