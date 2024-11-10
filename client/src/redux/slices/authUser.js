// authUserSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialUserState = JSON.parse(localStorage.getItem("user")) || null;  // Retrieve user state from localStorage

const authUserSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUserState,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));  // Store user state in localStorage
    },
    clearAuthUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");  // Remove user state from localStorage on logout
    },
  },
});

export const { setAuthUser, clearAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
