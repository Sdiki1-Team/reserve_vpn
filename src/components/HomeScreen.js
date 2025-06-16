import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, Image } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { commonStyles } from '../styles/commonStyles';

const { width } = Dimensions.get('window');

function HomeScreen({ navigation }) {
  const [connected, setConnected] = useState(false);
  const [ping, setPing] = useState(65);
  const [selectedSpeedType, setSelectedSpeedType] = useState('download');
  const [currentServer, setCurrentServer] = useState(null);
  const [servers, setServers] = useState([
    { id: 1, name: "Москва", location: "Москва", speed: "100 Mbps" },
    { id: 2, name: "Нью-Йорк", location: "Нью-Йорк", speed: "200 Mbps" },
    { id: 3, name: "Лондон", location: "Лондон", speed: "150 Mbps" },
    { id: 4, name: "Токио", location: "Токио", speed: "300 Mbps" },
  ]);
  const vpnIpRef = useRef(null);
  const [vpnIpWidth, setVpnIpWidth] = useState(0);

  // Устанавливаем значения по умолчанию
  const myIp = "192.168.1.35";
  const vpnIp = "10.8.0.2";
  const downloadSpeed = 45.6;
  const uploadSpeed = 12.3;

  useEffect(() => {
    // Устанавливаем первый сервер по умолчанию
    if (servers.length > 0) {
      setCurrentServer(servers[0]);
    }
  }, [servers]);

  const toggleConnection = () => {
    setConnected(!connected);
  };

  const handleVpnIpLayout = () => {
    if (vpnIpRef.current) {
      vpnIpRef.current.measure((x, y, width) => {
        setVpnIpWidth(width);
      });
    }
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
                height: i * 4 + 2,
                opacity: i <= activeBars ? 1 : 0.3
              }
            ]}
          />
        ))}
        <Text style={styles.pingText}>{ping}ms</Text>
      </View>
    );
  };

  const renderSpeedometer = () => {
    const speed = selectedSpeedType === 'download' ? downloadSpeed : uploadSpeed;
    if (speed < 20)
      var fill = 50 * (speed / 20);
    else if (speed < 30)
      var fill = 50 + 1.25 * (speed - 20);
    else if (speed < 50)
      var fill = 62.5 + 0.625 * (speed - 30);
    else 
      var fill = 75 + 0.5 * (speed - 50);
    
    // Равномерно распределенные метки
    const marks = [[0, 0], [5, 1], [10, 2], [15, 3], [20, 4], [30, 5], [50, 6], [75, 7], [100, 8]];
    
    return (
      <TouchableOpacity 
        onPress={connected ? toggleConnection : undefined}
        activeOpacity={connected ? 0.7 : 1}
      >
        <CircularProgress
          size={220}
          width={10}
          fill={fill}
          tintColor="white"
          backgroundColor="#333"
          rotation={217.5}
          arcSweepAngle={285}
          lineCap="round"
        >
          {(fill) => (
            <View style={styles.speedValueContainer}>
              <Text style={styles.speedValue}>
                {speed.toFixed(1)}
              </Text>
              <Text style={styles.speedUnit}>Мб/с</Text>
            </View>
          )}
        </CircularProgress>
        
        {/* Метки шкалы */}
        <View style={styles.marksContainer}>
          {marks.map((value) => {
            // Рассчитываем положение метки на окружности
            const angle = 52 - ((8 - value[1]) / 8) * 285;
            const radian = (angle * Math.PI) / 180;
            const radius = 130;
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
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[styles.centeredContainer, { paddingTop: 0, marginTop: 0 }]}>

        <Text style={[commonStyles.titleText, {marginTop: 0, marginBottom: 10}]}>Reserve VPN</Text>
        {/* Панель сервера */}
        <View style={styles.serverBar}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={styles.serverLabel}>Сервер</Text>
            <View style={styles.divider} />
            <Text style={styles.serverName}>{currentServer?.name || "Выберите сервер"}</Text>
          </View>
          {renderPingIndicator()}
        </View>

        {/* Блок IP */}
        <View style={[styles.ipBlock, { borderColor: '#723CEB'}]}>
          <View style={styles.ipSection}>
            <Text style={styles.ipLabel}>My IP</Text>
            <Text style={styles.ipAddress}>{myIp}</Text>
          </View>
          
          <View style={[styles.arrowContainer]}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
          
          <View style={[styles.vpnIpContainer]}>
            <View 
              ref={vpnIpRef}
              onLayout={handleVpnIpLayout}
              style={styles.vpnIpInner}
            >
              <Text style={styles.ipLabel}>VPN IP</Text>
              <Text style={styles.ipAddress}>{vpnIp}</Text>
            </View>
          </View>
        </View>

        {/* Блоки скорости */}
        <View style={styles.speedContainer}>
          <TouchableOpacity 
            style={[
              styles.speedBlock,
              selectedSpeedType === 'download' && styles.speedBlockActive
            ]}
            onPress={() => setSelectedSpeedType('download')}
          >
            <Image 
              source={require('../images/icons/download.png')} 
              style={styles.speedIcon} 
            />
            <View>
              <Text style={styles.speedLabel}>DOWNLOAD</Text>
              <Text style={styles.speedValueText}>{downloadSpeed.toFixed(1)} Mbps</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.speedBlock,
              selectedSpeedType === 'upload' && styles.speedBlockActive
            ]}
            onPress={() => setSelectedSpeedType('upload')}
          >
            <Image 
              source={require('../images/icons/upload.png')} 
              style={styles.speedIcon} 
            />
            <View>
              <Text style={styles.speedLabel}>UPLOAD</Text>
              <Text style={styles.speedValueText}>{uploadSpeed.toFixed(1)} Mbps</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Кнопка подключения/спидометр */}
        <View style={styles.buttonContainer}>
          {connected ? (
            renderSpeedometer()
          ) : (
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={toggleConnection}
            >
              <Text style={styles.connectButtonText}>RESERVE</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  serverBar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191919',
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 20, 
    marginBottom: 5,
  },
  serverLabel: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  divider: {
    height: 20,
    width: 1,
    backgroundColor: '#444',
    marginHorizontal: 12,
  },
  serverName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  pingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 20,
  },
  pingBar: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  pingText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 12,
  },
  ipBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(25, 25, 25, 0.7)',
  },
  vpnIpInner: {
    paddingLeft: 10,
  },
  ipLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ipAddress: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  arrowContainer: {
    marginHorizontal: 10,
  },
  arrowIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginVertical: 20,
  },
  speedBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191919',
    borderRadius: 8,
    padding: 15,
    width: width * 0.43,
  },
  speedBlockActive: {
    borderColor: '#723CEB',
    borderWidth: 1,
  },
  speedIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: '#723CEB',
  },
  speedLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  speedValueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    height: 220,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#723CEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  speedValueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#723CEB',
  },
  speedUnit: {
    fontSize: 16,
    color: '#AAAAAA',
    marginTop: -5,
  },
  marksContainer: {
    position: 'absolute',
    width: 220,
    height: 220,
    top: 0,
    left: 0,
  },
  markText: {
    fontSize: 12,
    width: 20,
    textAlign: 'center',
  },
  pointer: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointerInner: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default HomeScreen;