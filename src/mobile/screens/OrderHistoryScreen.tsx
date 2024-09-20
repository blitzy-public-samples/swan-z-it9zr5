import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Card } from 'src/mobile/components/molecules/Card';
import { Header } from 'src/mobile/components/organisms/Header';
import { Footer } from 'src/mobile/components/organisms/Footer';
import { useTheme, useAuth } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { Order } from 'src/shared/types/index';
import { formatCurrency, formatDate } from 'src/shared/utils/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

export const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get<Order[]>('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // TODO: Implement error handling
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const handleReorder = async (order: Order) => {
    try {
      await api.post('/cart/reorder', { orderId: order.id });
      // TODO: Show success message
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error reordering:', error);
      // TODO: Implement error handling
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.id}</Text>
        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={styles.orderTotal}>{formatCurrency(item.totalAmount)}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="View Details"
          onPress={() => handleViewOrderDetails(item.id)}
          variant="outline"
          size="small"
        />
        <Button
          title="Reorder"
          onPress={() => handleReorder(item)}
          variant="primary"
          size="small"
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Order History" />
      <View style={styles.content}>
        {loading ? (
          <Text>Loading orders...</Text>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>No orders found.</Text>}
          />
        )}
      </View>
      <Footer activeTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  orderItem: {
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderNumber: {
    fontWeight: 'bold',
  },
  orderDate: {
    color: 'gray',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderStatus: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});