import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import StyleQuiz from '../components/StyleQuiz';
import { selectUser } from '../../redux/slices/userSlice';
import { fetchRecommendedProducts, selectRecommendedProducts } from '../../redux/slices/productSlice';
import API from '../../services/api';
import { getPersonalizedGreeting } from '../../utils/styleHelpers';

const HomeScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector(selectUser);
  const recommendedProducts = useSelector(selectRecommendedProducts);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadRecommendedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(fetchRecommendedProducts());
      } catch (err) {
        setError('Failed to load recommended products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedProducts();
  }, [dispatch]);

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const handleCustomDesignPress = () => {
    navigation.navigate('CustomDesignStudio');
  };

  const handleTrendingStylesPress = () => {
    navigation.navigate('TrendingStyles');
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Text style={styles.greeting}>{getPersonalizedGreeting(user)}</Text>

        {!user.hasCompletedStyleQuiz && (
          <StyleQuiz />
        )}

        {loading ? (
          <Text>Loading recommended products...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommendedProducts.map((product) => (
                <TouchableOpacity key={product.id} onPress={() => handleProductPress(product.id)}>
                  <ProductCard product={product} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity style={styles.customDesignButton} onPress={handleCustomDesignPress}>
          <Text style={styles.customDesignButtonText}>Create Custom Design</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.trendingStylesButton} onPress={handleTrendingStylesPress}>
          <Text style={styles.trendingStylesButtonText}>Explore Trending Styles</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  customDesignButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  customDesignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendingStylesButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  trendingStylesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

// TODO: Implement error handling for API calls
// TODO: Add loading indicators for async operations
// TODO: Implement pull-to-refresh functionality
// TODO: Optimize performance for large product lists
// TODO: Add analytics tracking for user interactions