import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import UserProfile from '../../components/UserProfile';
import OrderHistory from '../../components/OrderHistory';
import StylePreferences from '../../components/StylePreferences';
import { selectUser, updateUserProfile } from '../../redux/slices/userSlice';
import { fetchUserProfile, fetchOrderHistory } from '../../services/api';
import { validateProfileData } from '../../utils/validation';

const ProfileScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [profileData, orderHistoryData] = await Promise.all([
          fetchUserProfile(user.id),
          fetchOrderHistory(user.id)
        ]);
        dispatch(updateUserProfile(profileData));
        setOrderHistory(orderHistoryData);
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user.id, dispatch]);

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      if (validateProfileData(updatedData)) {
        setLoading(true);
        const updatedProfile = await fetchUserProfile(user.id, updatedData);
        dispatch(updateUserProfile(updatedProfile));
        setError(null);
      } else {
        setError('Invalid profile data. Please check your inputs.');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigation.navigate('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="Profile" />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <UserProfile user={user} onUpdate={handleUpdateProfile} />
      <StylePreferences user={user} />
      <OrderHistory orders={orderHistory} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;