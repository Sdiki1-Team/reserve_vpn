// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';
// import { commonStyles } from '../styles/commonStyles';
// import { configService } from '../config/configs';

// const { width } = Dimensions.get('window');

// function HomeScreen({ navigation }) {
//   const [connected, setConnected] = useState(false);
//   const [ping, setPing] = useState(65);
//   const [selectedSpeedType, setSelectedSpeedType] = useState('download');
//   const [ipAnimation] = useState(new Animated.Value(0));
//   const [waveAnimation] = useState(new Animated.Value(0));
//   const [currentServer, setCurrentServer] = useState(null);
//   const [servers, setServers] = useState([]);
//   const vpnIpRef = useRef(null);
//   const [vpnIpWidth, setVpnIpWidth] = useState(0);

//   // Заглушки данных
//   const myIp = "192.168.1.35";
//   const vpnIp = "10.8.0.2";
//   const downloadSpeed = 45.6;
//   const uploadSpeed = 12.3;
//   const connectionTime = "00:40:32";

//   useEffect(() => {
//     // Загрузка серверов
//     const loadServers = () => {
//       try {
//         const allConfigs = configService.getAllConfigs();
//         setServers(allConfigs);
//         if (allConfigs.length > 0) {
//           setCurrentServer(allConfigs[0]);
//         }
//       } catch (error) {
//         console.error('Ошибка загрузки серверов:', error);
//       }
//     };

//     loadServers();
//   }, []);

//   useEffect(() => {
//     if (connected) {
//       Animated.timing(ipAnimation, {
//         toValue: 1,
//         duration: 500,
//         easing: Easing.out(Easing.exp),
//         useNativeDriver: false,
//       }).start();
//     } else {
//       ipAnimation.setValue(0);
//     }
//   }, [connected, ipAnimation]);

//   const toggleConnection = () => {
//     if (!connected) {
//       // Анимация волн при подключении
//       waveAnimation.setValue(0);
//       Animated.timing(waveAnimation, {
//         toValue: 1,
//         duration: 2000,
//         easing: Easing.out(Easing.exp),
//         useNativeDriver: false,
//       }).start();
//     }
//     setConnected(!connected);
//   };

//   const handleVpnIpLayout = () => {
//     if (vpnIpRef.current) {
//       vpnIpRef.current.measure((x, y, width) => {
//         setVpnIpWidth(width);
//       });
//     }
//   };

//   const renderPingIndicator = () => {
//     let activeBars = 0;
//     let barColor = '#4CAF50'; // зеленый

//     if (ping <= 50) activeBars = 4;
//     else if (ping <= 80) activeBars = 3;
//     else if (ping <= 120) {
//       activeBars = 2;
//       barColor = '#FFC107'; // желтый
//     } else {
//       activeBars = 1;
//       barColor = '#F44336'; // красный
//     }

//     return (
//       <View style={styles.pingContainer}>
//         {[1, 2, 3, 4].map((i) => (
//           <View
//             key={i}
//             style={[
//               styles.pingBar,
//               { 
//                 backgroundColor: i <= activeBars ? barColor : '#FFFFFF',
//                 height: i * 4 + 2,
//                 opacity: i <= activeBars ? 1 : 0.3
//               }
//             ]}
//           />
//         ))}
//         <Text style={styles.pingText}>{ping}ms</Text>
//       </View>
//     );
//   };

//   const renderSpeedometer = () => {
//     if (connected) {
//       const speed = selectedSpeedType === 'download' ? downloadSpeed : uploadSpeed;
//       const progress = Math.min(speed / 100, 1);
      
//       return (
//         <View style={styles.speedometerContainer}>
//           {/* Шкала спидометра */}
//           <View style={styles.speedometerScale}>
//             {[0, 5, 10, 15, 20, 30, 50, 75, 100].map((value) => (
//               <Text key={value} style={styles.scaleText}>{value}</Text>
//             ))}
//           </View>
          
