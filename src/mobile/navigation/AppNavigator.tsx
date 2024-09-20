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

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  const MainStack = createStackNavigator();

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Explore') {
            iconName = 'search';
          } else if (route.name === 'Design') {
            iconName = 'brush';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: COLOR_PALETTE.primary,
        inactiveTintColor: COLOR_PALETTE.text,
        style: {
          backgroundColor: theme.backgroundColor,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ProductCatalogScreen} />
      <Tab.Screen name="Design" component={CustomDesignStudioScreen} />
      <Tab.Screen name="Cart" component={ShoppingCartScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        {isAuthenticated ? (
          <Stack.Screen name="Main">
            {() => (
              <MainStack.Navigator>
                <MainStack.Screen name="TabNavigator" component={TabNavigator} />
                <MainStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
                <MainStack.Screen name="DesignCustomization" component={DesignCustomizationScreen} />
                <MainStack.Screen name="Checkout" component={CheckoutScreen} />
                <MainStack.Screen name="OrderHistory" component={OrderHistoryScreen} />
                <MainStack.Screen name="SavedDesigns" component={SavedDesignsScreen} />
                <MainStack.Screen name="StyleQuiz" component={StyleQuizScreen} />
              </MainStack.Navigator>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {() => (
              <AuthStack.Navigator>
                <AuthStack.Screen name="Login" component={LoginScreen} />
                <AuthStack.Screen name="Register" component={RegisterScreen} />
              </AuthStack.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};