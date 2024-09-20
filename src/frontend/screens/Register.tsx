import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { register } from 'src/frontend/redux/slices/userSlice';
import { validateEmail, validatePassword } from 'src/frontend/utils/validation';
import Header from 'src/frontend/components/Header';
import Footer from 'src/frontend/components/Footer';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', name: '' });

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleRegister = async () => {
    // Reset errors
    setErrors({ email: '', password: '', name: '' });

    // Validate inputs
    let isValid = true;
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
      isValid = false;
    }
    if (!validatePassword(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long and contain at least one number and one special character' }));
      isValid = false;
    }
    if (name.trim().length === 0) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      isValid = false;
    }

    if (isValid) {
      try {
        await dispatch(register({ email, password, name }));
        // Navigate to the next screen (e.g., StyleQuiz or Home)
        navigation.navigate('StyleQuiz');
      } catch (error) {
        // Handle registration error
        setErrors(prev => ({ ...prev, email: 'Registration failed. Please try again.' }));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create an Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginLink: {
    marginTop: 20,
    color: '#007AFF',
  },
});

export default Register;