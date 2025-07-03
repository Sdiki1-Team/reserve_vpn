import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, Image, Dimensions } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { pixelToHeight } from '../styles/commonStyles';
import BackButton from './BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Импорт фоновых изображений
const BackgroundStripes = require('../images/backgroud_stripes.png');
const BackgroundStripesActive = require('../images/background_stripes_active.png');

const { width } = Dimensions.get('window');

function ProfileScreen({ navigation }) {
  const [connected, setConnected] = useState(false); // Новое состояние connected

  // Загрузка состояния connected при фокусировке экрана
  useFocusEffect(
    React.useCallback(() => {
      const loadConnectedStatus = async () => {
        try {
          const storedConnected = await AsyncStorage.getItem('connected');
          if (storedConnected !== null) {
            setConnected(JSON.parse(storedConnected));
          }
        } catch (e) {
          console.error("Ошибка при загрузке connected из AsyncStorage в ProfileScreen:", e);
        }
      };
      loadConnectedStatus();
    }, [])
  );

  return (
    <ImageBackground
      source={connected ? BackgroundStripesActive : BackgroundStripes} // Динамический выбор фона
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[commonStyles.centeredContainer, { paddingTop: pixelToHeight(Platform.OS === 'ios' ? 75 : 50) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={commonStyles.titleText}>Profile</Text>

        <View style={styles.profileInfoContainer}>
          <View style={styles.profileImagePlaceholder}>
            <Image source={require('../images/icons/user.png')} style={styles.profileImage} />
          </View>
          <Text style={styles.username}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>123</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>45.6 GB</Text>
            <Text style={styles.statLabel}>Usage</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Devices</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => alert('Change Password')}
        >
          <Text style={styles.actionButtonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => alert('Manage Subscription')}
        >
          <Text style={styles.actionButtonText}>Manage Subscription</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => alert('Logout')}
        >
          <Text style={styles.actionButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  profileInfoContainer: {
    alignItems: 'center',
    marginBottom: pixelToHeight(30),
  },
  profileImagePlaceholder: {
    width: pixelToHeight(100),
    height: pixelToHeight(100),
    borderRadius: pixelToHeight(50),
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: pixelToHeight(10),
  },
  profileImage: {
    width: pixelToHeight(60),
    height: pixelToHeight(60),
    resizeMode: 'contain',
    tintColor: '#723CEB',
  },
  username: {
    color: 'white',
    fontSize: pixelToHeight(24),
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(16),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: pixelToHeight(30),
  },
  statBlock: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#723CEB',
    fontSize: pixelToHeight(22),
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(14),
  },
  actionButton: {
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    width: '90%',
    marginBottom: pixelToHeight(15),
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: pixelToHeight(18),
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
