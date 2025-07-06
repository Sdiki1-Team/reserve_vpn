import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, Modal, StyleSheet, ScrollView, Dimensions, Image, Platform, Animated } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { pixelToHeight } from '../styles/commonStyles';
import BackButton from './BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const BackgroundStripes = require('../images/backgroud_stripes.png');
const BackgroundStripesActive = require('../images/background_stripes_active.png');

const { width } = Dimensions.get('window');

function ProfileScreen({ navigation }) {
  const [activeTariff, setActiveTariff] = useState('Базовый');
  const [activePeriod, setActivePeriod] = useState('1 Месяц');
  const [promoCode, setPromoCode] = useState('');
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showFeatureDetail, setShowFeatureDetail] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isFeaturesModalContentVisible, setIsFeaturesModalContentVisible] = useState(false);
  const [isFeatureDetailModalContentVisible, setIsFeatureDetailModalContentVisible] = useState(false);

  const featuresModalBackgroundOpacity = useState(new Animated.Value(0))[0];
  const featuresModalContentScale = useState(new Animated.Value(0.8))[0];
  const featuresModalContentOpacity = useState(new Animated.Value(0))[0];

  const featureDetailModalBackgroundOpacity = useState(new Animated.Value(0))[0];
  const featureDetailModalContentScale = useState(new Animated.Value(0.8))[0];
  const featureDetailModalContentOpacity = useState(new Animated.Value(0))[0];

  useFocusEffect(
    React.useCallback(() => {
      const loadConnectedStatus = async () => {
        try {
          const storedConnected = await AsyncStorage.getItem('connected');
          if (storedConnected !== null) {
            setConnected(JSON.parse(storedConnected));
          }
        } catch (e) {
          console.error("Ошибка при загрузке connected из AsyncStorage в ProfileScreen:", e);
        }
      };
      loadConnectedStatus();
    }, [])
  );

  React.useEffect(() => {
    if (showFeaturesModal) {
      setIsFeaturesModalContentVisible(true);
      Animated.parallel([
        Animated.timing(featuresModalBackgroundOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(featuresModalContentScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(featuresModalContentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(featuresModalBackgroundOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(featuresModalContentScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(featuresModalContentOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsFeaturesModalContentVisible(false);
      });
    }
  }, [showFeaturesModal, featuresModalBackgroundOpacity, featuresModalContentScale, featuresModalContentOpacity]);

  React.useEffect(() => {
    if (showFeatureDetail) {
      setIsFeatureDetailModalContentVisible(true);
      Animated.parallel([
        Animated.timing(featureDetailModalBackgroundOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(featureDetailModalContentScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(featureDetailModalContentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(featureDetailModalBackgroundOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(featureDetailModalContentScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(featureDetailModalContentOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsFeatureDetailModalContentVisible(false);
      });
    }
  }, [showFeatureDetail, featureDetailModalBackgroundOpacity, featureDetailModalContentScale, featureDetailModalContentOpacity]);

  const tariffs = {
    'Базовый': {
      description: 'Быстро стабильно, но из рекламы только маленький банер',
      features: [
        'Умная фильтрация приложений',
        'Автопереключение при неполадках',
        'Виджет активности на экране блокировки',
        '2P2 Share',
        'Реклама'
      ],
      price: 'Бесплатно',
      oldPrice: '199₽'
    },
    'Про': {
      description: 'Есть реклама, но это лучше чем вообще без VPN.',
      features: [
        'Умная фильтрация приложений',
        'Автоподключение в нужных приложениях',
        'Подмена GPS координат',
        'Режим маскировки VPN',
        'Семейная подписка'
      ],
      price: '279₽',
      oldPrice: '384₽'
    },
    'Ультра': {
      description: 'Без рекламы. Анонимность на максималках. Воркай: мы не смотрим.',
      features: [
        'Фильтрация VPN-зависимых сервисов',
        'Анонимные VPN сессии',
        'Цифровая маскировка',
        'Персональный IP адрес',
        'Функция Kill Switch'
      ],
      price: '439₽',
      oldPrice: '693₽'
    }
  };

  const allFeaturesData = [
    { name: 'Умная фильтрация приложений', basic: true, pro: true, ultra: false, description: 'Автоматически определяет приложения, которым требуется VPN-соединение, и активирует защиту только для них.' },
    { name: 'Семейная подписка', basic: true, pro: true, ultra: false, description: 'Возможность подключить до 5 устройств с разными аккаунтами под одной подпиской.' },
    { name: 'Фильтрация VPN сервисов', basic: true, pro: true, ultra: true, description: 'Интеллектуальная система определения сервисов, блокирующих VPN, с автоматическим обходом ограничений.' },
    { name: 'Безлимитная скорость и интернет', basic: false, pro: false, ultra: true, description: 'Предоставляет неограниченную скорость соединения и интернет-трафик.' },
    { name: 'Безлимитный трафик', basic: false, pro: true, ultra: true, description: 'Позволяет использовать VPN без ограничений по объему передаваемых данных.' },
    { name: 'Контроль действия подписки', basic: false, pro: true, ultra: true, description: 'Позволяет отслеживать срок действия вашей подписки и управлять ею.' },
    { name: 'Автопереключение при сбое VPN', basic: true, pro: true, ultra: true, description: 'При обрыве соединения автоматически переключается на резервный сервер без потери соединения.' },
    { name: 'Анонимные VPN сессии', basic: false, pro: false, ultra: true, description: 'Сессии без логирования данных и без привязки к вашей учетной записи.' },
    { name: 'Цифровая маскировка', basic: false, pro: false, ultra: true, description: 'Дополнительный уровень шифрования и перемешивания трафика для максимальной анонимности.' },
    { name: 'Умные профили серверов', basic: false, pro: true, ultra: true, description: 'Автоматически выбирает оптимальный сервер в зависимости от вашего местоположения и потребностей.' },
    { name: 'Виджет активности', basic: true, pro: true, ultra: true, description: 'Отображает статус VPN-соединения и текущий режим работы прямо на заблокированном экране.' },
    { name: 'Поддержка Action Button', basic: false, pro: true, ultra: true, description: 'Интеграция с кнопкой действия для быстрого управления VPN-соединением.' },
    { name: 'Автоподключение в приложениях', basic: false, pro: true, ultra: true, description: 'VPN автоматически активируется при запуске определенных приложений из вашего списка.' },
    { name: 'Функция Kill Switch', basic: false, pro: true, ultra: true, description: 'Автоматически блокирует интернет-соединение при обрыве VPN для защиты ваших данных.' },
    { name: 'Персональный Ip адресс', basic: false, pro: false, ultra: true, description: 'Выделенный персональный IP-адрес без общего доступа с другими пользователями.' },
    { name: 'Режим маскировки VPN', basic: false, pro: true, ultra: true, description: 'Скрывает факт использования VPN, делая трафик неотличимым от обычного интернет-соединения.' },
    { name: 'Подмена GPS координат', basic: false, pro: true, ultra: true, description: 'Изменяет ваше реальное местоположение для выбранных приложений и сервисов.' },
    { name: 'Настраиваемые подключения', basic: false, pro: true, ultra: true, description: 'Позволяет настроить параметры подключения VPN под ваши нужды.' },
    { name: '2P2 Share', basic: true, pro: true, ultra: true, description: 'Позволяет делиться VPN-сессией с другим устройством без дополнительной авторизации.' },
    { name: 'Реклама', basic: true, pro: false, ultra: false, description: 'Небольшие рекламные баннеры в интерфейсе приложения для поддержки бесплатной версии.' },
  ];

  const handleConnectDisconnect = async () => {
    const newConnectedState = !connected;
    setConnected(newConnectedState);
    try {
      await AsyncStorage.setItem('connected', JSON.stringify(newConnectedState));
    } catch (e) {
      console.error("Ошибка при сохранении connected в AsyncStorage:", e);
    }
  };

  const renderFeatureItem = (feature) => (
    <TouchableOpacity 
      style={styles.featureItem}
      onPress={() => setShowFeatureDetail(feature.name)}
    >
      <View style={styles.featureLeft}>
        <View style={styles.featureBullet} />
        <Text style={styles.featureText}>{feature.name}</Text>
      </View>
      <TouchableOpacity onPress={() => setShowFeatureDetail(feature.name)}>
        <View style={styles.questionMark}>
          <Text style={styles.questionText}>?</Text>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={connected ? BackgroundStripesActive : BackgroundStripes}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={[commonStyles.container, { paddingTop: pixelToHeight(Platform.OS === 'ios' ? 75 : 50) }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.header}>
          <Text style={styles.userName}>Иван Иванов</Text>
          <Text style={styles.userEmail}>mail@example.com</Text>
        </View>

        <View style={styles.promoContainer}>
          <View style={styles.promoInputContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Введите промокод"
              value={promoCode}
              onChangeText={setPromoCode}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyText}>Применить</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.daysContainer}>
            <Text style={styles.daysNumber}>14</Text>
            <Text style={styles.daysText}>дней</Text>
          </View>
        </View>

        <View style={styles.referralBox}>
          <Text style={styles.referralText}>Реферальная система</Text>
        </View>

        <View style={styles.subscriptionHeader}>
          <Text style={styles.sectionTitle}>Подписки</Text>
          <TouchableOpacity onPress={() => setShowFeaturesModal(true)}>
            <Text style={styles.featuresLink}>функции всех тарифов</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tariffSelector}>
          {['Базовый', 'Про', 'Ультра'].map((tariff, index) => (
            <React.Fragment key={tariff}>
              <TouchableOpacity
                style={[
                  styles.tariffTab,
                  activeTariff === tariff && styles.activeTariffTab
                ]}
                onPress={() => setActiveTariff(tariff)}
              >
                <Text style={activeTariff === tariff ? styles.activeTariffText : styles.tariffText}>
                  {tariff}
                </Text>
              </TouchableOpacity>
              {index < 2 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.tariffDescription}>
          {tariffs[activeTariff].description}
        </Text>

        <View style={styles.featuresContainer}>
          {tariffs[activeTariff].features.map((featureName, index) => {
            const featureData = allFeaturesData.find(f => f.name === featureName) || { name: featureName };
            return (
              <View key={`${featureName}_${index}`}>
                {renderFeatureItem(featureData)}
              </View>
            );
          })}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{tariffs[activeTariff].price}</Text>
          <Text style={styles.oldPrice}>{tariffs[activeTariff].oldPrice}</Text>
        </View>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>Подключить</Text>
        </TouchableOpacity>

        <View style={styles.periodSelector}>
          {['1 Месяц', '3 Месяца', '6 Месяцев'].map((period, index) => (
            <React.Fragment key={period}>
              <TouchableOpacity
                style={[
                  styles.periodTab,
                  activePeriod === period && styles.activePeriodTab
                ]}
                onPress={() => setActivePeriod(period)}
              >
                <Text style={activePeriod === period ? styles.activePeriodText : styles.periodText}>
                  {period}
                </Text>
              </TouchableOpacity>
              {index < 2 && <View style={styles.periodDivider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity
          style={styles.connectButton}
          onPress={handleConnectDisconnect}
        >
          <Text style={styles.connectButtonText}>{connected ? 'Отключить' : 'Подключить'}</Text>
        </TouchableOpacity>

        <Modal
          visible={isFeaturesModalContentVisible}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowFeaturesModal(false)}
        >
          {isFeaturesModalContentVisible && (
            <Animated.View style={[
              styles.modalBackground,
              { opacity: featuresModalBackgroundOpacity }
            ]}>
              <Animated.View style={[
                styles.modalContent,
                styles.featuresTableModalContent,
                { transform: [{ scale: featuresModalContentScale }], opacity: featuresModalContentOpacity },
                { borderColor: '#723CEB', borderWidth: pixelToHeight(2) }
              ]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Функции всех тарифов</Text>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setShowFeaturesModal(false)}
                  >
                    <Image 
                      source={require('../images/icons/close.png')} 
                      style={styles.closeIcon} 
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={{height: pixelToHeight(5)}} />
                
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <View style={[styles.tableHeaderCell, {flex: 4.5}]}>
                      <Text style={styles.tableHeaderText}> </Text>
                    </View>
                    <View style={[styles.tableHeaderCell, {flex: 1.5}]}
                    >
                      <Text style={[styles.tableHeaderText, {fontSize: pixelToHeight(10), textAlign: 'left'}]}>Базовый</Text>
                    </View>
                    <View style={[styles.tableHeaderverticalDivider, {backgroundColor: '#723CEB'}]} />
                    <View style={[styles.tableHeaderCell, {flex: 1}]}
                    >
                      <Text style={[styles.tableHeaderText, {fontSize: pixelToHeight(10), textAlign: 'center'}]}>Про</Text>
                    </View>
                    <View style={[styles.tableHeaderverticalDivider, {backgroundColor: '#723CEB'}]} />
                    <View style={[styles.tableHeaderCell, {flex: 1.5}]}
                    >
                      <Text style={[styles.tableHeaderText, {fontSize: pixelToHeight(10), textAlign: 'right'}]}>Ультра</Text>
                    </View>
                    <View style={[styles.tableHeaderCell, {flex: 0}]}> 
                      <Text style={styles.tableHeaderText}> </Text>
                    </View>
                  </View>
                  
                  <ScrollView>
                    {allFeaturesData.map((feature, index) => (
                      <View key={index} style={styles.tableRow}>
                        <View style={[styles.tableCell, {flex: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                          <Text style={styles.featureName}>{feature.name}</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.tableCell}>
                          {feature.basic ? (
                            <Text style={styles.checkMark}>✓</Text>
                          ) : (
                            <Text style={styles.crossMark}>✕</Text>
                          )}
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.tableCell}>
                          {feature.pro ? (
                            <Text style={styles.checkMark}>✓</Text>
                          ) : (
                            <Text style={styles.crossMark}>✕</Text>
                          )}
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.tableCell}>
                          {feature.ultra ? (
                            <Text style={styles.checkMark}>✓</Text>
                          ) : (
                            <Text style={styles.crossMark}>✕</Text>
                          )}
                        </View>
                        <View style={[styles.verticalDivider, {backgroundColor: '#333'}]} />
                        <View style={[styles.tableCell, {flex: 0.8}]}>
                          <TouchableOpacity onPress={() => setShowFeatureDetail(feature.name)} style={styles.infoIconContainer}>
                            <Text style={styles.infoIconText}>i</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </Animated.View>
            </Animated.View>
          )}
        </Modal>

        <Modal
          visible={isFeatureDetailModalContentVisible}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowFeatureDetail(null)}
        >
          {isFeatureDetailModalContentVisible && (
            <Animated.View style={[
              styles.modalBackground,
              { opacity: featureDetailModalBackgroundOpacity }
            ]}>
              <Animated.View style={[
                styles.modalContent,
                styles.featureDetailModalContent,
                { transform: [{ scale: featureDetailModalContentScale }], opacity: featureDetailModalContentOpacity },
                { borderColor: '#723CEB', borderWidth: pixelToHeight(2) }
              ]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{showFeatureDetail}</Text>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setShowFeatureDetail(null)}
                  >
                    <Image 
                      source={require('../images/icons/close.png')} 
                      style={styles.closeIcon} 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.featureDescription}>
                  {allFeaturesData.find(f => f.name === showFeatureDetail)?.description}
                </Text>
                
              </Animated.View>
            </Animated.View>
          )}
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  tableHeaderverticalDivider: {
    width: pixelToHeight(1),
    height: '30%',
    alignSelf: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: pixelToHeight(20),
  },
  userName: {
    fontSize: pixelToHeight(24),
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: pixelToHeight(16),
    color: '#888',
  },
  promoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pixelToHeight(20),
    display: 'flex',
    alignItems: 'center',
  },
  promoInputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: pixelToHeight(1),
    borderColor: '#333',
    borderRadius: pixelToHeight(8),
    overflow: 'hidden',
    marginRight: pixelToHeight(10),
    display: 'flex',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    padding: pixelToHeight(10),
    fontSize: pixelToHeight(14),
    height: pixelToHeight(40),
    color: 'white',
    placeholderTextColor: 'white',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#723CEB',
    margin: pixelToHeight(5),
    maxHeight: pixelToHeight(25),
    justifyContent: 'center',
    borderRadius: pixelToHeight(5),
    padding: pixelToHeight(5),
    paddingHorizontal: pixelToHeight(10)
  },
  applyText: {
    color: 'white',
    fontSize: pixelToHeight(13),
  },
  daysContainer: {
    width: pixelToHeight(60),
    height: pixelToHeight(60),
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: pixelToHeight(24),
    fontWeight: '300',
    color: 'white',
  },
  daysText: {
    fontSize: pixelToHeight(12),
    marginTop: pixelToHeight(-5),
    color: 'grey',
  },
  referralBox: {
    borderWidth: pixelToHeight(1),
    borderColor: '#723CEB',
    borderRadius: pixelToHeight(8),
    padding: pixelToHeight(15),
    marginBottom: pixelToHeight(20),
  },
  referralText: {
    color: 'white',
    fontWeight: '500',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    marginBottom: pixelToHeight(15),
  },
  sectionTitle: {
    fontSize: pixelToHeight(20),
    fontWeight: 'bold',
    color: 'white',
  },
  featuresLink: {
    color: '#888',
    fontSize: pixelToHeight(14),
  },
  tariffSelector: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    height: pixelToHeight(35),
    marginBottom: pixelToHeight(35),
    overflow: 'hidden',
    marginTop: pixelToHeight(20),
  },
  
  divider: {
    width: 1,
    backgroundColor: '#999',
    height: '70%',
    alignSelf: 'center',
  },
  tariffDescription: {
    color: '#888',
    textAlign: 'center',
    marginBottom: pixelToHeight(20),
    paddingHorizontal: pixelToHeight(20),
  },
  featuresContainer: {
    marginBottom: pixelToHeight(10),
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    paddingVertical: pixelToHeight(3),
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureBullet: {
    width: pixelToHeight(7),
    height: pixelToHeight(7),
    borderRadius: pixelToHeight(5),
    backgroundColor: '#723CEB',
    marginRight: pixelToHeight(10),
  },
  featureText: {
    fontSize: pixelToHeight(14),
    color: 'white',
  },
  questionMark: {
    width: pixelToHeight(15),
    height: pixelToHeight(15),
    borderRadius: pixelToHeight(10),
    backgroundColor: '#191919',
    borderColor: '#723CEB',
    borderWidth: pixelToHeight(1),
    marginLeft: pixelToHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    color: '#723CEB',
    fontWeight: 'bold',
    fontSize: pixelToHeight(10),
  },
  infoIconContainer: {
    width: pixelToHeight(15),
    height: pixelToHeight(15),
    borderRadius: pixelToHeight(10),
    backgroundColor: '#191919',
    borderColor: '#723CEB',
    borderWidth: pixelToHeight(1),
    marginLeft: pixelToHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    color: '#723CEB',
    fontWeight: 'bold',
    fontSize: pixelToHeight(10),
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'baseline',
    marginBottom: pixelToHeight(20),
  },
  currentPrice: {
    fontSize: pixelToHeight(28),
    fontWeight: '300',
    marginRight: pixelToHeight(10),
    color: 'white',
  },
  oldPrice: {
    fontSize: pixelToHeight(18),
    color: '#888',
    textDecorationLine: 'line-through',
    textDecorationColor: '#723CEB',
  },
  subscribeButton: {
    backgroundColor: '#723CEB',
    borderRadius: pixelToHeight(10),
    paddingVertical: pixelToHeight(5),
    marginHorizontal: pixelToHeight(20),
    alignItems: 'center',
    marginBottom: pixelToHeight(20),
  },
  subscribeText: {
    color: 'white',
    fontWeight: '400',
    fontSize: pixelToHeight(18),
  },
  periodSelector: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(10),
    height: pixelToHeight(35),
    marginBottom: pixelToHeight(35),
    overflow: 'hidden',
    marginTop: pixelToHeight(20),
  },
  tariffTab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (Dimensions.get('window').width - 40) / 3 - 10,

  },
  activeTariffTab: {
    backgroundColor: '#723CEB',
    marginVertical: pixelToHeight(4),
    borderRadius: pixelToHeight(8),
  },
  tariffText: {
    color: 'white',
    fontWeight: 400,
  },
  activeTariffText: {
    color: 'white',
    fontWeight: '400',
    fontSize: pixelToHeight(14),
  },
  periodDivider: {
    width: pixelToHeight(1),
    backgroundColor: '#999',
    height: '60%',
    alignSelf: 'center',
  },
  connectButton: {
    backgroundColor: '#723CEB',
    borderRadius: pixelToHeight(10),
    paddingVertical: pixelToHeight(10),
    marginHorizontal: pixelToHeight(20),
    alignItems: 'center',
    marginTop: pixelToHeight(20),
    marginBottom: pixelToHeight(20),
  },
  connectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: pixelToHeight(20),
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#191919',
    color: 'white',
    borderRadius: pixelToHeight(15),
    padding: pixelToHeight(20),
  },
  featuresTableModalContent: {
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: pixelToHeight(10),
    borderBottomWidth: pixelToHeight(1),
    borderBottomColor: '#333',
    marginBottom: pixelToHeight(5),
  },
  closeModalButton: {
    width: pixelToHeight(25),
    height: pixelToHeight(25),
    borderRadius: pixelToHeight(8),
    borderWidth: pixelToHeight(1),
    borderColor: '#723CEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: pixelToHeight(15),
    height: pixelToHeight(15),
    alignSelf: 'center',
  },
  tableContainer: {
    width: '100%',
    borderRadius: pixelToHeight(5),
    maxHeight: '90%',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#191919',
    height: pixelToHeight(40),
  },
  tableHeaderCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelToHeight(5),
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: pixelToHeight(10)
  },
  verticalDivider: {
    width: pixelToHeight(1),
    backgroundColor: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: pixelToHeight(30),
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pixelToHeight(4),
  },
  modalTitle: {
    color: 'white',
    fontSize: pixelToHeight(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureName: {
    color: 'white',
    fontSize: pixelToHeight(12),
    textAlign: 'left',
  },
  checkMark: {
    color: '#723CEB',
    fontWeight: 'bold',
    fontSize: pixelToHeight(16),
  },
  crossMark: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: pixelToHeight(14),
  },
  featureDetailModalContent: {
    justifyContent: 'space-between',
    minHeight: pixelToHeight(200),
  },
  featureDescription: {
    color: 'white',
    fontSize: pixelToHeight(15),
    lineHeight: pixelToHeight(22),
    marginBottom: pixelToHeight(20),
    flex: 1,
  },
  bottomCloseButton: {
    backgroundColor: '#723CEB',
    borderRadius: pixelToHeight(10),
    paddingVertical: pixelToHeight(10),
    alignItems: 'center',
    marginTop: pixelToHeight(20),
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: pixelToHeight(16),
  },
});

export default ProfileScreen;
