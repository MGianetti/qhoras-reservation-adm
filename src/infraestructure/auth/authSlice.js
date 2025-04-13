import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token_qhoras_reservation") ?? null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = initialState.user;
      const idToken = localStorage.getItem("token_qhoras_reservation");
      if (idToken) localStorage.removeItem("token_qhoras_reservation");
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // setError: (state, action) => {
    //     state.error = action.payload;
    //     state.token = initialState.token;
    //     state.user = initialState.user;
    // },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
