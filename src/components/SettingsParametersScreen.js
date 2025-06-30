import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import ToggleSwitch from './ToggleSwitch';
import BackButton from './BackButton';
import { pixelToHeight } from '../styles/commonStyles';


function SettingsParameters({ navigation }) {
  const [smartFiltering, setSmartFiltering] = useState(false);
  const [vpnFiltering, setVpnFiltering] = useState(true);
  const [subscriptionControl, setSubscriptionControl] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [digitalMasking, setDigitalMasking] = useState(false);
  const [activityWidget, setActivityWidget] = useState(true);
  const [actionButton, setActionButton] = useState(false);
  const [autoConnect, setAutoConnect] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  const [vpnMasking, setVpnMasking] = useState(false);
  const [gpsSpoofing, setGpsSpoofing] = useState(false);
  const [p2pShare, setP2pShare] = useState(true);
  const [startupEnable, setStartupEnable] = useState(true);
  const [tempSessions, setTempSessions] = useState(false);

  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
        

      <ScrollView 
        contentContainerStyle={{ 
          alignItems: 'center',
          justifyContent: 'center',
          padding: pixelToHeight(10)
        }}
      >
        <Text style={styles.modeTitle}>Режим RESERVE</Text>
        <BackButton onPress={() => navigation.goBack()} />
        
        {/* Тумблеры */}
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
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Цифровая маскировка</Text>
            <ToggleSwitch
              value={digitalMasking}
              onValueChange={setDigitalMasking}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Виджет активности</Text>
            <ToggleSwitch
              value={activityWidget}
              onValueChange={setActivityWidget}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Поддержка ActionButton</Text>
            <ToggleSwitch
              value={actionButton}
              onValueChange={setActionButton}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Автоподключение в приложениях</Text>
            <ToggleSwitch
              value={autoConnect}
              onValueChange={setAutoConnect}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Функции Kill Switch</Text>
            <ToggleSwitch
              value={killSwitch}
              onValueChange={setKillSwitch}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Режим маскировки VPN</Text>
            <ToggleSwitch
              value={vpnMasking}
              onValueChange={setVpnMasking}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Подмена GPS-координат</Text>
            <ToggleSwitch
              value={gpsSpoofing}
              onValueChange={setGpsSpoofing}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>P2P Share</Text>
            <ToggleSwitch
              value={p2pShare}
              onValueChange={setP2pShare}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Включать при запуске</Text>
            <ToggleSwitch
              value={startupEnable}
              onValueChange={setStartupEnable}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Временные VPN-Сессии</Text>
            <ToggleSwitch
              value={tempSessions}
              onValueChange={setTempSessions}
            />
          </View>
        </View>
        
        {/* Разделительная полоса */}
        <View style={styles.divider}/>
        
        {/* Добавление белой полосы */}
        <View style={{ height: pixelToHeight(2), backgroundColor: '#FFFFFF', marginVertical: pixelToHeight(20) }} />
        
        {/* Навигационные элементы */}
        <TouchableOpacity 
          style={styles.navRow}
          onPress={() => navigation.navigate('VPNSettings')}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Выбор режима VPN</Text>
          <View style={{ width: pixelToHeight(30), alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navRow}
          onPress={() => navigation.navigate('ConnectionSettings')}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Настройки подключения</Text>
          <View style={{ width: pixelToHeight(30), alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
 
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  modeTitle: {
    fontSize: pixelToHeight(24),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: pixelToHeight(30),
    marginTop: pixelToHeight(15)
  },
  togglesContainer: {
    width: '100%',
    paddingHorizontal: pixelToHeight(10),
  },
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
  divider: {
    minHeight: pixelToHeight(2),
    height: pixelToHeight(2),
    minWidth: pixelToHeight(Dimensions.get('window').width - 40),
    backgroundColor: 'grey',
    marginTop: pixelToHeight(20),
    marginBottom: pixelToHeight(-20)
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
});

export default SettingsParameters;
