import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Input } from 'src/mobile/components/atoms/Input';
import { FormField } from 'src/mobile/components/molecules/FormField';
import { Header } from 'src/mobile/components/organisms/Header';
import { useTheme, useCart, useAuth } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { CartItem, Order } from 'src/shared/types/index';
import { formatCurrency } from 'src/shared/utils/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
}

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const { theme } = useTheme();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const api = useApi();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    fetchSavedAddressesAndPaymentMethods();
  }, []);

  const fetchSavedAddressesAndPaymentMethods = async () => {
    try {
      const savedAddresses = await api.get('/user/addresses');
      const savedPaymentMethods = await api.get('/user/payment-methods');
      
      if (savedAddresses.length > 0) {
        setShippingInfo(savedAddresses[0]);
      }
      setPaymentMethods(savedPaymentMethods);
    } catch (error) {
      console.error('Error fetching saved data:', error);
    }
  };

  const ShippingInfoForm: React.FC<{ shippingInfo: ShippingInfo; onUpdate: (info: ShippingInfo) => void }> = ({ shippingInfo, onUpdate }) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <FormField
          label="Full Name"
          value={shippingInfo.fullName}
          onChangeText={(text) => onUpdate({ ...shippingInfo, fullName: text })}
        />
        <FormField
          label="Address"
          value={shippingInfo.address}
          onChangeText={(text) => onUpdate({ ...shippingInfo, address: text })}
        />
        <FormField
          label="City"
          value={shippingInfo.city}
          onChangeText={(text) => onUpdate({ ...shippingInfo, city: text })}
        />
        <FormField
          label="State"
          value={shippingInfo.state}
          onChangeText={(text) => onUpdate({ ...shippingInfo, state: text })}
        />
        <FormField
          label="Zip Code"
          value={shippingInfo.zipCode}
          onChangeText={(text) => onUpdate({ ...shippingInfo, zipCode: text })}
        />
        <FormField
          label="Country"
          value={shippingInfo.country}
          onChangeText={(text) => onUpdate({ ...shippingInfo, country: text })}
        />
      </View>
    );
  };

  const PaymentMethodSelection: React.FC<{ paymentMethods: PaymentMethod[]; selectedMethod: PaymentMethod | null; onSelect: (method: PaymentMethod) => void }> = ({ paymentMethods, selectedMethod, onSelect }) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedMethod?.id === method.id && styles.selectedPaymentMethod,
            ]}
            onPress={() => onSelect(method)}
          >
            <Text>{`${method.type} ending in ${method.lastFour}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const OrderSummary: React.FC<{ cartItems: CartItem[] }> = ({ cartItems }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    const total = subtotal + tax;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.summaryItem}>
            <Text>{`${item.name} x${item.quantity}`}</Text>
            <Text>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text>Subtotal</Text>
          <Text>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Tax</Text>
          <Text>{formatCurrency(tax)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={{ fontWeight: 'bold' }}>Total</Text>
          <Text style={{ fontWeight: 'bold' }}>{formatCurrency(total)}</Text>
        </View>
      </View>
    );
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      const orderData = {
        shippingInfo,
        paymentMethodId: selectedPaymentMethod.id,
        cartItems,
        totalAmount,
      };

      const response = await api.post('/orders', orderData);
      await clearCart();
      alert('Order placed successfully!');
      navigation.navigate('OrderConfirmation', { orderId: response.data.orderId });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Checkout" />
      <ScrollView style={styles.content}>
        <ShippingInfoForm shippingInfo={shippingInfo} onUpdate={setShippingInfo} />
        <PaymentMethodSelection
          paymentMethods={paymentMethods}
          selectedMethod={selectedPaymentMethod}
          onSelect={setSelectedPaymentMethod}
        />
        <OrderSummary cartItems={cartItems} />
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
        />
      </ScrollView>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedPaymentMethod: {
    backgroundColor: 'lightblue',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  placeOrderButton: {
    marginTop: 20,
  },
});

export default CheckoutScreen;