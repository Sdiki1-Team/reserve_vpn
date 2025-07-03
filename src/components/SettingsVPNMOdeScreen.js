import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Switch, Platform } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { pixelToHeight } from '../styles/commonStyles';
import BackButton from './BackButton';
import ToggleSwitch from './ToggleSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Импорт фоновых изображений
const BackgroundStripes = require('../images/backgroud_stripes.png');
const BackgroundStripesActive = require('../images/background_stripes_active.png');


function SettingsVPNMOdeScreen({ navigation }) {
  const [killSwitchEnabled, setKillSwitchEnabled] = useState(false);
  const [protocol, setProtocol] = useState('UDP');
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
          console.error("Ошибка при загрузке connected из AsyncStorage в SettingsVPNMOdeScreen:", e);
        }
      };
      loadConnectedStatus();
    }, [])
  );

  const handleKillSwitchToggle = () => {
    setKillSwitchEnabled(!killSwitchEnabled);
  };

  const handleProtocolChange = (newProtocol) => {
    setProtocol(newProtocol);
  };

  return (
    <ImageBackground
      source={connected ? BackgroundStripesActive : BackgroundStripes} // Динамический выбор фона
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[commonStyles.centeredContainer, { paddingTop: pixelToHeight(Platform.OS === 'ios' ? 75 : 50) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={commonStyles.titleText}>VPN Mode</Text>

        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Kill Switch</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Kill Switch</Text>
            <ToggleSwitch
              isOn={killSwitchEnabled}
              onToggle={handleKillSwitchToggle}
            />
          </View>
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Protocol</Text>
          <TouchableOpacity
            style={[styles.protocolButton, protocol === 'UDP' && styles.protocolButtonActive]}
            onPress={() => handleProtocolChange('UDP')}
          >
            <Text style={styles.protocolButtonText}>UDP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.protocolButton, protocol === 'TCP' && styles.protocolButtonActive]}
            onPress={() => handleProtocolChange('TCP')}
          >
            <Text style={styles.protocolButtonText}>TCP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  settingsGroup: {
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    width: '90%',
    marginBottom: pixelToHeight(20),
  },
  groupTitle: {
    color: 'white',
    fontSize: pixelToHeight(18),
    fontWeight: 'bold',
    marginBottom: pixelToHeight(10),
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelToHeight(10),
  },
  settingLabel: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(16),
  },
  protocolButton: {
    backgroundColor: '#333',
    borderRadius: pixelToHeight(8),
    paddingVertical: pixelToHeight(10),
    paddingHorizontal: pixelToHeight(15),
    marginBottom: pixelToHeight(10),
    alignItems: 'center',
  },
  protocolButtonActive: {
    backgroundColor: '#723CEB',
  },
  protocolButtonText: {
    color: 'white',
    fontSize: pixelToHeight(16),
    fontWeight: 'bold',
  },
});

export default SettingsVPNMOdeScreen;
