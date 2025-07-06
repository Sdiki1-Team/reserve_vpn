import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Platform, StyleSheet, ScrollView, Image, LayoutAnimation, UIManager, Animated } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { pixelToHeight } from '../styles/commonStyles';
import BackButton from './BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Импорт иконок для кнопки закрепления
const PinIcon = require('../images/icons/pin.png');
const PinActiveIcon = require('../images/icons/pin_active.png');
const ReloadIcon = require('../images/icons/spin_reload.png');

// Импорт фоновых изображений
const BackgroundStripes = require('../images/backgroud_stripes.png');
const BackgroundStripesActive = require('../images/background_stripes_active.png');

// Для LayoutAnimation на Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function ChangeServerScreen({ navigation, route }) {
  const [isAutomaticSelectionOn, setIsAutomaticSelectionOn] = useState(false);
  const [servers, setServers] = useState([
    { id: 1, name: "Moscow", location: "Moscow", ping: 65, isPinned: false },
    { id: 2, name: "New-York", location: "New-York", ping: 80, isPinned: false },
    { id: 3, name: "London", location: "London", ping: 120, isPinned: false },
    { id: 4, name: "Tokyo", location: "Tokyo", ping: 50, isPinned: false },
    { id: 5, name: "Paris", location: "Paris", ping: 90, isPinned: false },
    { id: 6, name: "Berlin", location: "Berlin", ping: 75, isPinned: false },
    { id: 7, name: "Sydney", location: "Sydney", ping: 150, isPinned: false },
  ].sort((a, b) => a.ping - b.ping)); // Изначальная сортировка по пингу
  const [activeServerId, setActiveServerId] = useState(null);
  const [connected, setConnected] = useState(false);

  // Ref для хранения анимированных значений каждого элемента списка
  const animatedValues = useRef({}).current;
  servers.forEach(server => {
    if (!animatedValues[server.id]) {
      animatedValues[server.id] = new Animated.Value(0); // Начальная прозрачность и смещение
    }
  });

  // Эффект для анимации появления элементов при загрузке
  useEffect(() => {
    const animations = servers.map((server, index) => {
      return Animated.timing(animatedValues[server.id], {
        toValue: 1,
        duration: 100, // Длительность появления одного элемента
        delay: 0, // Задержка для последовательного появления
        useNativeDriver: true,
      });
    });
    Animated.stagger(100, animations).start(); // Запуск анимации с задержкой между элементами
  }, [servers, animatedValues]); // Запускать при изменении списка серверов (например, при первой загрузке)

  // Загрузка активного сервера при монтировании компонента
  useEffect(() => {
    const loadActiveServer = async () => {
      try {
        const storedServerId = await AsyncStorage.getItem('activeServerId');
        if (storedServerId !== null) {
          setActiveServerId(parseInt(storedServerId, 10));
        }
      } catch (e) {
        console.error("Ошибка при загрузке активного сервера из AsyncStorage:", e);
      }
    };
    loadActiveServer();
  }, []);

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
          console.error("Ошибка при загрузке connected из AsyncStorage в ChangeServerScreen:", e);
        }
      };
      loadConnectedStatus();
    }, [])
  );

  const saveActiveServer = async (id) => {
    try {
      if (id === null) {
        await AsyncStorage.removeItem('activeServerId');
      } else {
        await AsyncStorage.setItem('activeServerId', id.toString());
      }
    } catch (e) {
      console.error("Ошибка при сохранении активного сервера в AsyncStorage:", e);
    }
  };

  const handleAutomaticSelectionToggle = () => {
    const newState = !isAutomaticSelectionOn;
    setIsAutomaticSelectionOn(newState);
    if (newState) {
      setActiveServerId(null);
      saveActiveServer(null);
    }
  };

  const handleRefreshServers = () => {
    console.log("Обновление серверов...");
  };

  const handleSelectServer = (id) => {
    setActiveServerId(id);
    saveActiveServer(id);
    setIsAutomaticSelectionOn(false);
  };

  const handlePinServer = (id) => {
    setServers(prevServers => {
      const newServers = prevServers.map(server => 
        server.id === id ? { ...server, isPinned: !server.isPinned } : server
      );
      const updatedServer = newServers.find(s => s.id === id);
      if (updatedServer && updatedServer.isPinned) {
        setActiveServerId(id);
        saveActiveServer(id);
        setIsAutomaticSelectionOn(false);
      } else if (updatedServer && !updatedServer.isPinned && activeServerId === id) {
        setActiveServerId(null);
        saveActiveServer(null);
      }

      // Применение LayoutAnimation для плавного перемещения элементов
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      // Сортировка: закрепленные серверы идут в начале, затем остальные по пингу
      return newServers.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return a.ping - b.ping; // Сортировка по пингу в возрастающем порядке
      });
    });
  };

  const renderPingIndicator = (ping) => {
    let activeBars = 0;
    let barColor = '#4CAF50';

    if (ping <= 50) activeBars = 4;
    else if (ping <= 80) activeBars = 3;
    else if (ping <= 120) {
      activeBars = 2;
      barColor = '#FFC107';
    } else {
      activeBars = 1;
      barColor = '#F44336';
    }

    return (
      <View style={styles.pingContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.pingBar,
              {
                backgroundColor: i <= activeBars ? barColor : '#FFFFFF',
                height: pixelToHeight(i * 4 + 2),
                opacity: i <= activeBars ? 1 : 0.3
              }
            ]}
          />
        ))}
        <Text style={styles.pingText}>{ping}ms</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={connected ? BackgroundStripesActive : BackgroundStripes} // Динамический выбор фона
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[commonStyles.centeredContainer, { paddingTop: 0, flex: 1 }]}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={[commonStyles.titleText, { paddingTop: Platform.OS === 'ios' ? pixelToHeight(55) : pixelToHeight(25) }]}>Выбор сервера</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefreshServers}
          >
            <Image source={require("../images/icons/spin_reload.png")} style={styles.reloadImage}></Image>
          </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.automaticSelectionButton, { backgroundColor: isAutomaticSelectionOn ? '#723CEB' : '#191919' }]}
          onPress={handleAutomaticSelectionToggle}
        >
          <Text style={styles.automaticSelectionButtonText}>Auto Select</Text>
        </TouchableOpacity>

        <View style={styles.listDivider} />

        <ScrollView style={styles.serverListContainer}>
          {servers.map(server => (
            <Animated.View
              key={server.id}
              style={[
                styles.serverItemContainer,
                {
                  opacity: animatedValues[server.id],
                  transform: [{
                    translateY: animatedValues[server.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0], // Вылетает снизу (50px) до своей позиции (0px)
                    }),
                  }],
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.serverItem,
                  activeServerId === server.id && styles.activeServerItem // Применить активный стиль
                ]}
                onPress={() => handleSelectServer(server.id)} // Обработка выбора при нажатии
              >
                <View style={styles.serverItemLeft}>
                  <Image source={require('../images/flag.png')} style={styles.flagIcon} />
                  <Text style={styles.serverItemName}>{server.name}</Text>
                </View>
                <View style={styles.serverItemRight}>
                  {renderPingIndicator(server.ping)}
                  <TouchableOpacity
                    style={styles.pinButton}
                    onPress={() => handlePinServer(server.id)}
                  >
                    {/* Иконка скрепки */}
                    <Image 
                      source={server.isPinned ? PinActiveIcon : PinIcon}
                      style={styles.pinIconImage}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  reloadImage: {
    height: pixelToHeight(20),
    width: pixelToHeight(20)
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: pixelToHeight(20),
    marginBottom: pixelToHeight(20),
  },
  refreshButton: {
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(5),
    padding: pixelToHeight(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: pixelToHeight(40),
    maxHeight: pixelToHeight(40),
    minHeight: pixelToHeight(40),
    minWidth: pixelToHeight(40),
    position: 'absolute',
    top: Platform.OS === 'ios' ? pixelToHeight(50) : pixelToHeight(20),
    right: pixelToHeight(20),
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: pixelToHeight(16),
  },
  automaticSelectionButton: {
    width: '100%',
    marginHorizontal: 'auto',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(7),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: pixelToHeight(15),
  },
  automaticSelectionButtonText: {
    color: 'white',
    fontSize: pixelToHeight(18),
  },
  listDivider: {
    width: '100%',
    marginHorizontal: 'auto',
    height: 1,
    backgroundColor: '#444',
    marginBottom: pixelToHeight(15),
  },
  serverListContainer: {
    flex: 1,
    width: '100%',
  },
  serverItemContainer: { // Новый стиль для контейнера анимированных элементов
    marginBottom: pixelToHeight(10), // Отступ между элементами
  },
  serverItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
  },
  activeServerItem: {
    borderColor: '#723CEB',
    borderWidth: pixelToHeight(2),
  },
  serverItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagPlaceholder: {
    width: pixelToHeight(20),
    height: pixelToHeight(12),
    backgroundColor: '#CCCCCC',
    marginRight: pixelToHeight(10),
  },
  flagIcon: {
    width: pixelToHeight(20),
    height: pixelToHeight(12),
    resizeMode: 'contain',
    marginRight: pixelToHeight(10),
  },
  serverItemName: {
    color: 'white',
    fontSize: pixelToHeight(16),
    fontWeight: 'bold',
  },
  serverItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: pixelToHeight(20),
    marginRight: pixelToHeight(10),
  },
  pingBar: {
    width: pixelToHeight(3),
    borderRadius: pixelToHeight(2),
    marginHorizontal: pixelToHeight(1),
  },
  pingText: {
    color: 'white',
    marginLeft: pixelToHeight(8),
    fontSize: pixelToHeight(12),
    marginTop: pixelToHeight(7)
  },
  pinButton: {
    padding: pixelToHeight(5),
  },
  pinIcon: {
    fontSize: pixelToHeight(20),
  },
  pinIconImage: {
    width: pixelToHeight(25),
    height: pixelToHeight(25),
    resizeMode: 'contain',
  },
});

export default ChangeServerScreen;
