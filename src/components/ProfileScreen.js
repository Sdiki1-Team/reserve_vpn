import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, Modal, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

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
      <ScrollView contentContainerStyle={[commonStyles.container, {padding: 20}]}>
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
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 16,
    color: '#888',
  },
  promoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
  },
  promoInputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
    display: 'flex',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    height: 40,
    color: 'white',
    placeholderTextColor: 'white',
  },
  applyButton: {
    backgroundColor: '#723CEB',
    margin: 5,
    maxHeight: 25,
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10
  },
  applyText: {
    color: 'white',
    fontsize: 13,
  },
  daysContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#191919',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: 24,
    fontWeight: '300',
    color: 'white',
  },
  daysText: {
    fontSize: 12,
    marginTop: -5,
    color: 'grey',
  },
  referralBox: {
    borderWidth: 1,
    borderColor: '#723CEB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
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
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  featuresLink: {
    color: '#888',
    fontSize: 14,
  },
  tariffSelector: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#191919',
    borderRadius: 10,
    height: 35,
    marginBottom: 20,
    overflow: 'hidden',
  },
  tariffTab: {
    width: (Dimensions.get('window').width - 40) / 3 - 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTariffTab: {
    backgroundColor: '#723CEB',
    marginVertical: 4,
    borderRadius: 8,
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    paddingVertical: 3,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureBullet: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#723CEB',
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'white',
  },
  questionMark: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#191919',
    borderColor: '#723CEB',
    borderWidth: 1,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    color: '#723CEB',
    fontWeight: 'bold',
    fontSize: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '300',
    marginRight: 10,
    color: 'white',
  },
  oldPrice: {
    fontSize: 18,
    color: '#888',
    textDecorationLine: 'line-through',
    textDecorationColor: '#723CEB',
  },
  subscribeButton: {
    backgroundColor: '#723CEB',
    borderRadius: 10,
    paddingVertical: 5,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 18,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#191919',
    justifyContent: 'space-between',
    borderRadius: 10,
    height: 35,
    overflow: 'hidden',
  },
  periodTab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (Dimensions.get('window').width - 40) / 3 - 10,

  },
  activePeriodTab: {
    backgroundColor: '#723CEB',
    marginVertical: 3,
    borderRadius: 8,
  },
  periodText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 400 
  },
  activePeriodText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 14,
  },
  periodDivider: {
    width: 1,
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
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  tariffFeatures: {
    marginBottom: 15,
    color: 'white',
  },
  tariffName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalFeature: {
    marginLeft: 10,
    marginBottom: 3,
  },
  featureDescription: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#191919',
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#',
  },
  closeIcon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: '400',
  },
});

export default ProfileScreen;
