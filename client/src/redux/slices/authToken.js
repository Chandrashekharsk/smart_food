// authTokenSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialTokenState =
  JSON.parse(localStorage.getItem("access_token")) || null; // Retrieve user state from localStorage

const authTokenSlice = createSlice({
  name: "token",
  initialState: {
    token: initialTokenState,
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("access_token", JSON.stringify(action.payload)); // Store user state in localStorage
    },
    clearAuthToken: (state) => {
      state.token = null;
      localStorage.removeItem("access_token"); // Remove user state from localStorage on logout
    },
  },
});

export const { setAuthToken, clearAuthToken } = authTokenSlice.actions;
export default authTokenSlice.reducer;
