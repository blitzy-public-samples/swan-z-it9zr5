import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import HomeScreen from '../../screens/Home';
import ProductCatalogScreen from '../../screens/ProductCatalog';
import CustomDesignStudioScreen from '../../screens/CustomDesignStudio';
import ProfileScreen from '../../screens/Profile';
import { getTabBarStyle } from '../../utils/styleHelpers';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  let iconName: string;
  switch (name) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Catalog':
      iconName = focused ? 'grid' : 'grid-outline';
      break;
    case 'Design':
      iconName = focused ? 'brush' : 'brush-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'help-outline';
  }
  return <Ionicons name={iconName} size={24} color={focused ? '#007AFF' : '#8E8E93'} />;
};

const Navigation = () => {
  const user = useSelector((state: RootState) => state.user);
  const [tabBarStyle, setTabBarStyle] = useState(getTabBarStyle());

  useEffect(() => {
    // Update tab bar style when user state changes
    setTabBarStyle(getTabBarStyle(user));
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabBarIcon name={route.name} focused={focused} />,
        tabBarStyle: tabBarStyle,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Catalog" component={ProductCatalogScreen} />
      <Tab.Screen name="Design" component={CustomDesignStudioScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Navigation;

// Styles could be added here if needed
const styles = StyleSheet.create({
  // Add any additional styles for the navigation component
});