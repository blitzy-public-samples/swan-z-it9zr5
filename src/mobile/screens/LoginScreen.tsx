import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Input } from 'src/mobile/components/atoms/Input';
import { Button } from 'src/mobile/components/atoms/Button';
import { FormField } from 'src/mobile/components/molecules/FormField';
import { useAuth, useTheme } from 'src/shared/contexts/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { validateEmail } from 'src/shared/utils/index';
import { AuthStackParamList } from 'src/mobile/components/organisms/Navigation';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    // Reset errors
    setErrors({ email: '', password: '' });

    // Validate inputs
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    try {
      await login(email, password);
      // Navigation to main app will be handled by the AuthProvider
    } catch (error) {
      // Handle login error
      setErrors(prev => ({ ...prev, password: 'Invalid email or password' }));
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <View style={styles.logo}>
        {/* TODO: Add app logo or title component */}
        <Text variant="h1" color={theme.primaryColor}>Swan-Z Style</Text>
      </View>

      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        error={errors.password}
      />

      <TouchableOpacity style={styles.forgotPassword}>
        <Text color={theme.primaryColor}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button title="Login" onPress={handleLogin} />

      <View style={styles.registerContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text color={theme.primaryColor}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 40,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;