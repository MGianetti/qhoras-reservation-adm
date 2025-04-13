import { createSlice } from "@reduxjs/toolkit";

import createStandardReducers from "../../infraestructure/reducers/baseReducers";

const initialState = {
  data: [],
  loadedPages: [],
  pagination: { totalCount: 0, page: 0, rowsPerPage: 10 },
  isLoading: false,
};

const sliceName = "rooms";

const roomsSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    ...createStandardReducers(sliceName),

    readItem: (state, action) => {
      const { data, page, totalCount } = action.payload;

      if (state.loadedPages.includes(page)) {
        return state;
      }

      return {
        ...state,
        data: [...state.data, ...data],
        loadedPages: [...state.loadedPages, page],
        pagination: {
          ...state.pagination,
          totalCount,
        },
      };
    },

    deleteItem: (state, action) => {
      const roomId = action.payload;
      state.data = state.data.filter((room) => room.id !== roomId);
    },

    clear: () => initialState,
  },
});

export const { readItem, addItem, updateItem, deleteItem, setLoading, clear } =
  roomsSlice.actions;

export default roomsSlice.reducer;
