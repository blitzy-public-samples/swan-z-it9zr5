import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SplashScreen from 'src/mobile/screens/SplashScreen';
import LoginScreen from 'src/mobile/screens/LoginScreen';
import RegisterScreen from 'src/mobile/screens/RegisterScreen';
import HomeScreen from 'src/mobile/screens/HomeScreen';
import StyleQuizScreen from 'src/mobile/screens/StyleQuizScreen';
import ProductCatalogScreen from 'src/mobile/screens/ProductCatalogScreen';
import CustomDesignStudioScreen from 'src/mobile/screens/CustomDesignStudioScreen';
import ShoppingCartScreen from 'src/mobile/screens/ShoppingCartScreen';
import UserProfileScreen from 'src/mobile/screens/UserProfileScreen';
import ProductDetailsScreen from 'src/mobile/screens/ProductDetailsScreen';
import DesignCustomizationScreen from 'src/mobile/screens/DesignCustomizationScreen';
import CheckoutScreen from 'src/mobile/screens/CheckoutScreen';
import OrderHistoryScreen from 'src/mobile/screens/OrderHistoryScreen';
import SavedDesignsScreen from 'src/mobile/screens/SavedDesignsScreen';

import { useAuth, useTheme } from 'src/shared/contexts/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';

// Type definitions for the navigators
type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Design: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

export const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Define tab bar options
  const tabBarOptions = {
    activeTintColor: COLOR_PALETTE.primary,
    inactiveTintColor: COLOR_PALETTE.text,
    style: {
      backgroundColor: theme.backgroundColor,
    },
  };

  const MainTabNavigator = () => (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ProductCatalogScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Design" 
        component={CustomDesignStudioScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="brush" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={ShoppingCartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );

  const AuthStackNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};