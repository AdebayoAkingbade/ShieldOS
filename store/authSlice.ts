import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, Tenant } from '../lib/types';

const initialState: AuthState = {
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: false,
  isGlobalLoading: false,
  viewedPaths: [],
  registeredUsers: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isGlobalLoading = action.payload;
    },
    markPathAsViewed: (state, action: PayloadAction<string>) => {
      if (!state.viewedPaths.includes(action.payload)) {
        state.viewedPaths.push(action.payload);
      }
    },
    login: (state, action: PayloadAction<{ user: User; tenant: Tenant }>) => {
      state.user = action.payload.user;
      state.tenant = action.payload.tenant;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isGlobalLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.tenant = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isGlobalLoading = false;
      state.viewedPaths = [];
    },
    switchTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenant = action.payload;
    },
    register: (state, action: PayloadAction<{ user: User; tenant: Tenant }>) => {
      state.user = action.payload.user;
      state.tenant = action.payload.tenant;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isGlobalLoading = false;
      state.registeredUsers.push(action.payload.user);
    },
  },
});

export const { setLoading, setGlobalLoading, markPathAsViewed, login, logout, switchTenant, register } = authSlice.actions;
export default authSlice.reducer;
