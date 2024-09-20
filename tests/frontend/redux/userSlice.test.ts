import { configureStore } from '@reduxjs/toolkit';
import { userReducer, login, logout, updateProfile, setStylePreferences } from '../../src/frontend/redux/slices/userSlice';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAppDispatch } from '../../src/frontend/hooks/useAppDispatch';
import { useAppSelector } from '../../src/frontend/hooks/useAppSelector';

describe('User Slice', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        user: userReducer,
      },
    });
  };

  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('should handle initial state', () => {
    expect(store.getState().user).toEqual({
      currentUser: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      stylePreferences: [],
    });
  });

  it('should handle login action', () => {
    const user = { id: '1', name: 'Test User', email: 'test@example.com' };
    store.dispatch(login(user));
    expect(store.getState().user).toEqual({
      currentUser: user,
      isAuthenticated: true,
      loading: false,
      error: null,
      stylePreferences: [],
    });
  });

  it('should handle logout action', () => {
    // First login a user
    const user = { id: '1', name: 'Test User', email: 'test@example.com' };
    store.dispatch(login(user));

    // Then logout
    store.dispatch(logout());
    expect(store.getState().user).toEqual({
      currentUser: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      stylePreferences: [],
    });
  });

  it('should handle updateProfile action', () => {
    // First login a user
    const user = { id: '1', name: 'Test User', email: 'test@example.com' };
    store.dispatch(login(user));

    // Then update profile
    const updatedUser = { ...user, name: 'Updated User' };
    store.dispatch(updateProfile(updatedUser));
    expect(store.getState().user.currentUser).toEqual(updatedUser);
  });

  it('should handle setStylePreferences action', () => {
    const stylePreferences = [
      { category: 'color', preference: 'blue' },
      { category: 'style', preference: 'casual' },
    ];
    store.dispatch(setStylePreferences(stylePreferences));
    expect(store.getState().user.stylePreferences).toEqual(stylePreferences);
  });

  it('should work with useAppSelector hook', () => {
    const { result } = renderHook(() => useAppSelector(state => state.user), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toEqual({
      currentUser: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      stylePreferences: [],
    });
  });

  it('should work with useAppDispatch hook', () => {
    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    act(() => {
      result.current(login({ id: '1', name: 'Test User', email: 'test@example.com' }));
    });

    expect(store.getState().user.isAuthenticated).toBe(true);
  });
});