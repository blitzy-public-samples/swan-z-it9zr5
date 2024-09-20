import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CustomDesign } from 'src/shared/types/index';
import { RootState, AppDispatch } from 'src/mobile/redux/store';
import { api } from 'src/mobile/services/api';

interface DesignState {
  designs: CustomDesign[];
  currentDesign: CustomDesign | null;
  loading: boolean;
  error: string | null;
}

const initialState: DesignState = {
  designs: [],
  currentDesign: null,
  loading: false,
  error: null,
};

export const createDesignAsync = createAsyncThunk<CustomDesign, CustomDesign, { dispatch: AppDispatch, state: RootState }>(
  'design/createDesign',
  async (newDesign, { rejectWithValue }) => {
    try {
      const response = await api.post<CustomDesign>('/designs', newDesign);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create design');
    }
  }
);

export const updateDesignAsync = createAsyncThunk<CustomDesign, CustomDesign, { dispatch: AppDispatch, state: RootState }>(
  'design/updateDesign',
  async (updatedDesign, { rejectWithValue }) => {
    try {
      const response = await api.put<CustomDesign>(`/designs/${updatedDesign.id}`, updatedDesign);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update design');
    }
  }
);

export const deleteDesignAsync = createAsyncThunk<string, string, { dispatch: AppDispatch, state: RootState }>(
  'design/deleteDesign',
  async (designId, { rejectWithValue }) => {
    try {
      await api.delete(`/designs/${designId}`);
      return designId;
    } catch (error) {
      return rejectWithValue('Failed to delete design');
    }
  }
);

export const fetchDesignsAsync = createAsyncThunk<CustomDesign[], void, { dispatch: AppDispatch, state: RootState }>(
  'design/fetchDesigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CustomDesign[]>('/designs');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch designs');
    }
  }
);

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setCurrentDesign: (state, action: PayloadAction<CustomDesign | null>) => {
      state.currentDesign = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDesignAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDesignAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.designs.push(action.payload);
        state.currentDesign = action.payload;
      })
      .addCase(createDesignAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDesignAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDesignAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.designs.findIndex(design => design.id === action.payload.id);
        if (index !== -1) {
          state.designs[index] = action.payload;
        }
        state.currentDesign = action.payload;
      })
      .addCase(updateDesignAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDesignAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDesignAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = state.designs.filter(design => design.id !== action.payload);
        if (state.currentDesign && state.currentDesign.id === action.payload) {
          state.currentDesign = null;
        }
      })
      .addCase(deleteDesignAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDesignsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = action.payload;
      })
      .addCase(fetchDesignsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentDesign } = designSlice.actions;

export const selectDesigns = (state: RootState) => state.design.designs;
export const selectDesignById = (state: RootState, designId: string) =>
  state.design.designs.find(design => design.id === designId);
export const selectCurrentDesign = (state: RootState) => state.design.currentDesign;

export const designReducer = designSlice.reducer;