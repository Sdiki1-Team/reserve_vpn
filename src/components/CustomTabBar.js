import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SvgIcon from './SvgIcon';
import { pixelToHeight } from '../styles/commonStyles';


const CustomTabBar = ({ state, descriptors, navigation, onTabPress }) => {
  const insets = useSafeAreaInsets();
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
        return isFocused ? 'home-filled' : 'home';
      case 'ProfileTab':
        return isFocused ? 'profile-filled' : 'profile';
      case 'SettingsTab':
        return isFocused ? 'settings-filled' : 'settings';
      default:
        return 'home';
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
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
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
                  // Отрицательные отступы для увеличения размера
                  ...(isFocused && {
                    marginHorizontal: pixelToHeight(-10), // 10px с каждой стороны = +20px общая ширина
                    zIndex: 10,
                  }),
                }
              ]}
            >
              <SvgIcon 
                name={getIcon(route.name, isFocused)}
                size={pixelToHeight(24)}
                color={isFocused ? '#FFFFFF' : '#FFFFFF'}
                style={[styles.icon, { marginRight: isFocused ? pixelToHeight(8) : 0 }]} // Отступ только для активной вкладки
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
    flexDirection: 'row',
    backgroundColor: '#191919', // Тёмно-серый цвет
    borderRadius: pixelToHeight(100),
    marginHorizontal: pixelToHeight(15), // Отступы от краев экрана на 15px
    marginBottom: pixelToHeight(15), // Отступ снизу
    paddingHorizontal: pixelToHeight(15), // Отступы по 15px с каждой стороны 
    elevation: 8,
  },
  tabButton: {
    flex: 1, // Каждая кнопка занимает равную часть
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pixelToHeight(8),
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // По умолчанию центрируем
    paddingHorizontal: pixelToHeight(8),
    paddingVertical: pixelToHeight(11),
    borderRadius: pixelToHeight(20),
    minWidth: pixelToHeight(40),
    maxWidth: '100%', // Ограничиваем максимальную ширину
  },
  activeTabContent: {
    backgroundColor: '#723CEB', // Фиолетовый цвет для активной вкладки
    justifyContent: 'flex-start', // Для активной вкладки выравниваем по левому краю
    elevation: 4,
  },
  icon: {
    margin: 'auto !important',
  },
  activeTabText: {
    color: 'white',
    fontSize: pixelToHeight(16),
    fontWeight: '900',
    textAlign: 'center'
  },
});

export default CustomTabBar; 