//           {/* Прогресс */}
//           <View style={styles.progressTrack}>
//             <Animated.View 
//               style={[
//                 styles.progressFill,
//                 { 
//                   width: `${progress * 100}%`,
//                   backgroundColor: progress > 0.8 ? '#FF4081' : '#723CEB'
//                 }
//               ]}
//             />
//             <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
//           </View>
          
//           {/* Центральное значение */}
//           <Text style={styles.speedValue}>
//             {speed.toFixed(1)}
//             <Text style={styles.speedUnit}> Mbps</Text>
//           </Text>
//         </View>
//       );
//     } else {
//       return (
//         <View style={styles.timerContainer}>
//           <Text style={styles.timerLabel}>Время подключения</Text>
//           <Text style={styles.timerValue}>{connectionTime}</Text>
//         </View>
//       );
//     }
//   };

//   // Анимации для IP блока
//   const arrowOpacity = ipAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1]
//   });

//   const vpnIpAnimatedWidth = ipAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, vpnIpWidth]
//   });

//   // Анимация волн
//   const waveSize = waveAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 300]
//   });

//   const waveOpacity = waveAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 0]
//   });

//   return (
//     <ImageBackground
//       source={require('../images/backgroud_stripes.png')}
//       style={{ flex: 1 }}
//       resizeMode="stretch"
//     >
//       <View style={[commonStyles.centeredContainer, { paddingTop: 50 }]}>
//         {/* Панель сервера */}
//         <View style={styles.serverBar}>
//           <Text style={styles.serverLabel}>Сервер</Text>
//           <View style={styles.divider} />
//           <Text style={styles.serverName}>{currentServer?.name || "Выберите сервер"}</Text>
//           {renderPingIndicator()}
//         </View>

//         {/* Блок IP */}
//         <View style={[styles.ipBlock, { borderColor: connected ? '#723CEB' : 'transparent' }]}>
//           <View style={styles.ipSection}>
//             <Text style={styles.ipLabel}>My IP</Text>
//             <Text style={styles.ipAddress}>{myIp}</Text>
//           </View>
          
//           <Animated.View style={[styles.arrowContainer, { opacity: arrowOpacity }]}>
//             <Text style={styles.arrowIcon}>→</Text>
//           </Animated.View>
          
//           <Animated.View style={[styles.vpnIpContainer, { width: vpnIpAnimatedWidth }]}>
//             <View 
//               ref={vpnIpRef}
//               onLayout={handleVpnIpLayout}
//               style={styles.vpnIpInner}
//             >
//               <Text style={styles.ipLabel}>VPN IP</Text>
//               <Text style={styles.ipAddress}>{vpnIp}</Text>
//             </View>
//           </Animated.View>
//         </View>

//         {/* Блоки скорости */}
//         <View style={styles.speedContainer}>
//           <TouchableOpacity 
//             style={[
//               styles.speedBlock,
//               selectedSpeedType === 'download' && styles.speedBlockActive
//             ]}
//             onPress={() => setSelectedSpeedType('download')}
//           >
//             <Image 
//               source={require('../images/icons/download.png')} 
//               style={styles.speedIcon} 
//             />
//             <View>
//               <Text style={styles.speedLabel}>DOWNLOAD</Text>
//               <Text style={styles.speedValueText}>{downloadSpeed.toFixed(1)} Mbps</Text>
//             </View>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[
//               styles.speedBlock,
//               selectedSpeedType === 'upload' && styles.speedBlockActive
//             ]}
//             onPress={() => setSelectedSpeedType('upload')}
//           >
//             <Image 
//               source={require('../images/icons/upload.png')} 
//               style={styles.speedIcon} 
//             />
//             <View>
//               <Text style={styles.speedLabel}>UPLOAD</Text>
//               <Text style={styles.speedValueText}>{uploadSpeed.toFixed(1)} Mbps</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Спидометр/секундомер */}
//         {renderSpeedometer()}

