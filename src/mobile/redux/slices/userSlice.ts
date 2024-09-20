import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, StyleProfile } from 'src/shared/types/index';
import { RootState, AppDispatch } from 'src/mobile/redux/store';
import { api } from 'src/mobile/services/api';

// Define the initial state
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

// Define async thunks
export const loginAsync = createAsyncThunk<User, { email: string; password: string }, { dispatch: AppDispatch; state: RootState }>(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post<User>('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerAsync = createAsyncThunk<User, { email: string; password: string; name: string }, { dispatch: AppDispatch; state: RootState }>(
  'user/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await api.post<User>('/auth/register', { email, password, name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutAsync = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const updateProfileAsync = createAsyncThunk<User, Partial<User>, { dispatch: AppDispatch; state: RootState }>(
  'user/updateProfile',
  async (updatedProfile, { rejectWithValue }) => {
    try {
      const response = await api.put<User>('/user/profile', updatedProfile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const updateStyleProfileAsync = createAsyncThunk<StyleProfile, StyleProfile, { dispatch: AppDispatch; state: RootState }>(
  'user/updateStyleProfile',
  async (styleProfile, { rejectWithValue }) => {
    try {
      const response = await api.put<StyleProfile>('/user/style-profile', styleProfile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Style profile update failed');
    }
  }
);

// Create the slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Add any synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
      })
      .addCase(updateStyleProfileAsync.fulfilled, (state, action: PayloadAction<StyleProfile>) => {
        if (state.currentUser) {
          state.currentUser.styleProfile = action.payload;
        }
      });
  },
});

// Export the reducer
export const userReducer = userSlice.reducer;

// Export actions
export const userActions = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user.currentUser;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectStyleProfile = (state: RootState) => state.user.currentUser?.styleProfile;