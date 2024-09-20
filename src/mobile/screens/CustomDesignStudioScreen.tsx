import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, PanResponder, PanResponderInstance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Header } from 'src/mobile/components/organisms/Header';
import { Footer } from 'src/mobile/components/organisms/Footer';
import { useTheme, useAuth } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { COLOR_PALETTE } from 'src/shared/constants/index';
import { Product, CustomDesign } from 'src/shared/types/index';
import { MainTabParamList } from 'src/mobile/components/organisms/Navigation';

interface DesignElement {
  id: string;
  type: string;
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const CustomDesignStudioScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const api = useApi();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [currentTool, setCurrentTool] = useState<string>('select');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?customizable=true');
      setProducts(response.data);
      if (response.data.length > 0) {
        setSelectedProduct(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const panResponder = useRef<PanResponderInstance>(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (currentTool === 'select' && designElements.length > 0) {
          const lastElement = designElements[designElements.length - 1];
          const updatedElement = {
            ...lastElement,
            x: lastElement.x + gestureState.dx,
            y: lastElement.y + gestureState.dy,
          };
          setDesignElements(prevElements => [
            ...prevElements.slice(0, -1),
            updatedElement,
          ]);
        }
      },
    })
  ).current;

  const renderDesignElement = (element: DesignElement) => {
    return (
      <TouchableOpacity
        key={element.id}
        style={[
          styles.designElement,
          {
            transform: [
              { translateX: element.x },
              { translateY: element.y },
              { scale: element.scale },
              { rotate: `${element.rotation}deg` },
            ],
          },
        ]}
        onPress={() => handleElementSelect(element.id)}
      >
        {element.type === 'text' ? (
          <Text>{element.content}</Text>
        ) : (
          <Image source={{ uri: element.content }} style={{ width: 50, height: 50 }} />
        )}
      </TouchableOpacity>
    );
  };

  const handleAddText = () => {
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'text',
      content: 'New Text',
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };
    setDesignElements(prevElements => [...prevElements, newElement]);
  };

  const handleAddImage = () => {
    // Implement image picker functionality here
    console.log('Add image functionality to be implemented');
  };

  const handleElementSelect = (id: string) => {
    setCurrentTool('select');
    // Implement element selection logic
  };

  const handleSaveDesign = async () => {
    try {
      const designData = {
        productId: selectedProduct?.id,
        elements: designElements,
      };
      await api.post('/designs', designData);
      navigation.navigate('SavedDesigns');
    } catch (error) {
      console.error('Error saving design:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        productId: selectedProduct?.id,
        customDesign: designElements,
      };
      await api.post('/cart', cartItem);
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Custom Design Studio" />
      <ScrollView style={styles.content}>
        <ScrollView horizontal style={styles.productCarousel}>
          {products.map(product => (
            <TouchableOpacity key={product.id} onPress={() => setSelectedProduct(product)}>
              <Image source={{ uri: product.images[0] }} style={{ width: 80, height: 80, marginRight: 10 }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.canvas} {...panResponder.panHandlers}>
          {selectedProduct && (
            <Image source={{ uri: selectedProduct.images[0] }} style={{ width: '100%', height: '100%' }} />
          )}
          {designElements.map(renderDesignElement)}
        </View>
        <View style={styles.toolbox}>
          <Button title="Add Text" onPress={handleAddText} />
          <Button title="Add Image" onPress={handleAddImage} />
          {/* Implement color picker here */}
        </View>
        <View style={styles.actionButtons}>
          <Button title="Save Design" onPress={handleSaveDesign} />
          <Button title="Add to Cart" onPress={handleAddToCart} />
        </View>
      </ScrollView>
      <Footer activeTab="Design" />
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
  productCarousel: {
    height: 100,
    marginBottom: 10,
  },
  canvas: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  toolbox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  designElement: {
    position: 'absolute',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});