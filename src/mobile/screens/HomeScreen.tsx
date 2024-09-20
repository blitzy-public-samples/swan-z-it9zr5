import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
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
import { Product } from 'src/shared/types/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { get } = useApi();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await get<Product[]>('/products/featured');
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // TODO: Implement error handling
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <Text variant="caption">{item.name}</Text>
      <Text variant="body">${item.basePrice.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={`Welcome, ${user?.name}`} />
      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text variant="h2">Discover Your Style</Text>
          <Text variant="body">Explore personalized recommendations and create unique designs.</Text>
        </View>

        <View style={styles.featuredSection}>
          <Text variant="h3">Featured Products</Text>
          <FlatList
            data={featuredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.quickAccessSection}>
          <Button
            title="Style Quiz"
            onPress={() => navigation.navigate('StyleQuiz')}
            variant="secondary"
          />
          <Button
            title="Custom Design"
            onPress={() => navigation.navigate('CustomDesignStudio')}
            variant="secondary"
          />
        </View>
      </ScrollView>
      <Footer activeTab="Home" />
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
  welcomeSection: {
    marginBottom: 20,
  },
  featuredSection: {
    marginBottom: 20,
  },
  productItem: {
    width: 150,
    marginRight: 10,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  quickAccessSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});