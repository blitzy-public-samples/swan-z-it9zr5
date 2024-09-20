import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateUserProfile, selectUser } from '../../redux/slices/userSlice';
import { updateProfile } from '../../services/api';
import { validateEmail, validatePhoneNumber } from '../../utils/validation';
import Header from '../components/Header';
import { User } from '../../shared/types';

const UserProfile: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    if (!validateEmail(email)) {
      setError('Invalid email address');
      setIsLoading(false);
      return;
    }

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setError('Invalid phone number');
      setIsLoading(false);
      return;
    }

    try {
      const updatedUser = await updateProfile({ name, email, phoneNumber });
      dispatch(updateUserProfile(updatedUser));
      setIsLoading(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="User Profile" />
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profilePicture}
        />
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload New Picture</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Style Preferences</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('StyleQuiz')}
          style={styles.linkButton}
        >
          <Text style={styles.linkButtonText}>Update Style Preferences</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Order History</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('OrderHistory')}
          style={styles.linkButton}
        >
          <Text style={styles.linkButtonText}>View Full Order History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  uploadButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
  },
  linkButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default UserProfile;