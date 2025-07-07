import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { pixelToHeight } from '../styles/commonStyles';

// Импорт изображений
const HomeIcon = require('../images/icons/home.png');
const HomeActiveIcon = require('../images/icons/home_active.png');
const ProfileIcon = require('../images/icons/profile.png');
const ProfileActiveIcon = require('../images/icons/profile_active.png');
const SettingsIcon = require('../images/icons/setting.png');
const SettingsActiveIcon = require('../images/icons/setting_active.png');

const CustomTabBar = ({ state, descriptors, navigation, onTabPress }) => {
  const animatedValues = useRef({}).current;

  // Инициализация анимированных значений для каждой вкладки
  state.routes.forEach((route, index) => {
    if (!animatedValues[route.key]) {
      animatedValues[route.key] = {
        scale: new Animated.Value(state.index === index ? 1 : 0.9),
        opacity: new Animated.Value(state.index === index ? 1 : 0.7),
      };
    }
  });

  const getIcon = (routeName, isFocused) => {
    switch (routeName) {
      case 'HomeTab':
        return isFocused ? HomeActiveIcon : HomeIcon;
      case 'ProfileTab':
        return isFocused ? ProfileActiveIcon : ProfileIcon;
      case 'SettingsTab':
        return isFocused ? SettingsActiveIcon : SettingsIcon;
      default:
        return HomeIcon;
    }
  };

  const getTabTitle = (routeName) => {
    switch (routeName) {
      case 'HomeTab':
        return 'Home';
      case 'ProfileTab':
        return 'Profile';
      case 'SettingsTab':
        return 'Setting';
      default:
        return 'Экран';
    }
  };

  const animateTab = useCallback((routeKey, isFocused) => {
    const animations = [];
    
    if (isFocused) {
      // Анимация активации
      animations.push(
        Animated.parallel([
          Animated.timing(animatedValues[routeKey].scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[routeKey].opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      );
    } else {
      // Анимация деактивации
      animations.push(
        Animated.parallel([
          Animated.timing(animatedValues[routeKey].scale, {
            toValue: 0.9,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[routeKey].opacity, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      );
    }
    
    Animated.parallel(animations).start();
  }, [animatedValues]);

  // Анимация при изменении активной вкладки
  useEffect(() => {
    state.routes.forEach((route, index) => {
      const isFocused = state.index === index;
      animateTab(route.key, isFocused);
    });
  }, [state.index, state.routes, animateTab]);

  return (
    <View style={[styles.container]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Вызываем onTabPress если он передан
            if (onTabPress) {
              onTabPress(index);
            }
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            <Animated.View 
              style={[
                styles.tabContent, 
                isFocused && styles.activeTabContent,
                {
                  transform: [{ scale: animatedValues[route.key]?.scale || 1 }],
                  opacity: animatedValues[route.key]?.opacity || 1,
                  justifyContent: isFocused ? 'flex-start' : 'center',
                  width: isFocused ? 'auto' : '100%',
                  zIndex: 10,
                }
              ]}
            >
              <Image 
                source={getIcon(route.name, isFocused)}
                style={[styles.icon, { marginRight: isFocused ? pixelToHeight(8) : 0, width: pixelToHeight(24), height: pixelToHeight(24), tintColor: isFocused ? '#2C2C2C' : '#FFFFFF' }]} // Отступ только для активной вкладки
              />
              {isFocused && (
                <Text style={[styles.activeTabText, { color: isFocused ? '#2C2C2C' : '#FFFFFF' }]}>
                  {getTabTitle(route.name)}
                </Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#191919', // Тёмно-серый цвет
    borderRadius: pixelToHeight(100),
    marginHorizontal: pixelToHeight(15), // Отступы от краев экрана на 15px
    marginBottom: pixelToHeight(15), // Отступ снизу
    paddingHorizontal: pixelToHeight(15), // Отступы по 15px с каждой стороны
    maxHeight: pixelToHeight(70),
    minHeight: pixelToHeight(70),
    elevation: 8,
  },
  tabButton: {
    flex: 1, // Каждая кнопка занимает равную часть
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pixelToHeight(13),
    maxHeight: pixelToHeight(70),
    minHeight: pixelToHeight(70),
  },
  tabContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // По умолчанию центрируем
    paddingHorizontal: pixelToHeight(8),
    paddingVertical: pixelToHeight(11),
    marginVertical: 'auto',
    borderRadius: pixelToHeight(50),
    minWidth: pixelToHeight(40),
  },
  activeTabContent: {
    backgroundColor: '#723CEB', // Фиолетовый цвет для активной вкладки
    justifyContent: 'flex-start', // Для активной вкладки выравниваем по левому краю
    elevation: 4,
  },
  icon: {
    resizeMode: 'contain',
  },
  activeTabText: {
    color: 'white',
    fontSize: pixelToHeight(16),
    fontWeight: '900',
    textAlign: 'center'
  },
});

export default CustomTabBar; 
