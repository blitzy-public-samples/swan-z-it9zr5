import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import firebase from '@react-native-firebase/app';
import 'react-native-gesture-handler';

const setupFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      // Your Firebase configuration object goes here
    });

    if (!__DEV__) {
      firebase.analytics().setAnalyticsCollectionEnabled(true);
    }
  }
};

setupFirebase();

const SwanZStyleApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent('SwanZStyleApp', () => SwanZStyleApp);