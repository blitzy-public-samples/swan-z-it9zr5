import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { initializeAuth } from './services/auth';
import { ThemeProvider } from './utils/theme';
import ErrorBoundary from './components/ErrorBoundary';
import { initializeAnalytics } from './services/analytics';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize authentication service
    initializeAuth();

    // Initialize analytics service
    initializeAnalytics();

    // TODO: Implement proper error handling and logging
    // TODO: Set up performance monitoring
    // TODO: Configure deep linking
    // TODO: Implement app state management for background/foreground transitions
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar barStyle="dark-content" />
              <AppNavigator />
            </SafeAreaView>
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;