import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Modal, Dimensions } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import BackButton from './BackButton';
import TimePicker from './TimePicker';

function SettingsConnectionScreen({ navigation }) {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedConnectionTime, setSelectedConnectionTime] = useState('00:00:00');
  const [selectedDisconnectionTime, setSelectedDisconnectionTime] = useState('00:00:00');
  const [autoConnect, setAutoConnect] = useState('wifi'); // 'wifi' or 'mobile'
  const [timePickerType, setTimePickerType] = useState('connection'); // 'connection' or 'disconnection'

  const toggleAutoConnect = (type) => {
    if (autoConnect !== type) {
      setAutoConnect(type);
    }
  };

  const handleTimeChange = (newTime) => {
    if (timePickerType === 'connection') {
      setSelectedConnectionTime(newTime);
    } else {
      setSelectedDisconnectionTime(newTime);
    }
  };

  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[commonStyles.ontainer, { paddingTop: 25 }]}>
        <Text style={commonStyles.titleText}>Настройки сети</Text>
        <BackButton onPress={() => navigation.goBack()} />

        {/* Время подключения */}
        <View style={styles.timeContainer}>
          <Text style={styles.labelText}>Время подключения</Text>
          <TouchableOpacity 
            style={styles.timeBlock}
            onPress={() => {
              setTimePickerType('connection');
              setTimePickerVisible(true);
            }}
          >
            <Text style={styles.timeText}>{selectedConnectionTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Время отключения */}
        <View style={styles.timeContainer}>
          <Text style={styles.labelText}>Время отключения</Text>
          <TouchableOpacity 
            style={styles.timeBlock}
            onPress={() => {
              setTimePickerType('disconnection');
              setTimePickerVisible(true);
            }}
          >
            <Text style={styles.timeText}>{selectedDisconnectionTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Авто-подключение */}
        <Text style={styles.titleText}>Авто-подключение</Text>
        <View style={styles.autoConnectContainer}>
          <TouchableOpacity 
            style={[styles.autoConnectBlock, autoConnect === 'wifi' && styles.activeBlock]}
            onPress={() => toggleAutoConnect('wifi')}
          >
            <Text style={styles.autoConnectText}>По WI-FI</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.autoConnectBlock, autoConnect === 'mobile' && styles.activeBlock]}
            onPress={() => toggleAutoConnect('mobile')}
          >
            <Text style={styles.autoConnectText}>По мобильной сети</Text>
          </TouchableOpacity>
        </View>

        {/* Ссылки на вкладки */}
        <TouchableOpacity 
          style={commonStyles.linkButton}
          onPress={() => navigation.navigate('AppSelection')}
        >
          <Text style={commonStyles.linkText}>Приложения</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={commonStyles.linkButton}
          onPress={() => navigation.navigate('SiteSelection')}
        >
          <Text style={commonStyles.linkText}>Сайты</Text>
        </TouchableOpacity>

        {/* Навигационные элементы */}
        <TouchableOpacity 
          style={styles.navRow}
          onPress={() => navigation.navigate('AppSelection')}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Приложения</Text>
          <View style={{ width: 30, alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navRow}
          onPress={() => navigation.navigate('SiteSelection')}
        >
          <Text style={[styles.navText, { flex: 1 }]} numberOfLines={1}>Сайты</Text>
          <View style={{ width: 30, alignItems: 'flex-end' }}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Модальное окно выбора времени */}
      <Modal
        visible={isTimePickerVisible}
        transparent={true}
        animationType="slide"
      >
        <TimePicker 
          currentTime={timePickerType === 'connection' ? selectedConnectionTime : selectedDisconnectionTime}
          onTimeChange={handleTimeChange}
          onClose={() => setTimePickerVisible(false)}
        />
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  titleText: {
    marginTop: 20,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    color: '#723CEB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeContainer: {
    display: 'flex',
    width: Dimensions.get('window').width - 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  labelText: {
    color: '#D3D3D3', // Светло-серый
    marginRight: 10,
  },
  timeBlock: {
    borderColor: '#723CEB',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    maxWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  timeText: {
    color: '#D3D3D3', // Светло-серый
  },
  autoConnectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  autoConnectBlock: {
    flex: 1,
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  activeBlock: {
    borderColor: '#723CEB',
  },
  autoConnectText: {
    color: '#D3D3D3', // Светло-серый
  },
});

export default SettingsConnectionScreen;
