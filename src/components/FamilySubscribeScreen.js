import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { pixelToHeight } from '../styles/commonStyles';
import BackButton from './BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Импорт фоновых изображений
const BackgroundStripes = require('../images/backgroud_stripes.png');
const BackgroundStripesActive = require('../images/background_stripes_active.png');
const familyIcon = require('../images/family.png'); // Добавленный импорт для семейной иконки

const { width } = Dimensions.get('window');

function FamilySubscribeScreen({ navigation }) {
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
          console.error("Ошибка при загрузке connected из AsyncStorage в FamilySubscribeScreen:", e);
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
      <ScrollView contentContainerStyle={[commonStyles.container, { paddingTop: pixelToHeight(Platform.OS === 'ios' ? 75 : 50) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={commonStyles.titleText}>Family Subscription</Text>

        <View style={styles.promoBox}>
          <Image source={familyIcon} style={styles.familyIcon} />
          <Text style={styles.promoText}>Invite friends and family</Text>
          <Text style={styles.promoDescription}>Share your VPN with up to 5 devices</Text>
        </View>

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => alert('Invite Friend')}
        >
          <Text style={styles.inviteButtonText}>Invite Friend</Text>
        </TouchableOpacity>

        <View style={styles.memberList}>
          <Text style={styles.sectionTitle}>Family Members</Text>
          <View style={styles.memberItem}>
            <Text style={styles.memberName}>Member 1</Text>
            <TouchableOpacity onPress={() => alert('Remove Member 1')}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.memberItem}>
            <Text style={styles.memberName}>Member 2</Text>
            <TouchableOpacity onPress={() => alert('Remove Member 2')}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
          {/* Добавьте больше участников по мере необходимости */}
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  promoBox: {
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(20),
    alignItems: 'center',
    marginBottom: pixelToHeight(20),
    width: '90%',
    alignSelf: 'center',
  },
  familyIcon: {
    width: pixelToHeight(80),
    height: pixelToHeight(80),
    resizeMode: 'contain',
    marginBottom: pixelToHeight(15),
  },
  promoText: {
    color: 'white',
    fontSize: pixelToHeight(22),
    fontWeight: 'bold',
    marginBottom: pixelToHeight(5),
    textAlign: 'center',
  },
  promoDescription: {
    color: '#AAAAAA',
    fontSize: pixelToHeight(16),
    textAlign: 'center',
  },
  inviteButton: {
    backgroundColor: '#723CEB',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    width: '90%',
    marginBottom: pixelToHeight(20),
    alignItems: 'center',
    alignSelf: 'center',
  },
  inviteButtonText: {
    color: 'white',
    fontSize: pixelToHeight(18),
    fontWeight: 'bold',
  },
  memberList: {
    width: '90%',
    alignSelf: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: pixelToHeight(20),
    fontWeight: 'bold',
    marginBottom: pixelToHeight(15),
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    padding: pixelToHeight(15),
    marginBottom: pixelToHeight(10),
  },
  memberName: {
    color: 'white',
    fontSize: pixelToHeight(16),
  },
  removeButtonText: {
    color: '#FF0000',
    fontSize: pixelToHeight(14),
    fontWeight: 'bold',
  },
});

export default FamilySubscribeScreen;
