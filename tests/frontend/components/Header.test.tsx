import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Header } from '../../src/frontend/components/Header';
import { userSlice } from '../../src/frontend/redux/slices/userSlice';

const renderWithRedux = (
  component: React.ReactElement,
  initialState = {}
) => {
  const store = configureStore({
    reducer: { user: userSlice.reducer },
    preloadedState: initialState
  });
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Header component', () => {
  it('renders correctly when user is not logged in', () => {
    renderWithRedux(<Header />);
    expect(screen.getByAltText('Swan-Z Style Logo')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders correctly when user is logged in', () => {
    const loggedInState = {
      user: { isAuthenticated: true, name: 'John Doe' }
    };
    renderWithRedux(<Header />, loggedInState);
    expect(screen.getByAltText('Swan-Z Style Logo')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('navigates to home page when logo is clicked', () => {
    const mockNavigate = jest.fn();
    jest.mock('@react-navigation/native', () => ({
      useNavigation: () => ({ navigate: mockNavigate }),
    }));
    renderWithRedux(<Header />);
    fireEvent.press(screen.getByAltText('Swan-Z Style Logo'));
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('opens user menu when user name is clicked', () => {
    const loggedInState = {
      user: { isAuthenticated: true, name: 'John Doe' }
    };
    renderWithRedux(<Header />, loggedInState);
    fireEvent.press(screen.getByText('John Doe'));
    expect(screen.getByTestId('user-menu')).toBeVisible();
  });

  it('triggers logout when logout button is clicked', () => {
    const loggedInState = {
      user: { isAuthenticated: true, name: 'John Doe' }
    };
    const { store } = renderWithRedux(<Header />, loggedInState);
    fireEvent.press(screen.getByText('Logout'));
    expect(store.getState().user.isAuthenticated).toBe(false);
  });
});