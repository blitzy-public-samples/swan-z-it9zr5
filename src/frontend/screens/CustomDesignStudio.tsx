import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CustomDesignCanvas from '../components/CustomDesignCanvas';
import ARViewer from '../components/ARViewer';
import { selectCurrentDesign, updateDesign, generateAIDesign } from '../redux/slices/designSlice';
import { selectSelectedProduct } from '../redux/slices/productSlice';
import { saveDesign } from '../services/api';
import { applyDesignToProduct } from '../utils/designHelpers';
import { Design, Product } from '../../shared/types';

const CustomDesignStudio: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentDesign = useSelector(selectCurrentDesign);
  const selectedProduct = useSelector(selectSelectedProduct);

  const [design, setDesign] = useState<Design | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isARMode, setIsARMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentDesign) setDesign(currentDesign);
    if (selectedProduct) setProduct(selectedProduct);
  }, [currentDesign, selectedProduct]);

  const handleDesignUpdate = (updatedDesign: Design) => {
    setDesign(updatedDesign);
    dispatch(updateDesign(updatedDesign));
  };

  const handleAIGeneration = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const generatedDesign = await dispatch(generateAIDesign());
      setDesign(generatedDesign);
    } catch (err) {
      setError('Failed to generate AI design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDesign = async () => {
    if (!design) return;
    try {
      setIsLoading(true);
      setError(null);
      await saveDesign(design);
      // Show success message
      alert('Design saved successfully!');
    } catch (err) {
      setError('Failed to save design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleARMode = () => {
    setIsARMode(!isARMode);
  };

  return (
    <View style={styles.container}>
      {isARMode ? (
        <ARViewer design={design} product={product} />
      ) : (
        <CustomDesignCanvas
          design={design}
          product={product}
          onDesignUpdate={handleDesignUpdate}
        />
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleAIGeneration}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Generate AI Design</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveDesign}
          disabled={isLoading || !design}
        >
          <Text style={styles.buttonText}>Save Design</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={toggleARMode}>
          <Text style={styles.buttonText}>
            {isARMode ? 'Exit AR Mode' : 'Enter AR Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CustomDesignStudio;