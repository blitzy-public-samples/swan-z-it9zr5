import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from 'src/shared/types/index';
import { RootState, AppDispatch } from 'src/mobile/redux/store';
import { api } from 'src/mobile/services/api';

// Define the initial state
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: object;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchProductsAsync = createAsyncThunk<Product[], { filters?: object }, { dispatch: AppDispatch, state: RootState }>(
  'products/fetchProducts',
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>('/products', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const fetchProductByIdAsync = createAsyncThunk<Product, string, { dispatch: AppDispatch, state: RootState }>(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get<Product>(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch product');
    }
  }
);

// Create the slice
export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<object>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setFilters } = productSlice.actions;

// Export reducer
export const productReducer = productSlice.reducer;

// Selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductById = (state: RootState, productId: string) => 
  state.products.products.find(product => product.id === productId);
export const selectFilteredProducts = (state: RootState) => {
  // Implement filtering logic here based on state.products.filters
  // This is a placeholder implementation
  return state.products.products;
};

export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;