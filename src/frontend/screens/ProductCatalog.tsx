import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchProducts, selectProducts, selectProductsStatus } from '../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Product } from '../../shared/types';
import FilterSort from '../components/FilterSort';

const ProductCatalog: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('');

  const products = useSelector(selectProducts);
  const status = useSelector(selectProductsStatus);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleFilterChange = (newFilters: object) => {
    setFilters(newFilters);
    // TODO: Implement actual filter logic
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    // TODO: Implement actual sort logic
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  if (status === 'loading') {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <FilterSort 
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productList: {
    padding: 10,
  },
});

export default ProductCatalog;