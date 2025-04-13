import { createSlice } from "@reduxjs/toolkit";

import createStandardReducers from "../../infraestructure/reducers/baseReducers";

const initialState = {
  data: [],
  loadedPages: [],
  pagination: { totalCount: 0, page: 0, rowsPerPage: 10, search: "" },
  isLoading: false,
};

const sliceName = "clients";

const clientSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    ...createStandardReducers(sliceName),
    readItem: (state, action) => {
      const { data, page, totalCount, totalPages, search } = action.payload;

      const isNewSearch = search && search !== state.pagination.search;

      return {
        ...state,
        data: data,
        pagination: {
          totalCount,
          totalPages,
          page: isNewSearch ? 1 : page,
          search,
        },
      };
    },
  },
});

export const { readItem, addItem, updateItem, setLoading, clearLoadedPages } =
  clientSlice.actions;

export default clientSlice.reducer;
