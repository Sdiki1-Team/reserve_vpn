import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { pixelToHeight } from '../styles/commonStyles';
import BackButton from './BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Импорт фоновых изображений
const BackgroundStripes = require('../images/backgroud_stripes.png');
const BackgroundStripesActive = require('../images/background_stripes_active.png');

function SettingsConnectionScreen({ navigation }) {
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
          console.error("Ошибка при загрузке connected из AsyncStorage в SettingsConnectionScreen:", e);
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
        <Text style={commonStyles.titleText}>Connection Settings</Text>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => alert('IP Configuration')}
        >
          <Text style={styles.settingButtonText}>IP Configuration</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => alert('DNS Settings')}
        >
          <Text style={styles.settingButtonText}>DNS Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => alert('Proxy Settings')}
        >
          <Text style={styles.settingButtonText}>Proxy Settings</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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

export default SettingsConnectionScreen;
