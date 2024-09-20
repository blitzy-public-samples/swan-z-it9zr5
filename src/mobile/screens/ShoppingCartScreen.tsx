import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Card } from 'src/mobile/components/molecules/Card';
import { Header } from 'src/mobile/components/organisms/Header';
import { Footer } from 'src/mobile/components/organisms/Footer';
import { useTheme, useCart } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { CartItem, Product } from 'src/shared/types/index';
import { formatCurrency } from 'src/shared/utils/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

export const ShoppingCartScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const { theme } = useTheme();
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { fetchData } = useApi();
  const [products, setProducts] = useState<(CartItem & Product)[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = await Promise.all(
        cartItems.map(item => fetchData<Product>(`/products/${item.productId}`))
      );
      const cartProducts = cartItems.map((item, index) => ({
        ...item,
        ...productDetails[index].data,
      }));
      setProducts(cartProducts);
    };

    fetchProductDetails();
  }, [cartItems, fetchData]);

  useEffect(() => {
    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [products]);

  const renderCartItem = ({ item }: { item: CartItem & Product }) => (
    <Card style={styles.cartItem}>
      <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text variant="body">{item.name}</Text>
        <Text variant="caption">{formatCurrency(item.price)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.productId, item.quantity - 1)}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.productId, item.quantity + 1)}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button
        title="Remove"
        onPress={() => removeFromCart(item.productId)}
        variant="outline"
        size="small"
      />
    </Card>
  );

  const handleCheckout = () => {
    if (products.length > 0) {
      navigation.navigate('Checkout');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Header title="Shopping Cart" />
      <View style={styles.content}>
        <FlatList
          data={products}
          renderItem={renderCartItem}
          keyExtractor={item => item.productId}
          style={styles.cartList}
        />
        <View style={styles.totalContainer}>
          <Text variant="h2">Total:</Text>
          <Text variant="h2">{formatCurrency(totalPrice)}</Text>
        </View>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          disabled={products.length === 0}
          style={styles.checkoutButton}
        />
      </View>
      <Footer activeTab="Cart" />
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
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    padding: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  checkoutButton: {
    marginTop: 10,
  },
});