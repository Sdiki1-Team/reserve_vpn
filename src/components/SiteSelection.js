// src/components/SiteSelection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BackButton from './BackButton';
import { pixelToHeight } from '../styles/commonStyles';


const SiteSelection = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Выбор сайтов</Text>
      {/* Здесь можно добавить логику выбора сайтов */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191920',
  },
  title: {
    color: '#D3D3D3',
    fontSize: pixelToHeight(24),
    marginBottom: pixelToHeight(20),
  },
});

export default SiteSelection;