//         {/* Кнопка с волнами */}
//         <View style={styles.buttonContainer}>
//           <Animated.View 
//             style={[
//               styles.wave, 
//               { 
//                 width: waveSize, 
//                 height: waveSize,
//                 opacity: waveOpacity,
//                 borderRadius: Animated.divide(waveSize, 2)
//               }
//             ]} 
//           />
//           <TouchableOpacity 
//             style={styles.connectButton}
//             onPress={toggleConnection}
//           >
//             <Text style={styles.connectButtonText}>
//               {connected ? "DISCONNECT" : "RESERVE"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   serverBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#191919',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//   },
//   serverLabel: {
//     color: '#AAAAAA',
//     fontSize: 14,
//   },
//   divider: {
//     height: 20,
//     width: 1,
//     backgroundColor: '#444',
//     marginHorizontal: 12,
//   },
//   serverName: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginRight: 15,
//   },
//   pingContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     height: 20,
//   },
//   pingBar: {
//     width: 3,
//     borderRadius: 2,
//     marginHorizontal: 1,
//   },
//   pingText: {
//     color: 'white',
//     marginLeft: 8,
//     fontSize: 12,
//   },
//   ipBlock: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 15,
//     marginVertical: 15,
//     alignItems: 'center',
//     backgroundColor: 'rgba(25, 25, 25, 0.7)',
//   },
//   ipSection: {
//     overflow: 'hidden',
//   },
//   vpnIpContainer: {
//     overflow: 'hidden',
//   },
//   vpnIpInner: {
//     paddingLeft: 10,
//   },
//   ipLabel: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   ipAddress: {
//     color: '#AAAAAA',
//     fontSize: 14,
//   },
//   arrowContainer: {
//     marginHorizontal: 10,
//   },
//   arrowIcon: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   speedContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: width * 0.9,
//     marginVertical: 20,
//   },
//   speedBlock: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#191919',
//     borderRadius: 8,
//     padding: 15,
//     width: width * 0.43,
//   },
//   speedBlockActive: {
//     borderColor: '#723CEB',
//     borderWidth: 1,
//   },
//   speedIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 10,
//     tintColor: '#723CEB',
//   },
//   speedLabel: {
//     color: '#AAAAAA',
//     fontSize: 12,
//   },
//   speedValueText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   speedometerContainer: {
//     height: 200,
//     width: width * 0.9,
//     marginVertical: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   speedometerScale: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     position: 'absolute',
//     top: 0,
//   },
//   scaleText: {
//     color: '#AAAAAA',
//     fontSize: 10,
//   },
//   progressTrack: {
//     height: 10,
//     width: '100%',
//     backgroundColor: '#333',
//     borderRadius: 5,
//     marginTop: 30,
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 5,
//     position: 'absolute',
//   },
//   progressThumb: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 2,
//     borderColor: '#723CEB',
//     top: -5,
//     marginLeft: -10,
//   },
//   speedValue: {
//     position: 'absolute',
//     color: '#723CEB',
//     fontSize: 32,
//     fontWeight: 'bold',
//   },
//   speedUnit: {
//     color: '#AAAAAA',
//     fontSize: 16,
//   },
//   timerContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   timerLabel: {
//     color: '#AAAAAA',
//     fontSize: 16,
//   },
//   timerValue: {
//     color: 'white',
//     fontSize: 32,
//     fontWeight: 'bold',
//     letterSpacing: 2,
//   },
//   buttonContainer: {
//     marginTop: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   wave: {
//     position: 'absolute',
//     borderWidth: 1,
//     borderColor: '#723CEB',
//   },
//   connectButton: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#723CEB',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   connectButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default HomeScreen;

import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[commonStyles.centeredContainer, { paddingTop: 50 }]}>
        <Text style={commonStyles.titleText}>Главный экран</Text>
        
        <TouchableOpacity 
          style={commonStyles.primaryButton}
          onPress={() => navigation.navigate('ChangeServer')}
        >
          <Text style={commonStyles.buttonText}>Выбрать сервер</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default HomeScreen;