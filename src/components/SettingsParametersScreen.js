import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, Modal, Linking } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { pixelToHeight } from '../styles/commonStyles';
import BackButton from './BackButton';
import ToggleSwitch from './ToggleSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Импорт фоновых изображений
const BackgroundStripes = require('../images/backgroud_stripes.png');
const BackgroundStripesActive = require('../images/background_stripes_active.png');

function SettingsParametersScreen({ navigation }) {
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [smartFiltering, setSmartFiltering] = useState(false);
  const [vpnFiltering, setVpnFiltering] = useState(true);
  const [subscriptionControl, setSubscriptionControl] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);
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
          console.error("Ошибка при загрузке connected из AsyncStorage в SettingsParametersScreen:", e);
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
      <View style={styles.container}>
        <Text style={[commonStyles.titleText, {marginTop: pixelToHeight(Platform.OS === 'ios' ? 30 : 0)}]}>Settings</Text>

        <View style={styles.togglesContainer}>
        <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Smart application filtering</Text>
            <ToggleSwitch
              isOn={smartFiltering}
              onToggle={setSmartFiltering}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>VPN service filtering</Text>
            <ToggleSwitch
              isOn={vpnFiltering}
              onToggle={setVpnFiltering}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Subscription control</Text>
            <ToggleSwitch
              isOn={subscriptionControl}
              onToggle={setSubscriptionControl}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>VPN auto switch</Text>
            <ToggleSwitch
              isOn={autoSwitch}
              onToggle={setAutoSwitch}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={[styles.purpleButton, styles.familyButton]} onPress={() => navigation.navigate('FamilySubscribe')}>
          <Text style={styles.buttonText}>Семейная подписка</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => setDeviceModalVisible(true)}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Мои устройства</Text>
          <View style={{ width: pixelToHeight(30), alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={deviceModalVisible}
          onRequestClose={() => setDeviceModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text>Здесь будет информация о ваших устройствах.</Text>
            <TouchableOpacity onPress={() => setDeviceModalVisible(false)}>
              <Text>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={languageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text>Здесь будет информация о ваших устройствах.</Text>
            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
              <Text>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => Linking.openURL('https://www.google.com')}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Поддержка</Text>
          <View style={{ width: pixelToHeight(30), alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navRow}
          onPress={() => Linking.openURL('https://www.google.com')}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Оцени приложение</Text>
          <View style={{ width: pixelToHeight(30), alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navRow}
          onPress={() => setLanguageModalVisible(true)}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Язык</Text>
          <View style={{ width: pixelToHeight(30), alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navRow}
          onPress={() => Linking.openURL('https://www.google.com')}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>О нас</Text>
          <View style={{ width: pixelToHeight(30), alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.purpleButton} onPress={() => navigation.navigate('SettingsParameters')}>
          <Text style={styles.buttonText}>Параметры RESERVE</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: pixelToHeight(20),
    alignItems: 'center',
  },
  togglesContainer: {
    width: '90%',
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    marginBottom: pixelToHeight(20),
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelToHeight(10),
  },
  toggleText: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(16),
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#444',
    marginVertical: pixelToHeight(15),
  },
  purpleButton: {
    backgroundColor: '#723CEB',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    width: '90%',
    alignItems: 'center',
    marginBottom: pixelToHeight(15),
  },
  buttonText: {
    color: 'white',
    fontSize: pixelToHeight(18),
    fontWeight: 'bold',
  },
  familyButton: {
    marginBottom: pixelToHeight(20),
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    marginBottom: pixelToHeight(10),
  },
  navText: {
    color: 'white',
    fontSize: pixelToHeight(16),
  },
  arrow: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(20),
  },
  modalView: {
    margin: pixelToHeight(20),
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(20),
    padding: pixelToHeight(35),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SettingsParametersScreen;
