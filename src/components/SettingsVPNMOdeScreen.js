import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles } from '../styles/commonStyles';
import BackButton from './BackButton';
import { pixelToHeight } from '../styles/commonStyles';


const modes = [
  {
    title: 'Классический',
    description: 'Для: повседневки — мессенджеры, банки, гугл',
    details: '(Нормальный шифр, автообновление, низкий пинг)',
  },
  {
    title: 'Турбо',
    description: 'Для: гейминга, торрента',
    details: '(Прямое соединение, минимальный пинг)',
  },
  {
    title: 'Стриминг',
    description: 'Для: Twitch, Netflix, YouTube',
    details: '(Высокие скорости и качество, быстрая загрузка)',
  },
  {
    title: 'Параноик',
    description: 'Для: секретных задач',
    details: '(Три слоя шифра, прыжки между серверами, антиотпечаток, ни DNS, ни WebRTC)',
  },
];

const STORAGE_KEY = 'selected_mode';

function SettingsVPNModeScreen({ navigation }) {
  const [selectedMode, setSelectedMode] = useState(0);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const loadSelectedMode = async () => {
      const storedMode = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMode !== null) {
        setSelectedMode(Number(storedMode));
      }
    };

    loadSelectedMode();
  }, []);

  const handleSelectMode = async (index) => {
    if (selectedMode === index) return;
    setSelectedMode(index);
    await AsyncStorage.setItem(STORAGE_KEY, index.toString());
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      animatedValue.setValue(0);
    });
  };

  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[commonStyles.container, { paddingTop: pixelToHeight(80), marginTop: 0 }]}>
        <Text style={[commonStyles.titleText, commonStyles.absouluteCenteredTitile]}>Выбор режима VPN</Text>
        <BackButton onPress={() => navigation.goBack()} />

        {modes.map((mode, index) => {
          const isSelected = selectedMode === index;
          const borderColor = isSelected ? '#723CEB' : 'transparent';
          const animatedScale = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.05],
          });

          return (
            <TouchableOpacity 
              key={index}
              style={[styles.modeBlock, { borderColor: borderColor, borderWidth: 2, transform: [{ scale: animatedScale }] }]}
              onPress={() => handleSelectMode(index)}
            >
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDescription}>{mode.description}</Text>
              <Text style={styles.modeDetails}>{mode.details}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  modeBlock: {
    backgroundColor: '#191920',
    borderRadius: pixelToHeight(15),
    padding: pixelToHeight(15),
    marginVertical: pixelToHeight(10),
    width: pixelToHeight(Dimensions.get('window').width / 100 * 95),
    alignItems: 'flex-start',
  },
  modeTitle: {
    fontSize: pixelToHeight(15),
    color: '#FFFFFF',
    marginBottom: 1,
  },
  modeDescription: {
    fontSize: pixelToHeight(15),
    color: '#7F8E9D',
  },
  modeDetails: {
    fontSize: pixelToHeight(15),
    color: '#723CEB',
  },
});

export default SettingsVPNModeScreen;
