import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectUser, logout } from '../../redux/slices/userSlice';
import { AuthService } from '../../services/auth';
import { getHeaderStyle } from '../../utils/styleHelpers';
import { Navigation } from '../Navigation';

interface HeaderProps {
  showMenu: boolean;
  transparent: boolean;
}

const LOGO_URI = 'https://example.com/swan-z-style-logo.png'; // Replace with actual logo URI

const Header: React.FC<HeaderProps> = ({ showMenu, transparent }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      dispatch(logout());
      navigation.navigate('Home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const headerStyle = getHeaderStyle(transparent);

  return (
    <View style={[styles.container, headerStyle]}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={{ uri: LOGO_URI }} style={styles.logo} />
      </TouchableOpacity>
      
      {showMenu && (
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setIsMenuVisible(!isMenuVisible)}
        >
          <Text>Menu</Text>
        </TouchableOpacity>
      )}
      
      {isMenuVisible && <Navigation />}
      
      <View style={styles.userActions}>
        {user ? (
          <>
            <Text style={styles.userName}>{user.name}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  menuButton: {
    padding: 5,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 5,
  },
});

export default Header;

// TODO: Implement accessibility features for screen readers
// TODO: Add localization support for multi-language functionality
// TODO: Optimize logo image for faster loading on slower connections
// TODO: Implement A/B testing for different header layouts