import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, PanResponder } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'src/mobile/components/atoms/Text';
import { Button } from 'src/mobile/components/atoms/Button';
import { Header } from 'src/mobile/components/organisms/Header';
import { useTheme } from 'src/shared/contexts/index';
import { useApi } from 'src/shared/hooks/index';
import { useCart } from 'src/shared/contexts/index';
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

export const DesignCustomizationScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const route = useRoute();
  const { theme } = useTheme();
  const { callApi } = useApi();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null);
  const [templates, setTemplates] = useState<CustomDesign[]>([]);

  useEffect(() => {
    // Extract product and initial design from route params
    const { product: routeProduct, initialDesign } = route.params as { product: Product; initialDesign?: CustomDesign };
    setProduct(routeProduct);
    if (initialDesign) {
      setDesignElements(initialDesign.designElements);
    }

    // Fetch available design templates
    const fetchTemplates = async () => {
      const response = await callApi('GET', '/design-templates');
      if (response.success) {
        setTemplates(response.data);
      }
    };
    fetchTemplates();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (selectedElement) {
          handleElementManipulation(selectedElement.id, {
            x: gestureState.dx,
            y: gestureState.dy,
          });
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
        onPress={() => setSelectedElement(element)}
        {...panResponder.panHandlers}
      >
        {element.type === 'text' && <Text>{element.content}</Text>}
        {element.type === 'image' && <Image source={{ uri: element.content }} style={{ width: 50, height: 50 }} />}
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
    setDesignElements([...designElements, newElement]);
    setSelectedElement(newElement);
  };

  const handleAddImage = async () => {
    // Implement image picker functionality here
    // For now, we'll just add a placeholder image
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'image',
      content: 'https://via.placeholder.com/50',
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };
    setDesignElements([...designElements, newElement]);
    setSelectedElement(newElement);
  };

  const handleElementManipulation = (elementId: string, manipulationData: Partial<DesignElement>) => {
    setDesignElements(
      designElements.map((element) =>
        element.id === elementId ? { ...element, ...manipulationData } : element
      )
    );
  };

  const handleSaveDesign = async () => {
    try {
      const designData = {
        productId: product?.id,
        designElements,
      };
      const response = await callApi('POST', '/save-design', designData);
      if (response.success) {
        // Show success message
        navigation.goBack();
      }
    } catch (error) {
      // Handle error
      console.error('Failed to save design:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (product) {
        await addToCart({
          productId: product.id,
          quantity: 1,
          customDesign: {
            designElements,
          },
        });
        // Show success message
        navigation.navigate('Cart');
      }
    } catch (error) {
      // Handle error
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Customize Design" />
      <ScrollView style={styles.content}>
        <View style={styles.canvas}>
          {product && <Image source={{ uri: product.images[0] }} style={{ width: '100%', height: 300 }} />}
          {designElements.map(renderDesignElement)}
        </View>
        <View style={styles.toolbox}>
          <Button title="Add Text" onPress={handleAddText} />
          <Button title="Add Image" onPress={handleAddImage} />
          {/* Implement color picker and other tools here */}
        </View>
        <View style={styles.previewContainer}>
          {/* Implement design preview here */}
        </View>
        <View style={styles.actionButtons}>
          <Button title="Save Design" onPress={handleSaveDesign} />
          <Button title="Add to Cart" onPress={handleAddToCart} />
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
    flex: 1,
    padding: 10,
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
  colorPicker: {
    height: 40,
    marginBottom: 10,
  },
  previewContainer: {
    height: 200,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});