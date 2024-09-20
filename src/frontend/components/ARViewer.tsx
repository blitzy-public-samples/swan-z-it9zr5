import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ARView } from 'react-native-ar-kit';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { selectCurrentDesign } from '../../redux/slices/designSlice';
import { fetchARModel } from '../../services/api';
import { loadARModel, positionARModel } from '../../utils/arHelpers';
import { ARViewerProps } from '../../shared/types';

const ARViewer: React.FC<ARViewerProps> = (props) => {
  const [arModel, setARModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });
  const [modelRotation, setModelRotation] = useState(0);

  const currentDesign = useSelector(selectCurrentDesign);
  const arViewRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        const modelData = await fetchARModel(currentDesign.id);
        const loadedModel = await loadARModel(modelData);
        setARModel(loadedModel);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load AR model:', error);
        setIsLoading(false);
        // TODO: Implement proper error handling
      }
    };

    if (currentDesign) {
      loadModel();
    }
  }, [currentDesign]);

  const handleModelPosition = (x: number, y: number, z: number) => {
    const newPosition = positionARModel(arModel, x, y, z);
    setModelPosition(newPosition);
  };

  const handleModelRotation = (rotation: number) => {
    setModelRotation(rotation);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading AR model...</Text>
      ) : (
        <>
          <ARView
            ref={arViewRef}
            style={styles.arView}
            model={arModel}
            position={modelPosition}
            rotation={modelRotation}
          />
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => handleModelPosition(0, 0.1, 0)}>
              <Icon name="arrow-upward" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleModelPosition(0, -0.1, 0)}>
              <Icon name="arrow-downward" size={30} color="#fff" />
            </TouchableOpacity>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={360}
              value={modelRotation}
              onValueChange={handleModelRotation}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: 200,
  },
});

export default ARViewer;

// TODO: Implement error handling for AR model loading failures
// TODO: Add support for multiple AR frameworks (e.g., ARCore for Android)
// TODO: Optimize AR model loading and rendering for better performance
// TODO: Implement caching mechanism for frequently used AR models
// TODO: Conduct thorough testing of AR functionality on various devices and environments
// TODO: Implement accessibility features for AR controls
// TODO: Create documentation for AR usage and best practices for designers