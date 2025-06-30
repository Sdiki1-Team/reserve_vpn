import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { pixelToHeight } from '../styles/commonStyles';


const ToggleSwitch = ({ value, onValueChange, style }) => {
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const handlePress = () => {
    onValueChange(!value);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: value ? '#723CEB' : '#808080',
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
            backgroundColor: value ? '#723CEB' : '#FFFFFF',
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: pixelToHeight(44),
    height: pixelToHeight(24),
    borderRadius: pixelToHeight(12),
    padding: pixelToHeight(2),
    justifyContent: 'center',
    borderWidth: pixelToHeight(1),
    backgroundColor: '#191919',
  },
  thumb: {
    width: pixelToHeight(20),
    height: pixelToHeight(20),
    borderRadius: pixelToHeight(10),
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
});

export default ToggleSwitch; 