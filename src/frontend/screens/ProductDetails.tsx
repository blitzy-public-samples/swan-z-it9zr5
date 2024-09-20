import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomDesignCanvas from '../../components/CustomDesignCanvas';
import ARViewer from '../../components/ARViewer';
import { selectProductById, fetchProductDetails } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import API from '../../services/api';
import { getStyleRecommendations } from '../../utils/styleHelpers';
import { applyCustomDesign } from '../../utils/designHelpers';
import ProductCard from '../../components/ProductCard';

const useProductDetails = (productId: string) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const cachedProduct = useSelector(state => selectProductById(state, productId));

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (cachedProduct) {
          setProduct(cachedProduct);
        } else {
          const fetchedProduct = await dispatch(fetchProductDetails(productId));
          setProduct(fetchedProduct.payload);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, dispatch, cachedProduct]);

  return { product, loading, error };
};

const ProductDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { productId } = route.params;
  const { product, loading, error } = useProductDetails(productId);
  const [customDesign, setCustomDesign] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showARViewer, setShowARViewer] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (product) {
      const fetchRelatedProducts = async () => {
        try {
          const recommendations = await getStyleRecommendations(product.category);
          setRelatedProducts(recommendations);
        } catch (err) {
          console.error('Failed to fetch related products:', err);
        }
      };
      fetchRelatedProducts();
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Show error message for size selection
      return;
    }
    const productToAdd = customDesign ? applyCustomDesign(product, customDesign) : product;
    dispatch(addToCart({ ...productToAdd, size: selectedSize }));
    // Show success message
    navigation.navigate('Cart');
  };

  const handleCustomDesignUpdate = (design) => {
    setCustomDesign(design);
  };

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={styles.container}><Text>Error: {error}</Text></View>;
  }

  if (!product) {
    return <View style={styles.container}><Text>Product not found</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>

      <View style={styles.sizeSelection}>
        {product.sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[styles.sizeButton, selectedSize === size && styles.selectedSize]}
            onPress={() => setSelectedSize(size)}
          >
            <Text>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {product.customizable && (
        <CustomDesignCanvas
          product={product}
          onDesignUpdate={handleCustomDesignUpdate}
        />
      )}

      <TouchableOpacity style={styles.arButton} onPress={() => setShowARViewer(true)}>
        <Text>View in AR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      {relatedProducts.length > 0 && (
        <View style={styles.relatedProducts}>
          <Text style={styles.relatedProductsTitle}>You might also like</Text>
          <ScrollView horizontal>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </ScrollView>
        </View>
      )}

      {showARViewer && (
        <ARViewer
          product={product}
          customDesign={customDesign}
          onClose={() => setShowARViewer(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    color: '#888',
    marginBottom: 16,
  },
  productDescription: {
    marginBottom: 16,
  },
  sizeSelection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sizeButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  selectedSize: {
    backgroundColor: '#e0e0e0',
  },
  arButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  relatedProducts: {
    marginTop: 24,
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default ProductDetails;