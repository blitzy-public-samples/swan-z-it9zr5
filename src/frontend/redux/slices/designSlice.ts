import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Design } from '../../../shared/types';
import { RootState } from '../store';
import * as designService from '../../services/api';

interface DesignState {
  designs: Design[];
  currentDesign: Design | null;
  loading: boolean;
  error: string | null;
}

const initialState: DesignState = {
  designs: [],
  currentDesign: null,
  loading: false,
  error: null
};

export const fetchDesigns = createAsyncThunk<Design[], void>(
  'designs/fetchDesigns',
  async (_, { rejectWithValue }) => {
    try {
      const designs = await designService.fetchDesigns();
      return designs;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDesign = createAsyncThunk<Design, Design>(
  'designs/createDesign',
  async (designData, { rejectWithValue }) => {
    try {
      const newDesign = await designService.createDesign(designData);
      return newDesign;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDesign = createAsyncThunk<Design, Design>(
  'designs/updateDesign',
  async (designData, { rejectWithValue }) => {
    try {
      const updatedDesign = await designService.updateDesign(designData);
      return updatedDesign;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDesign = createAsyncThunk<void, string>(
  'designs/deleteDesign',
  async (designId, { rejectWithValue }) => {
    try {
      await designService.deleteDesign(designId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const designSlice = createSlice({
  name: 'designs',
  initialState,
  reducers: {
    setCurrentDesign: (state, action: PayloadAction<Design>) => {
      state.currentDesign = action.payload;
    },
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = action.payload;
      })
      .addCase(fetchDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDesign.fulfilled, (state, action) => {
        state.designs.push(action.payload);
      })
      .addCase(updateDesign.fulfilled, (state, action) => {
        const index = state.designs.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.designs[index] = action.payload;
        }
      })
      .addCase(deleteDesign.fulfilled, (state, action) => {
        state.designs = state.designs.filter(d => d.id !== action.meta.arg);
      });
  }
});

export const { setCurrentDesign, clearCurrentDesign } = designSlice.actions;

export const selectDesigns = (state: RootState) => state.designs.designs;
export const selectCurrentDesign = (state: RootState) => state.designs.currentDesign;
export const selectDesignLoading = (state: RootState) => state.designs.loading;
export const selectDesignError = (state: RootState) => state.designs.error;

export default designSlice.reducer;