import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, Tenant } from '../lib/types';

const initialState: AuthState = {
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: false,
  registeredUsers: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    login: (state, action: PayloadAction<{ user: User; tenant: Tenant }>) => {
      state.user = action.payload.user;
      state.tenant = action.payload.tenant;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.tenant = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    switchTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenant = action.payload;
    },
    register: (state, action: PayloadAction<{ user: User; tenant: Tenant }>) => {
      state.user = action.payload.user;
      state.tenant = action.payload.tenant;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.registeredUsers.push(action.payload.user);
    },
  },
});

export const { setLoading, login, logout, switchTenant, register } = authSlice.actions;
export default authSlice.reducer;
