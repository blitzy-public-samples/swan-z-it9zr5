import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth, useTheme } from 'src/shared/contexts/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { RootStackParamList } from 'src/mobile/components/organisms/Navigation';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const { theme } = useTheme();
  const logoOpacity = new Animated.Value(0);

  useEffect(() => {
    const initializeApp = async () => {
      // Start logo fade-in animation
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // Perform any necessary initialization tasks here
      // For example: loading cached data, checking for updates
      await checkAuthStatus();

      // Delay navigation to ensure animation completes and initialization tasks are done
      setTimeout(() => {
        navigation.replace(isAuthenticated ? 'Main' : 'Auth');
      }, 2000);
    };

    initializeApp();
  }, [navigation, logoOpacity, isAuthenticated, checkAuthStatus]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Animated.Image
        source={require('../../assets/images/app-logo.png')}
        style={[styles.logo, { opacity: logoOpacity }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;