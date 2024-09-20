import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { selectCartItems, updateQuantity, removeItem } from '../../redux/slices/cartSlice';
import { selectUser } from '../../redux/slices/userSlice';
import ProductCard from '../ProductCard';
import { formatCurrency } from '../../utils/styleHelpers';
import { getProductDetails } from '../../services/api';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const cartItemsIds = useSelector(selectCartItems);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const items = await Promise.all(
          cartItemsIds.map(async (item) => {
            const productDetails = await getProductDetails(item.id);
            return { ...productDetails, quantity: item.quantity };
          })
        );
        setCartItems(items);
        calculateTotal(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        // TODO: Implement proper error handling
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [cartItemsIds]);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <ProductCard product={item} showAddToCart={false} />
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity === 1}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.quantity + 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  if (loading) {
    return <Text>Loading cart items...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Your cart is empty</Text>}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: {formatCurrency(total)}</Text>
        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton} disabled={cartItems.length === 0}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 16,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  totalContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 4,
  },
  checkoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShoppingCart;