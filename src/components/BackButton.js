import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
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
    position: 'absolute',
    top: pixelToHeight(20),
    left: pixelToHeight(20),
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(5),
    padding: pixelToHeight(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: pixelToHeight(40),
    minHeight: pixelToHeight(40),
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: pixelToHeight(16),
  },
});

export default BackButton; 