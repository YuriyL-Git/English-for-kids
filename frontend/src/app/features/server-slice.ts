import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import logoutUser from '../services/auth/logout-user';
import getLoggedInUser from '../services/auth/get-logged-in-user';

const stateInit = {
  isAdminLoggedIn: false,
  user: '',
};

const serverSlice = createSlice({
  name: 'server',
  initialState: stateInit,
  reducers: {
    loginAdmin: state => {
      state.isAdminLoggedIn = true;
      state.user = 'Admin';
    },

    logoutAdmin: state => {
      state.isAdminLoggedIn = false;
      logoutUser().then();
    },
  },
});

export default serverSlice.reducer;

export const { loginAdmin, logoutAdmin } = serverSlice.actions;
