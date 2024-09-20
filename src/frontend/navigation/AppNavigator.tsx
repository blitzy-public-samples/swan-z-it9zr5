import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import CustomTabBar from '../components/CustomTabBar';
import HomeScreen from '../screens/Home';
import ProductCatalogScreen from '../screens/ProductCatalog';
import ProductDetailsScreen from '../screens/ProductDetails';
import CustomDesignStudioScreen from '../screens/CustomDesignStudio';
import CheckoutScreen from '../screens/Checkout';
import ProfileScreen from '../screens/Profile';
import StyleQuizScreen from '../screens/StyleQuiz';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import { selectUser } from '../redux/slices/userSlice';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="ProductCatalog" component={ProductCatalogScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="CustomDesignStudio" component={CustomDesignStudioScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="StyleQuiz" component={StyleQuizScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const user = useSelector(selectUser);

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;