import { configureStore } from '@reduxjs/toolkit';
import userReducer from 'src/mobile/redux/slices/userSlice';
import productReducer from 'src/mobile/redux/slices/productSlice';
import designReducer from 'src/mobile/redux/slices/designSlice';
import cartReducer from 'src/mobile/redux/slices/cartSlice';

const setupStore = () => {
  // Combine all reducers into a root reducer
  const rootReducer = {
    user: userReducer,
    product: productReducer,
    design: designReducer,
    cart: cartReducer,
  };

  // Configure the store with the root reducer
  const store = configureStore({
    reducer: rootReducer,
    // Apply any additional middleware
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    // Set up store enhancements (e.g., Redux DevTools)
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

// Create the store instance
export const store = setupStore();

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;