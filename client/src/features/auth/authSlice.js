import { createSlice } from "@reduxjs/toolkit";

const loadSaved = () => {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadSaved(),
  reducers: {
    updateUser: (state, { payload }) => {
      state.user = payload;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: payload,
          token: state.token
        })
      );
    },
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      // keeps you logged in after a page refresh
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: payload.user, token: payload.token })
      );
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth");
    },
  },
});

export const {
  setCredentials,
  logout,
  updateUser
} = authSlice.actions;
export default authSlice.reducer;