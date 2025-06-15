import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import BackButton from './BackButton';

function FamilySubscribeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <BackButton onPress={() => navigation.goBack()} />
      
      <View style={styles.container}>
        <Text style={styles.header}>Семейная подписка</Text>
        
        <Image 
          source={require('../images/family.png')} 
          style={styles.familyImage} 
          resizeMode="contain"
        />
        
        <View style={styles.userInfoContainer}>
          <View style={styles.userDetails}>
            <Text style={styles.userLabel}>User</Text>
            <Text style={styles.deviceText}>Device: Iphone 11</Text>
            <Text style={styles.deviceText}>ID: 123</Text>
          </View>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.buttonText}>Удалить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  familyImage: {
    width: '80%', // Растягиваем на 80% ширины экрана
    height: 200, // Установите фиксированную высоту
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row', // Располагаем блоки в ряд
    alignItems: 'center',
    width: '100%', // Занимаем всю ширину
    paddingHorizontal: 20,
  },
  userDetails: {
    flex: 1, // Занимаем оставшееся пространство
    alignItems: 'flex-start',
  },
  userLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  deviceText: {
    fontSize: 16,
    color: '#D3D3D3', // Светло-серый цвет
    marginLeft: 15, // Смещение вправо
  },
  deleteButton: {
    backgroundColor: '#723CEB',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FamilySubscribeScreen;
