import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, Modal, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { pixelToHeight } from '../styles/commonStyles';


function ProfileScreen({ navigation }) {
  const [activeTariff, setActiveTariff] = useState('Базовый');
  const [activePeriod, setActivePeriod] = useState('1 Месяц');
  const [promoCode, setPromoCode] = useState('');
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showFeatureDetail, setShowFeatureDetail] = useState(null);
  

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

  const featureDescriptions = {
    'Умная фильтрация приложений': 'Автоматически определяет приложения, которым требуется VPN-соединение, и активирует защиту только для них.',
    'Автопереключение при неполадках': 'При обрыве соединения автоматически переключается на резервный сервер без потери соединения.',
    'Виджет активности на экране блокировки': 'Отображает статус VPN-соединения и текущий режим работы прямо на заблокированном экране.',
    '2P2 Share': 'Позволяет делиться VPN-сессией с другим устройством без дополнительной авторизации.',
    'Реклама': 'Небольшие рекламные баннеры в интерфейсе приложения для поддержки бесплатной версии.',
    'Автоподключение в нужных приложениях': 'VPN автоматически активируется при запуске определенных приложений из вашего списка.',
    'Подмена GPS координат': 'Изменяет ваше реальное местоположение для выбранных приложений и сервисов.',
    'Режим маскировки VPN': 'Скрывает факт использования VPN, делая трафик неотличимым от обычного интернет-соединения.',
    'Семейная подписка': 'Возможность подключить до 5 устройств с разными аккаунтами под одной подпиской.',
    'Фильтрация VPN-зависимых сервисов': 'Интеллектуальная система определения сервисов, блокирующих VPN, с автоматическим обходом ограничений.',
    'Анонимные VPN сессии': 'Сессии без логирования данных и без привязки к вашей учетной записи.',
    'Цифровая маскировка': 'Дополнительный уровень шифрования и перемешивания трафика для максимальной анонимности.',
    'Персональный IP адрес': 'Выделенный персональный IP-адрес без общего доступа с другими пользователями.',
    'Функция Kill Switch': 'Автоматически блокирует интернет-соединение при обрыве VPN для защиты ваших данных.'
  };

  const renderFeatureItem = (feature) => (
    <TouchableOpacity 
      style={styles.featureItem}
      onPress={() => setShowFeatureDetail(feature)}
    >
      <View style={styles.featureLeft}>
        <View style={styles.featureBullet} />
        <Text style={styles.featureText}>{feature}</Text>
      </View>
      <TouchableOpacity onPress={() => setShowFeatureDetail(feature)}>
        <View style={styles.questionMark}>
          <Text style={styles.questionText}>?</Text>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={[commonStyles.container, {padding: pixelToHeight(20)}]}>
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
          {tariffs[activeTariff].features.map((feature) => (
            <View key={feature}>
              {renderFeatureItem(feature)}
            </View>
          ))}
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

        {/* Модальное окно всех функций */}
        <Modal
          visible={showFeaturesModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFeaturesModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFeaturesModal(false)}
              >
                <Image 
                  source={require('../images/icons/close.png')} 
                  style={styles.closeIcon} 
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Функции всех тарифов</Text>
              {Object.entries(tariffs).map(([tariffName, tariffData]) => (
                <View key={tariffName} style={styles.tariffFeatures}>
                  <Text style={styles.tariffName}>{tariffName}:</Text>
                  {tariffData.features.map((feature) => (
                    <Text key={feature} style={styles.modalFeature}>• {feature}</Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </Modal>

        {/* Модальное окно деталей функции */}
        <Modal
          visible={!!showFeatureDetail}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFeatureDetail(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{showFeatureDetail}</Text>
              <Text style={styles.featureDescription}>
                {featureDescriptions[showFeatureDetail]}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFeatureDetail(null)}
              >
                <Text style={styles.closeText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    fontsize: pixelToHeight(13),
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
  },
  tariffTab: {
    width: pixelToHeight((Dimensions.get('window').width - 40) / 3 - 10),
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    backgroundColor: '#191919',
    justifyContent: 'space-between',
    borderRadius: pixelToHeight(10),
    height: pixelToHeight(35),
    overflow: 'hidden',
  },
  periodTab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: pixelToHeight((Dimensions.get('window').width - 40) / 3 - 10),

  },
  activePeriodTab: {
    backgroundColor: '#723CEB',
    marginVertical: pixelToHeight(3),
    borderRadius: pixelToHeight(8),
  },
  periodText: {
    color: 'white',
    fontSize: pixelToHeight(14),
    fontWeight: 400 
  },
  activePeriodText: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#191919',
    color: 'white',
    borderRadius: pixelToHeight(15),
    padding: pixelToHeight(20),
  },
  modalTitle: {
    fontSize: pixelToHeight(20),
    color: 'white',
    fontWeight: '700',
    marginBottom: pixelToHeight(30),
    textAlign: 'center',
  },
  tariffFeatures: {
    marginBottom: pixelToHeight(15),
    color: 'white',
  },
  tariffName: {
    fontWeight: 'bold',
    marginBottom: pixelToHeight(5),
  },
  modalFeature: {
    marginLeft: pixelToHeight(10),
    marginBottom: pixelToHeight(3),
  },
  featureDescription: {
    color: 'white',
    fontSize: pixelToHeight(15),
    lineHeight: pixelToHeight(22),
    marginBottom: pixelToHeight(20),
  },
  closeButton: {
    position: 'absolute',
    top: pixelToHeight(10),
    right: pixelToHeight(10),
    backgroundColor: '#191919',
    borderRadius: pixelToHeight(5),
    padding: pixelToHeight(5),
    borderWidth: pixelToHeight(1),
    borderColor: '#',
  },
  closeIcon: {
    width: pixelToHeight(20),
    height: pixelToHeight(20),
    alignSelf: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: '400',
  },
});

export default ProfileScreen;
