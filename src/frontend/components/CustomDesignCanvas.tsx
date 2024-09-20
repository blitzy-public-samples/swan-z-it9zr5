import React, { useState, useEffect, useRef } from 'react';
import { View, PanResponder, Animated, StyleSheet } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { updateDesign, selectCurrentDesign } from '../../redux/slices/designSlice';
import { saveDesign } from '../../services/api';
import { generateSvgPath, applyColorToSvg } from '../../utils/designHelpers';
import ColorPicker from '../components/ColorPicker';
import Button from '../components/Button';

const CustomDesignCanvas = (props) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [scale, setScale] = useState(1);

  const canvasRef = useRef(null);
  const scaleRef = useRef(new Animated.Value(1));

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentDesign = useSelector(selectCurrentDesign);

  useEffect(() => {
    if (currentDesign) {
      setPaths(currentDesign.paths);
    }
  }, [currentDesign]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath(`M${locationX},${locationY}`);
    },
    onPanResponderMove: handlePanGesture,
    onPanResponderRelease: () => {
      setPaths([...paths, currentPath]);
      setCurrentPath(null);
    },
  });

  const handlePanGesture = (evt) => {
    const { locationX, locationY } = evt.nativeEvent;
    setCurrentPath((prevPath) => {
      const newPath = `${prevPath} L${locationX},${locationY}`;
      return generateSvgPath(newPath, brushSize, color);
    });
  };

  const handlePinchGesture = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const newScale = scale * event.nativeEvent.scale;
      setScale(newScale);
      Animated.spring(scaleRef.current, {
        toValue: newScale,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  const handleBrushSizeChange = (newSize) => {
    setBrushSize(newSize);
  };

  const saveDesign = async () => {
    try {
      const designData = {
        paths,
        color,
        brushSize,
      };
      const savedDesign = await saveDesign(designData);
      dispatch(updateDesign(savedDesign));
      // Show success message to user
    } catch (error) {
      // Handle error and show error message to user
      console.error('Failed to save design:', error);
    }
  };

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={handlePinchGesture}>
        <Animated.View style={[styles.canvasContainer, { transform: [{ scale: scaleRef.current }] }]}>
          <Svg
            ref={canvasRef}
            width="100%"
            height="100%"
            {...panResponder.panHandlers}
          >
            <G>
              {paths.map((path, index) => (
                <Path key={index} d={path} fill="none" stroke={color} strokeWidth={brushSize} />
              ))}
              {currentPath && (
                <Path d={currentPath} fill="none" stroke={color} strokeWidth={brushSize} />
              )}
            </G>
          </Svg>
        </Animated.View>
      </PinchGestureHandler>
      <View style={styles.controls}>
        <ColorPicker color={color} onColorChange={handleColorChange} />
        <Slider
          style={styles.brushSlider}
          minimumValue={1}
          maximumValue={20}
          value={brushSize}
          onValueChange={handleBrushSizeChange}
        />
        <Button title="Save Design" onPress={saveDesign} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  controls: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  brushSlider: {
    width: '100%',
    marginVertical: 10,
  },
});

export default CustomDesignCanvas;