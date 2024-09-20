import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { CardField, useStripe } from 'stripe-react-native';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShoppingCartSummary from '../../components/ShoppingCart';
import ShippingDetailsForm from '../../components/UserProfile';
import { placeOrder } from '../../services/api';
import { clearCart } from '../../redux/slices/cartSlice';
import { selectUser } from '../../redux/slices/userSlice';
import { validateShippingDetails } from '../../utils/validation';

const Checkout: React.FC = () => {
  const [shippingDetails, setShippingDetails] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const user = useSelector(selectUser);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { confirmPayment } = useStripe();

  useEffect(() => {
    // Pre-fill shipping details if user data is available
    if (user) {
      setShippingDetails({
        name: user.name,
        address: user.address,
        // Add other relevant user details
      });
    }
  }, [user]);

  const handleShippingSubmit = (details) => {
    if (validateShippingDetails(details)) {
      setShippingDetails(details);
      // Move to payment step
    } else {
      Alert.alert('Invalid Shipping Details', 'Please check your shipping information and try again.');
    }
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    try {
      // Process payment using Stripe
      const { paymentIntent, error } = await confirmPayment('client_secret_here', {
        type: 'Card',
        billingDetails: shippingDetails,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'Succeeded') {
        // Place order
        const order = await placeOrder({
          items: cartItems,
          shippingDetails,
          paymentInfo: paymentIntent,
        });

        // Clear cart
        dispatch(clearCart());

        // Navigate to order confirmation
        navigation.navigate('OrderConfirmation', { orderId: order.id });
      }
    } catch (error) {
      Alert.alert('Payment Failed', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <Text style={styles.title}>Checkout</Text>
        <ShoppingCartSummary items={cartItems} />
        <ShippingDetailsForm
          initialValues={shippingDetails}
          onSubmit={handleShippingSubmit}
        />
        <CardField
          postalCodeEnabled={true}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.cardStyle}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setPaymentInfo(cardDetails);
          }}
        />
        <Button
          title={isProcessing ? 'Processing...' : 'Place Order'}
          onPress={handlePaymentSubmit}
          disabled={isProcessing}
        />
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 20,
  },
  cardStyle: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
});

export default Checkout;

// TODO: Implement actual integration with Stripe API
// TODO: Add error handling for network failures
// TODO: Implement address validation service integration
// TODO: Add unit tests for component logic