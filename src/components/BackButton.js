import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { pixelToHeight } from '../styles/commonStyles';


const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      <Text style={styles.backButtonText}>❮</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(5),
    padding: pixelToHeight(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: pixelToHeight(40),
    minHeight: pixelToHeight(40),
    position: 'absolute',
    top: Platform.OS === 'ios' ? pixelToHeight(50) : pixelToHeight(20),
    left: pixelToHeight(20),
    zIndex: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: pixelToHeight(16),
  },
});

export default BackButton; 