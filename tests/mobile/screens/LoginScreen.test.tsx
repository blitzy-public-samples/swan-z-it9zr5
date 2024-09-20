import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from 'src/mobile/screens/LoginScreen';
import { AuthProvider } from 'src/shared/contexts/index';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock AuthContext
const mockLogin = jest.fn();
jest.mock('src/shared/contexts/index', () => ({
  ...jest.requireActual('src/shared/contexts/index'),
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe('LoginScreen component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  const renderLoginScreen = () => {
    return render(
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    );
  };

  it('renders login form elements', () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = renderLoginScreen();

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('submits the form with valid inputs', async () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message for invalid inputs', async () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();

    const emailInput = getByPlaceholderText('Email');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('navigates to registration screen', () => {
    const { getByText } = renderLoginScreen();

    const registerButton = getByText('Register');
    fireEvent.press(registerButton);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });
});