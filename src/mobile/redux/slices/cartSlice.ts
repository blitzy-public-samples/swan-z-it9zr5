import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem, Product } from 'src/shared/types/index';
import { RootState, AppDispatch } from 'src/mobile/redux/store';
import { api } from 'src/mobile/services/api';

// Define the initial state using the CartState interface
const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Define async thunks
export const addToCartAsync = createAsyncThunk<
  CartItem,
  { productId: string; quantity: number; customDesignId?: string },
  { dispatch: AppDispatch; state: RootState }
>('cart/addToCart', async ({ productId, quantity, customDesignId }, { rejectWithValue }) => {
  try {
    const response = await api.post<CartItem>('/cart', { productId, quantity, customDesignId });
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to add item to cart');
  }
});

export const removeFromCartAsync = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: RootState }
>('cart/removeFromCart', async (cartItemId, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/${cartItemId}`);
  } catch (error) {
    return rejectWithValue('Failed to remove item from cart');
  }
});

export const updateCartItemQuantityAsync = createAsyncThunk<
  CartItem,
  { cartItemId: string; quantity: number },
  { dispatch: AppDispatch; state: RootState }
>('cart/updateCartItemQuantity', async ({ cartItemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.put<CartItem>(`/cart/${cartItemId}`, { quantity });
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to update cart item quantity');
  }
});

export const clearCartAsync = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart');
  } catch (error) {
    return rejectWithValue('Failed to clear cart');
  }
});

// Create the cart slice
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItemQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantityAsync.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCartItemQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the reducer
export const cartReducer = cartSlice.reducer;

// Export selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

// Export actions
export const cartActions = cartSlice.actions;