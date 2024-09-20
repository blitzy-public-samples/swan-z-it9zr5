import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Card } from 'src/mobile/components/molecules/Card';
import { Header } from 'src/mobile/components/organisms/Header';
import { Footer } from 'src/mobile/components/organisms/Footer';
import { useAuth, useTheme } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { User, Order, CustomDesign } from 'src/shared/types/index';
import { formatDate } from 'src/shared/utils/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { get } = useApi();

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<CustomDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const [ordersResponse, designsResponse] = await Promise.all([
          get<Order[]>('/orders?limit=5'),
          get<CustomDesign[]>('/designs?limit=5'),
        ]);
        setRecentOrders(ordersResponse.data);
        setSavedDesigns(designsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // TODO: Implement proper error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [get]);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card style={styles.orderItem}>
      <Text>Order #{item.id}</Text>
      <Text>{formatDate(item.createdAt)}</Text>
      <Text>{formatCurrency(item.totalAmount)}</Text>
      <Button
        title="View Details"
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
        size="small"
      />
    </Card>
  );

  const renderSavedDesign = ({ item }: { item: CustomDesign }) => (
    <Card style={styles.savedDesign}>
      <Image source={{ uri: item.previewImage }} style={styles.savedDesignImage} />
      <Text>{item.name}</Text>
      <Text>{formatDate(item.createdAt)}</Text>
      <Button
        title="Edit"
        onPress={() => navigation.navigate('DesignStudio', { designId: item.id })}
        size="small"
      />
    </Card>
  );

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleViewOrders = () => {
    navigation.navigate('OrderHistory');
  };

  const handleViewSavedDesigns = () => {
    navigation.navigate('SavedDesigns');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      // TODO: Implement proper error handling
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>; // TODO: Replace with a proper loading component
  }

  return (
    <View style={styles.container}>
      <Header title="My Profile" />
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.profilePicture || 'default_profile_picture' }}
            style={styles.profilePicture}
          />
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text>{user?.name}</Text>
          <Text>{user?.email}</Text>
        </View>

        <Button title="Account Settings" onPress={handleEditProfile} />

        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {recentOrders.map(renderOrderItem)}
        <Button title="View All Orders" onPress={handleViewOrders} />

        <Text style={styles.sectionTitle}>Saved Designs</Text>
        <ScrollView horizontal>
          {savedDesigns.map(renderSavedDesign)}
        </ScrollView>
        <Button title="View All Designs" onPress={handleViewSavedDesigns} />

        <Button
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          variant="outline"
        />
      </ScrollView>
      <Footer activeTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  userInfo: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    marginBottom: 10,
  },
  savedDesign: {
    width: 150,
    marginRight: 10,
  },
  savedDesignImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default UserProfileScreen;