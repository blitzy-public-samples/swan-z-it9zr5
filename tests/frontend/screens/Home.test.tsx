import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Home from '../../src/frontend/screens/Home';
import { userReducer } from '../../src/frontend/redux/slices/userSlice';
import { productReducer } from '../../src/frontend/redux/slices/productSlice';

const renderWithRedux = (
  component: React.ReactElement,
  initialState = {}
) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      product: productReducer,
    },
    preloadedState: initialState,
  });

  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Home Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByText } = renderWithRedux(<Home />);
    
    await waitFor(() => {
      expect(getByText('Welcome to Swan-Z Style')).toBeTruthy();
    });
  });

  it('displays personalized greeting for logged-in user', async () => {
    const initialState = {
      user: {
        currentUser: { name: 'John Doe' },
      },
    };
    const { getByText } = renderWithRedux(<Home />, initialState);

    await waitFor(() => {
      expect(getByText('Welcome back, John Doe!')).toBeTruthy();
    });
  });

  it('shows style quiz for new users', async () => {
    const initialState = {
      user: {
        currentUser: { name: 'New User', hasCompletedStyleQuiz: false },
      },
    };
    const { getByText } = renderWithRedux(<Home />, initialState);

    await waitFor(() => {
      expect(getByText('Complete Your Style Quiz')).toBeTruthy();
    });
  });

  it('displays recommended products', async () => {
    const initialState = {
      product: {
        recommendedProducts: [
          { id: '1', name: 'Cool T-Shirt' },
          { id: '2', name: 'Stylish Jeans' },
        ],
      },
    };
    const { getByText } = renderWithRedux(<Home />, initialState);

    await waitFor(() => {
      expect(getByText('Recommended for You')).toBeTruthy();
      expect(getByText('Cool T-Shirt')).toBeTruthy();
      expect(getByText('Stylish Jeans')).toBeTruthy();
    });
  });

  it('navigates to product details when a product is tapped', async () => {
    const mockNavigate = jest.fn();
    jest.mock('@react-navigation/native', () => ({
      useNavigation: () => ({ navigate: mockNavigate }),
    }));

    const initialState = {
      product: {
        recommendedProducts: [
          { id: '1', name: 'Cool T-Shirt' },
        ],
      },
    };
    const { getByText } = renderWithRedux(<Home />, initialState);

    await waitFor(() => {
      fireEvent.press(getByText('Cool T-Shirt'));
      expect(mockNavigate).toHaveBeenCalledWith('ProductDetails', { productId: '1' });
    });
  });

  it('shows loading state while fetching data', async () => {
    const { getByTestId } = renderWithRedux(<Home />);

    expect(getByTestId('loading-indicator')).toBeTruthy();

    await waitFor(() => {
      expect(getByTestId('loading-indicator')).toBeFalsy();
    });
  });
});