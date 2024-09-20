import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Input } from 'src/mobile/components/atoms/Input';
import { Card } from 'src/mobile/components/molecules/Card';
import { Header } from 'src/mobile/components/organisms/Header';
import { Footer } from 'src/mobile/components/organisms/Footer';
import { useTheme, useCart } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { Product } from 'src/shared/types/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

interface FilterOptions {
  category: string;
  priceRange: string;
  sortBy: string;
}

export const ProductCatalogScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { fetchData } = useApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: '',
    priceRange: '',
    sortBy: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [filterOptions, searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await fetchData('/products', {
        params: { ...filterOptions, search: searchQuery },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // TODO: Implement error handling
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // TODO: Implement feedback for successful add to cart
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <Card style={styles.productItem}>
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text variant="h3">{item.name}</Text>
        <Text>{`$${item.basePrice.toFixed(2)}`}</Text>
      </View>
      <View style={styles.productActions}>
        <Button
          title="View Details"
          onPress={() => handleProductPress(item.id)}
          variant="outline"
          size="small"
        />
        <Button
          title="Add to Cart"
          onPress={() => handleAddToCart(item)}
          variant="primary"
          size="small"
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Product Catalog" />
      <View style={styles.content}>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={styles.filterContainer}>
          {/* TODO: Implement filter components */}
        </View>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          style={styles.productList}
        />
      </View>
      <Footer activeTab="Explore" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.background,
  },
  content: {
    padding: 10,
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productList: {
    flex: 1,
  },
  productItem: {
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  productDetails: {
    padding: 10,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});