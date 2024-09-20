import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Text from 'src/mobile/components/atoms/Text';
import Button from 'src/mobile/components/atoms/Button';
import Header from 'src/mobile/components/organisms/Header';
import { useTheme, useCart } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { Product } from 'src/shared/types/index';
import { formatCurrency } from 'src/shared/utils/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const route = useRoute();
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { productId } = route.params as { productId: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const { data: productData, loading, error } = useApi<Product>(`/products/${productId}`);

  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  const renderImageCarousel = (images: string[]) => {
    return (
      <ScrollView horizontal pagingEnabled style={styles.imageCarousel}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.productImage} />
        ))}
      </ScrollView>
    );
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      // Show error message for size selection
      return;
    }
    if (product) {
      await addToCart({
        productId: product.id,
        quantity,
        size: selectedSize,
      });
      // Show success message
      // Optionally navigate to cart screen
    }
  };

  const handleCustomize = () => {
    if (product) {
      navigation.navigate('CustomDesignStudio', { productId: product.id });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error || !product) {
    return <Text>Error loading product details</Text>;
  }

  return (
    <View style={styles.container}>
      <Header title={product.name} />
      <ScrollView style={styles.content}>
        {renderImageCarousel(product.images)}
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>{formatCurrency(product.basePrice)}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.sizeContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeOption,
                selectedSize === size && styles.selectedSize,
              ]}
              onPress={() => handleSizeSelect(size)}
            >
              <Text>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(quantity - 1)}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(quantity + 1)}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <Button title="Add to Cart" onPress={handleAddToCart} />
          {product.isCustomizable && (
            <Button title="Customize" onPress={handleCustomize} variant="outline" />
          )}
        </View>
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
  imageCarousel: {
    height: 300,
    marginBottom: 20,
  },
  productImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  description: {
    marginBottom: 20,
  },
  sizeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sizeOption: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedSize: {
    backgroundColor: 'lightblue',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  quantityText: {
    marginHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductDetailsScreen;