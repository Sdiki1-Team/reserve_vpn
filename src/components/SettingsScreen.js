// src/components/SettingsParametersScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, Platform } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import ToggleSwitch from './ToggleSwitch';
import { Linking } from 'react-native';
import { pixelToHeight } from '../styles/commonStyles';
import BackButton from './BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Импорт фоновых изображений
const BackgroundStripes = require('../images/backgroud_stripes.png');
const BackgroundStripesActive = require('../images/background_stripes_active.png');

function SettingsScreen({ navigation }) {
  const [connected, setConnected] = useState(false);

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
          console.error("Ошибка при загрузке connected из AsyncStorage в SettingsScreen:", e);
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
        <Text style={commonStyles.titleText}>Settings</Text>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => navigation.navigate('SettingsConnection')}
        >
          <Text style={styles.settingButtonText}>Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => navigation.navigate('SettingsVPNMOde')}
        >
          <Text style={styles.settingButtonText}>VPN Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => navigation.navigate('SettingsParameters')}
        >
          <Text style={styles.settingButtonText}>Parameters</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: pixelToHeight(4),
    marginBottom: 0,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: pixelToHeight(16),
    fontWeight: '500',
    flex: 1,
    marginRight: pixelToHeight(16),
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pixelToHeight(10),
    marginBottom: pixelToHeight(4),
  },
  navText: {
    color: '#FFFFFF',
    fontSize: pixelToHeight(16),
    fontWeight: '500',
  },
  arrow: {
    color: '#723CEB',
    fontSize: pixelToHeight(20),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: pixelToHeight(20),
  },
  togglesContainer: {
    width: '100%',
  },
  familyButton: {
    marginTop: pixelToHeight(25),
    marginBottom: pixelToHeight(40),
  },
  purpleButton: {
    backgroundColor: '#723CEB',
    minWidth: pixelToHeight(210),
    paddingVertical: pixelToHeight(5),
    fontWeight: '200',
    borderRadius: pixelToHeight(5),
    marginVertical: pixelToHeight(10),
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  link: {
    marginVertical: pixelToHeight(5),
  },
  linkText: {
    color: '#723CEB',
    fontSize: pixelToHeight(16),
  },
  divider: {
    height: pixelToHeight(2),
    backgroundColor: 'grey',
    marginVertical: pixelToHeight(20),
    width: '100%',
  },
  modalView: {
    margin: pixelToHeight(20),
    backgroundColor: 'white',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(35),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: pixelToHeight(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: pixelToHeight(4),
    elevation: 5,
  },
  settingButton: {
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    width: '90%',
    marginBottom: pixelToHeight(15),
    alignItems: 'center',
  },
  settingButtonText: {
    color: 'white',
    fontSize: pixelToHeight(18),
    fontWeight: 'bold',
  },
});

export default SettingsScreen;