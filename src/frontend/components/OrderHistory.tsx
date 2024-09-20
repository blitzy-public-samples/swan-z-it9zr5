import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { selectUser } from '../../redux/slices/userSlice';
import { fetchOrderHistory } from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/formatters';
import ProductCard from '../components/ProductCard';

interface Order {
  id: string;
  date: string;
  totalAmount: number;
  status: string;
  items: any[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const user = useSelector(selectUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadOrderHistory = async () => {
      try {
        const orderHistory = await fetchOrderHistory(user.id);
        setOrders(orderHistory);
      } catch (error) {
        console.error('Failed to fetch order history:', error);
        // TODO: Implement proper error handling
      }
    };

    loadOrderHistory();
  }, [user.id]);

  const renderOrderItem = ({ item }: { item: Order }) => {
    const { id, date, totalAmount, status } = item;
    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => navigation.navigate('OrderDetails', { orderId: id })}
      >
        <Text style={styles.orderInfo}>Order ID: {id}</Text>
        <Text style={styles.orderInfo}>Date: {formatDate(date)}</Text>
        <Text style={styles.orderInfo}>Total: {formatCurrency(totalAmount)}</Text>
        <Text style={[styles.orderStatus, { color: status === 'Delivered' ? 'green' : 'orange' }]}>
          Status: {status}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No orders found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderHistory;