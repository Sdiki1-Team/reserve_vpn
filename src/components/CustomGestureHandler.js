import React from 'react';
import { View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CustomGestureHandler = ({ children, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + contextX.value;
      translateY.value = event.translationY + contextY.value;
    })
    .onEnd((event) => {
      const threshold = 100; // Порог для срабатывания свайпа
      const velocityThreshold = 500; // Порог скорости

      // Определяем направление свайпа
      const isHorizontalSwipe = Math.abs(event.translationX) > Math.abs(event.translationY);
      const isVerticalSwipe = Math.abs(event.translationY) > Math.abs(event.translationX);

      if (isHorizontalSwipe) {
        if (event.translationX > threshold || event.velocityX > velocityThreshold) {
          // Свайп вправо
          if (onSwipeRight) {
            runOnJS(onSwipeRight)();
          }
        } else if (event.translationX < -threshold || event.velocityX < -velocityThreshold) {
          // Свайп влево
          if (onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          }
        }
      } else if (isVerticalSwipe) {
        if (event.translationY > threshold || event.velocityY > velocityThreshold) {
          // Свайп вниз
          if (onSwipeDown) {
            runOnJS(onSwipeDown)();
          }
        } else if (event.translationY < -threshold || event.velocityY < -velocityThreshold) {
          // Свайп вверх
          if (onSwipeUp) {
            runOnJS(onSwipeUp)();
          }
        }
      }

      // Возвращаем в исходное положение
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default CustomGestureHandler; 