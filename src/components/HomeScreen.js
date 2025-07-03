import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, Image, Animated, Platform } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { commonStyles } from '../styles/commonStyles';
import LinearGradient from 'react-native-linear-gradient';
import { pixelToHeight } from '../styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';



const { width } = Dimensions.get('window');

function HomeScreen({ navigation }) {
  const [connected, setConnected] = useState(false);
  const [ping, setPing] = useState(65);
  const [selectedSpeedType, setSelectedSpeedType] = useState(null);
  const [showSpeedometer, setShowSpeedometer] = useState(false);
  const [currentServer, setCurrentServer] = useState(null);
  const [servers, setServers] = useState([
    { id: 1, name: "Moscow", location: "Moscow", speed: "100 Mbps" },
    { id: 2, name: "New-York", location: "New-York", speed: "200 Mbps" },
    { id: 3, name: "London", location: "London", speed: "150 Mbps" },
    { id: 4, name: "Tokyo", location: "Tokyo", speed: "300 Mbps" },
  ]);

  // Анимация волн
  const staticScales = useMemo(() => [1, 1, 1, 1.2, 1.4, 1.6], []);
  const staticOpacities = useMemo(() => [1, 1, 1, 0.8, 0.6, 0.3], []);
  const animatedScales = useRef(staticScales.map(scale => new Animated.Value(scale))).current;
  const animatedOpacities = useRef(staticOpacities.map(opacity => new Animated.Value(opacity))).current;
  const animationRefs = useRef([]);
  const [speedometerScale] = useState(new Animated.Value(0)); // Начальное значение для анимации
  const connectedAnimation = useRef(new Animated.Value(connected ? 1 : 0)).current; // Для анимации кнопки
  const speedInfoAnimation = useRef(new Animated.Value(0)).current; // Для анимации блоков скорости и времени

  // Устанавливаем значения по умолчанию
  const myIp = "192.168.1.35";
  const vpnIp = "10.8.0.2";
  const downloadSpeed = 45.6;
  const uploadSpeed = 12.3;

  // Устанавливаем первый сервер по умолчанию или загружаем активный
  useEffect(() => {
    if (servers.length > 0 && currentServer === null) {
      setCurrentServer(servers[0]);
    }
  }, [servers, currentServer]);

  // Загрузка активного сервера из AsyncStorage при фокусировке экрана
  useFocusEffect(
    React.useCallback(() => {
      const loadActiveServer = async () => {
        try {
          const storedServerId = await AsyncStorage.getItem('activeServerId');
          if (storedServerId !== null) {
            const foundServer = servers.find(s => s.id === parseInt(storedServerId, 10));
            if (foundServer) {
              setCurrentServer(foundServer);
            } else { // Если сохраненный сервер не найден в текущем списке
              setCurrentServer(servers[0]); // Установить первый по умолчанию
            }
          } else { // Если в AsyncStorage ничего нет
            setCurrentServer(servers[0]); // Установить первый по умолчанию
          }
        } catch (e) {
          console.error("Ошибка при загрузке активного сервера из AsyncStorage в HomeScreen:", e);
          setCurrentServer(servers[0]); // В случае ошибки также установить первый по умолчанию
        }
      };

      if (servers.length > 0) {
        loadActiveServer();
      }
    }, [servers])
  );

  useEffect(() => {
    if (connected) {
      // Сбросить все анимации
      animationRefs.current.forEach(ref => ref.stop());
      animationRefs.current = [];
      
      // Запустить анимацию для каждой волны
      const animations = staticScales.map((scale, index) => {
        const scaleTo = index === 0 ? 1.6 : index === 1 ? 1.4 : index === 2 ? 1.2 : index === 3 ? 1.8 : index === 4 ? 2 : 2.2;
        const opacityTo = index === 0 ? 0.3 : index === 1 ? 0.6 : index === 2 ? 0.8 : index === 3 ? 0 : index === 4 ? 0 : 0;

        // Устанавливаем задержку для первой и второй волн
        const delay = index === 2 ? 1600 : index === 1 ? 800 : 0;
        const opacityDurationDelta = index === 0 ? 0 : index === 1 ? 800: index === 2 ? 1600 : index === 3 ? 800 : index === 4 ? 1600 : index === 5 ? 2400 : 2400;

        return Animated.sequence([
          Animated.delay(delay), // Добавляем задержку перед анимацией
          Animated.parallel([
            Animated.timing(animatedScales[index], {
              toValue: scaleTo,
              duration: 3000 - delay,
              useNativeDriver: false,
            }),
            Animated.timing(animatedOpacities[index], {
              toValue: opacityTo,
              duration: 3000 - opacityDurationDelta,
              useNativeDriver: false,
            }),
          ]),
        ]);
      });

      // Запускаем все анимации одновременно
      Animated.parallel(animations).start();
    } else {
      // Сбросить анимацию при отключении
      animationRefs.current.forEach(ref => ref.stop());
      animationRefs.current = [];
      
      // Мгновенный сброс к начальному состоянию
      animatedScales.forEach((anim, index) => anim.setValue(staticScales[index]));
      animatedOpacities.forEach((opacity, index) => opacity.setValue(staticOpacities[index]));
    }
  }, [connected, animatedOpacities, animatedScales, staticScales, staticOpacities]);

  // Эффект для анимации кнопки подключения/отключения
  useEffect(() => {
    Animated.timing(connectedAnimation, {
      toValue: connected ? 1 : 0,
      duration: 200, // Увеличена длительность анимации
      useNativeDriver: true,
    }).start();
  }, [connected, connectedAnimation]);

  // Эффект для анимации блоков скорости и времени
  useEffect(() => {
    Animated.timing(speedInfoAnimation, {
      toValue: connected ? 1 : 0,
      duration: 200, // Быстрое появление/исчезание
      useNativeDriver: true,
    }).start();
  }, [connected, speedInfoAnimation]);

  // Запускаем анимацию при показе спидометра
  useEffect(() => {
    if (showSpeedometer) {
      Animated.timing(speedometerScale, {
        toValue: 1, // Конечное значение
        duration: 300, // Длительность анимации
        useNativeDriver: true,
      }).start();
    } else {
      // Сбрасываем масштаб, когда спидометр скрыт
      speedometerScale.setValue(0);
    }
  }, [showSpeedometer, speedometerScale]);

  const toggleConnection = () => {
    console.log('Кнопка нажата, состояние подключения:', !connected); // Временный лог для отладки
    const newState = !connected;
    setConnected(newState);
    if (!newState) {
      setShowSpeedometer(false);
      setSelectedSpeedType(null); // Сбрасываем выбор типа скорости
    }
  };

  const handleSpeedTypeSelect = (type) => {
    if (connected) {
      // Если уже выбран этот тип и спидометр показан - скрываем
      if (selectedSpeedType === type && showSpeedometer) {
        setShowSpeedometer(false);
      } 
      // Если выбран другой тип или спидометр не показан - показываем
      else {
        setSelectedSpeedType(type);
        setShowSpeedometer(true);
      }
    }
  };

  const renderServerPanel = () => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ChangeServer')}>
        <View style={styles.serverBar}>
          <View style={styles.serverLeftContent}>
          <Text style={styles.serverLabel}>Server</Text>
          <View style={styles.divider} />
            <Image source={require('../images/flag.png')} style={{height: 12, width: 20}}></Image>
          </View>
          {/* Центральное название сервера с абсолютным позиционированием */}
          <View style={styles.centeredServerNameWrapper}>
          <Text style={styles.serverName}>{currentServer?.name || "Choose a server"}</Text>
          </View>
          <View style={styles.serverRightContent}>
          {renderPingIndicator()}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWaves = () => {
    if (showSpeedometer) return null;
    
    return (
      <>
        {/* Всегда отображаем волны */}
        {staticScales.map((_, index) => (
          <Animated.View 
            key={index}
            style={[
              styles.wave, 
              { 
                borderColor: connected 
                             ? (index < 3 ? '#723CEB' : '#999') // Если подключено: первые 3 волны фиолетовые, остальные серые
                             : '#999', // Если отключено: все волны серые
                transform: [{ scale: animatedScales[index] }],
                opacity: animatedOpacities[index],
              }
            ]} 
          />
        ))}
      </>
    );
  };

  const renderSpeedometer = () => {
    if (!showSpeedometer) return null;

    const speed = selectedSpeedType === 'download' ? downloadSpeed : uploadSpeed;
    const speedColor = selectedSpeedType === 'download' ? '#723CEB' : '#FFFFFF';
    const speedLabel = selectedSpeedType === 'download' ? 'Download' : 'Upload';
    
    // Расчет положения указателя
    const fill = calculateFill(speed);
    const angle = 132.5 + (285 * fill / 100);
    const radian = (angle * Math.PI) / 180;
    const radius = pixelToHeight(105); // Радиус для указателя (внутренний радиус шкалы)
    const pointerX = pixelToHeight(110) + radius * Math.cos(radian);
    const pointerY = pixelToHeight(110) + radius * Math.sin(radian);

    // Метки для шкалы спидометра
    const marks = [[0, 0], [5, 1], [10, 2], [15, 3], [20, 4], [30, 5], [50, 6], [75, 7], [100, 8]];

    return (
      <TouchableOpacity 
        onPress={() => setShowSpeedometer(false)}
        activeOpacity={0.7}
        style={styles.absoluteSpeedometer}
      >
        <Animated.View style={{
          transform: [{ scale: speedometerScale }], // Применяем анимацию к масштабу
          opacity: speedometerScale, // Применяем анимацию к непрозрачности
        }}>
          <CircularProgress
            size={pixelToHeight(220)}
            width={pixelToHeight(8)}
            fill={fill}
            tintColor="white"
            backgroundColor="#333"
            rotation={217.5}
            arcSweepAngle={285}
            lineCap="round"
            children={() => (
              <View style={styles.speedValueContainer}>
                <Text style={[styles.speedTypeLabel, { fontSize: pixelToHeight(14) }]}>{speedLabel}</Text>
                <Text style={[styles.speedValue, { color: speedColor }]}>
                  {speed.toFixed(1)}
                </Text>
                <Text style={[styles.speedUnit, { fontSize: pixelToHeight(14) }]}>Mb/s</Text>
              </View>
            )}
          />

          {/* Метки шкалы */}
          <View style={styles.marksContainer}>
          {marks.map((value) => {
            // Рассчитываем положение метки на окружности
            const angle = 52 - ((8 - value[1]) / 8) * 285;
            const radian = (angle * Math.PI) / 180;
            const radius = pixelToHeight(130);
            const x = 100 + radius * Math.cos(radian);
            const y = 100 + radius * Math.sin(radian);
            
            return (
              <Text
                key={value[0]}
                style={[
                  styles.markText,
                  {
                    position: 'absolute',
                    left: x,
                    top: y,
                    color: value[0] <= speed ? '#FFFFFF' : '#AAAAAA',
                    fontWeight: value[0] <= speed ? 'bold' : 'normal'
                  }
                ]}
              >
                {value[0]}
              </Text>
            );
          })}
        </View>
          
          {/* Указатель */}
          <Animated.View 
            style={[
              styles.pointer, 
              { 
                left: pointerX - pixelToHeight(10),
                top: pointerY - pixelToHeight(10),
                shadowColor: '#FFF',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: pixelToHeight(5),
                elevation: 5,
              }
            ]}
          >
            <View style={styles.pointerInner} />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const calculateFill = (speed) => {
    if (speed < 20) return 50 * (speed / 20);
    if (speed < 30) return 50 + 1.25 * (speed - 20);
    if (speed < 50) return 62.5 + 0.625 * (speed - 30);
    return 75 + 0.5 * (speed - 50);
  };

  const renderConnectionButton = () => {
    if (showSpeedometer) return null;

    return (
      <View style={{
        width: pixelToHeight(150),
        height: pixelToHeight(150),
        position: 'relative', // Необходимо для абсолютного позиционирования дочерних элементов
      }}>
        {/* Кнопка в отключенном состоянии */}
        <Animated.View style={[
          styles.disconnectedButton,
          {
            position: 'absolute',
            opacity: connectedAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0], // Видна при отключении, исчезает при подключении
            }),
            zIndex: connectedAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 1], // Более высокий zIndex при отключении
            }),
          },
        ]}
        pointerEvents={connected ? 'none' : 'auto'}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', borderRadius: pixelToHeight(75) }}
            onPress={toggleConnection}
          >
            <Text style={styles.connectButtonText}>Reserve</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Кнопка в подключенном состоянии (LinearGradient) */}
        <Animated.View style={[
          styles.connectButton, // Используем существующий стиль connectButton для размеров и центрирования
          {
            position: 'absolute',
            opacity: connectedAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1], // Появляется при подключении, полностью видна при подключении
            }),
            zIndex: connectedAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 2], // Более высокий zIndex при подключении
            }),
          },
        ]}
        pointerEvents={connected ? 'auto' : 'none'}
        >
          <LinearGradient
            colors={['#723CEB', '#3D04BB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', borderRadius: pixelToHeight(75) }} // Применяем радиус границы к самому градиенту
          >
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', borderRadius: pixelToHeight(75) }}
              onPress={toggleConnection}
            >
              <Text style={styles.connectButtonText}>Reserve</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  const renderPingIndicator = () => {
    let activeBars = 0;
    let barColor = '#4CAF50'; // зеленый

    if (ping <= 50) activeBars = 4;
    else if (ping <= 80) activeBars = 3;
    else if (ping <= 120) {
      activeBars = 2;
      barColor = '#FFC107'; // желтый
    } else {
      activeBars = 1;
      barColor = '#F44336'; // красный
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

  const renderConnectionTime = () => {
    // Если спидометр показан, не рендерим время подключения
    if (showSpeedometer) return null;

    return (
      <Animated.View style={[
        styles.connectionTimeContainer,
        {
          opacity: speedInfoAnimation,
          transform: [{
            scale: speedInfoAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1], // Масштабирование от 80% до 100%
            }),
          }],
        }
      ]}>
        <Text style={styles.connectionTimeLabel}>Connection time</Text>
        <Text style={styles.connectionTime}>00:25:41</Text>
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[styles.container]}>
        <Text style={[commonStyles.titleText, { marginTop: pixelToHeight(Platform.OS == 'ios' ? 30 : 0), marginBottom: pixelToHeight(10) }]}>Reserve VPN</Text>
        
        {/* Панель сервера */}
        {renderServerPanel()}

        {/* Блок IP */}
        <View style={[styles.ipBlock, { borderColor: '#723CEB' }]}>
          <View style={styles.ipSection}>
            <Text style={styles.ipLabel}>My IP</Text>
            <Text style={styles.ipAddress}>{myIp}</Text>
          </View>
          <View style={[styles.arrowContainer]}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
          <View style={[styles.vpnIpContainer]}>
            <View
              style={styles.vpnIpInner}
            >
              <Text style={styles.ipLabel}>VPN IP</Text>
              <Text style={styles.ipAddress}>{vpnIp}</Text>
            </View>
          </View>
        </View>

        {/* Блоки скорости (теперь всегда рендерятся, но анимируются) */}
        <Animated.View style={[
          styles.speedContainer,
          {
            opacity: speedInfoAnimation,
            transform: [{
              scale: speedInfoAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            }],
          }
        ]}>
          <TouchableOpacity
            style={[
              styles.speedBlock,
              selectedSpeedType === 'download' && showSpeedometer && styles.speedBlockActive
            ]}
            onPress={() => handleSpeedTypeSelect('download')}
          >
            <Image
              source={require('../images/icons/download.png')}
              style={[styles.speedIcon, { 
                tintColor: '#723CEB' 
              }]}
            />
            <View>
              <Text style={[styles.speedLabel, { 
                color: selectedSpeedType === 'download' && showSpeedometer ? 'white' : '#AAAAAA', 
                fontSize: 14 
              }]}>
                Download
              </Text>
              <Text style={[styles.speedValueText, { 
                color: selectedSpeedType === 'download' && showSpeedometer ? 'white' : '#AAAAAA', 
                fontSize: 14 
              }]}>
                {downloadSpeed.toFixed(1)} Mb/s
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.verticalDivider} />

          <TouchableOpacity
            style={[
              styles.speedBlock,
              selectedSpeedType === 'upload' && showSpeedometer && styles.speedBlockActive
            ]}
            onPress={() => handleSpeedTypeSelect('upload')}
          >
            <Image
              source={require('../images/icons/upload.png')}
              style={[styles.speedIcon, { 
                tintColor: 'white' 
              }]}
            />
            <View>
              <Text style={[styles.speedLabel, { 
                color: selectedSpeedType === 'upload' && showSpeedometer ? 'white' : '#AAAAAA', 
                fontSize: 14 
              }]}>
                Upload
              </Text>
              <Text style={[styles.speedValueText, { 
                color: selectedSpeedType === 'upload' && showSpeedometer ? 'white' : '#AAAAAA', 
                fontSize: 14 
              }]}>
                {uploadSpeed.toFixed(1)} Mb/s
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Время подключения (теперь анимируется) */}
        {renderConnectionTime()}

        {/* Контейнер для кнопки/спидометра */}
        <View style={styles.buttonContainer}>
          {renderWaves()}
          {renderConnectionButton()}
          {renderSpeedometer()}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: pixelToHeight(20),
  },
  serverBar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(50),
    padding: pixelToHeight(10),
    paddingHorizontal: pixelToHeight(20), 
    marginBottom: pixelToHeight(5),
  },
  serverLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
  },
  serverRightContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  serverLabel: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(14),
  },
  divider: {
    height: pixelToHeight(20),
    width: pixelToHeight(1),
    backgroundColor: '#444',
    marginHorizontal: pixelToHeight(12),
  },
  serverName: {
    color: 'white',
    fontSize: pixelToHeight(16),
    lineHeight: pixelToHeight(16),
    fontWeight: 'bold',
  },
  pingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: pixelToHeight(20),
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
  ipBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: pixelToHeight(30),
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    marginVertical: pixelToHeight(15),
    alignItems: 'center',
    backgroundColor: 'rgba(25, 25, 25, 0.7)',
  },
  vpnIpInner: {
    paddingLeft: pixelToHeight(10),
  },
  ipLabel: {
    color: 'white',
    fontSize: pixelToHeight(18),
    fontWeight: 'bold',
  },
  ipAddress: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(14),
  },
  arrowContainer: {
    marginHorizontal: pixelToHeight(10),
  },
  arrowIcon: {
    color: 'white',
    fontSize: pixelToHeight(24),
    fontWeight: 'bold',
  },
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginVertical: pixelToHeight(15),
  },
  speedBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: pixelToHeight(8),
    padding: pixelToHeight(10),
    width: width * 0.42,
  },
  speedBlockActive: {
    borderColor: '#723CEB',
    borderWidth: 1,
  },
  speedIcon: {
    width: pixelToHeight(20),
    height: pixelToHeight(20),
    marginRight: pixelToHeight(8),
    resizeMode: 'contain',
  },
  speedLabel: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(12),
  },
  speedValueText: {
    color: 'white',
    fontSize: pixelToHeight(14),
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: pixelToHeight(80),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  connectButton: {
    width: pixelToHeight(150),
    height: pixelToHeight(150),
    borderRadius: pixelToHeight(75),
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: pixelToHeight(24),
    fontWeight: 'bold',
  },
  speedValueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedTypeLabel: {
    color: '#CCCCCC',
    fontSize: pixelToHeight(14),
    marginBottom: pixelToHeight(5),
  },
  speedValue: {
    fontSize: pixelToHeight(32),
    fontWeight: 'bold',
  },
  speedUnit: {
    fontSize: pixelToHeight(14),
    color: '#AAAAAA',
    marginTop: pixelToHeight(2),
  },
  wave: {
    position: 'absolute',
    width: pixelToHeight(150),
    height: pixelToHeight(150),
    borderRadius: pixelToHeight(75),
    borderWidth: pixelToHeight(1),
    top: '50%',
    left: '50%',
    marginTop: pixelToHeight(-75),
    marginLeft: pixelToHeight(-75),
  },
  verticalDivider: {
    width: 1,
    height: pixelToHeight(30),
    backgroundColor: '#CCCCCC',
    marginHorizontal: pixelToHeight(5),
    alignSelf: 'center',
  },
  pointer: {
    position: 'absolute',
    width: pixelToHeight(20),
    height: pixelToHeight(20),
    borderRadius: pixelToHeight(10),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointerInner: {
    width: pixelToHeight(10),
    height: pixelToHeight(10),
    borderRadius: pixelToHeight(5),
    backgroundColor: 'white',
  },
  connectionTimeContainer: {
    alignItems: 'center',
    marginTop: pixelToHeight(30),
    marginBottom: pixelToHeight(10),
  },
  connectionTimeLabel: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(14),
    marginBottom: pixelToHeight(0),
    marginTop: pixelToHeight(5),
  },
  connectionTime: {
    color: '#FFFFFF',
    fontSize: pixelToHeight(26),
    fontWeight: 'bold',
  },
  ipSection: {
    alignItems: 'center',
  },
  vpnIpContainer: {
    alignItems: 'center',
  },
  marksContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  markText: {
    fontSize: pixelToHeight(12),
    width: pixelToHeight(20),
    textAlign: 'center',
  },
  absoluteSpeedometer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: pixelToHeight(-110) }, { translateY: pixelToHeight(-180) }], // Центрируем спидометр
  },
  centeredServerNameWrapper: { 
    position: 'absolute', 
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectedButton: {
    width: pixelToHeight(150),
    height: pixelToHeight(150),
    borderRadius: pixelToHeight(75),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191919',
    borderWidth: 1,
    borderColor: 'grey',
  },
});

export default HomeScreen;