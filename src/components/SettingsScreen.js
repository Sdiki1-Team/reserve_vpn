// src/components/SettingsParametersScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, Platform } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import ToggleSwitch from './ToggleSwitch';
import { Linking } from 'react-native';
import { pixelToHeight } from '../styles/commonStyles';


function SettingsParametersScreen({ navigation }) {
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [smartFiltering, setSmartFiltering] = useState(false);
  const [vpnFiltering, setVpnFiltering] = useState(true);
  const [subscriptionControl, setSubscriptionControl] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);

  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        {/* Тумблеры */}
        <Text style={[commonStyles.titleText, {marginTop: pixelToHeight(Platform.OS === 'ios' ? 30 : 0)}]}>Настройка</Text>

        <View style={styles.togglesContainer}>
        <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Умная фильтрация приложений</Text>
            <ToggleSwitch
              value={smartFiltering}
              onValueChange={setSmartFiltering}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Фильтрация VPN сервисов</Text>
            <ToggleSwitch
              value={vpnFiltering}
              onValueChange={setVpnFiltering}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Контроль действия подписки</Text>
            <ToggleSwitch
              value={subscriptionControl}
              onValueChange={setSubscriptionControl}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Автопереключение при сбое VPN</Text>
            <ToggleSwitch
              value={autoSwitch}
              onValueChange={setAutoSwitch}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Кнопка "Семейная подписка" */}
        <TouchableOpacity style={[styles.purpleButton, styles.familyButton]} onPress={() => navigation.navigate('FamilySubscribe')}>
          <Text style={styles.buttonText}>Семейная подписка</Text>
        </TouchableOpacity>

        {/* Ссылка "Мои устройства" */}
        <TouchableOpacity 
          style={styles.navRow}
          onPress={() => setDeviceModalVisible(true)}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Настройки подключения</Text>
          <View style={{ width: pixelToHeight(30), alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Модальное окно для "Мои устройства" */}
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

        {/* Ссылки на поддержку и оценку приложения */}
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

        {/* Кнопка "Параметры RESERVE" */}
        <TouchableOpacity style={styles.purpleButton} onPress={() => navigation.navigate('SettingsParameters')}>
          <Text style={styles.buttonText}>Параметры RESERVE</Text>
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
});

export default SettingsParametersScreen;