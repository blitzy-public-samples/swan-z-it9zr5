import { configureStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/storage';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import designReducer from './slices/designSlice';

// Define the root reducer by combining all slice reducers
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  cart: cartReducer,
  design: designReducer,
});

// Configure persistence options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'cart'], // Only persist user and cart state
};

// Create a persisted root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure middleware
const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  }),
  thunk,
];

// Create and configure the Redux store
const configureAppStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Create a persistor for the store
  const persistor = persistStore(store);

  // Return an object containing the store and persistor
  return { store, persistor };
};

export default configureAppStore;