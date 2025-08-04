// src/components/TimePicker.js
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { pixelToHeight } from '../styles/commonStyles';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const WINDOW_HEIGHT = Dimensions.get('window').height;

// Для корректного позиционирования значения по центру
const getInitialIndex = (value, max) => {
  let v = parseInt(value, 10);
  if (isNaN(v) || v < 0) return 0;
  if (v >= max) return max - 1;
  return v;
};

const TimePicker = ({ currentTime, onTimeChange, onClose }) => {
  // Сдвиг для центрирования выбранного значения
  const PADDING_ITEMS = Math.floor(VISIBLE_ITEMS / 2);

  const [hours, setHours] = useState(getInitialIndex(currentTime.split(':')[0], 24));
  const [minutes, setMinutes] = useState(getInitialIndex(currentTime.split(':')[1], 60));
  const [seconds, setSeconds] = useState(getInitialIndex(currentTime.split(':')[2], 60));

  const hoursScroll = useRef(null);
  const minutesScroll = useRef(null);
  const secondsScroll = useRef(null);

  // Для хранения текущего scrollY (используется для корректного выбора значения после инерции)
  const hoursScrollY = useRef(hours * ITEM_HEIGHT);
  const minutesScrollY = useRef(minutes * ITEM_HEIGHT);
  const secondsScrollY = useRef(seconds * ITEM_HEIGHT);

  // Скроллим к текущему значению при открытии (чтобы выбранное значение было по центру)
  useEffect(() => {
    setTimeout(() => {
      if (hoursScroll.current) hoursScroll.current.scrollTo({ y: (hours) * ITEM_HEIGHT, animated: false });
      if (minutesScroll.current) minutesScroll.current.scrollTo({ y: (minutes) * ITEM_HEIGHT, animated: false });
      if (secondsScroll.current) secondsScroll.current.scrollTo({ y: (seconds) * ITEM_HEIGHT, animated: false });
    }, 0);
    // eslint-disable-next-line
  }, [hours, minutes, seconds]);

  // Функция для корректного выбора значения после полной остановки скролла (момент окончания инерции)
  const handleMomentumScrollEnd = (event, max, setValue, ref, scrollYRef) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let index = Math.round(offsetY / ITEM_HEIGHT);
    if (index < 0) index = 0;
    if (index > max - 1) index = max - 1;
    setValue(index);
    scrollYRef.current = index * ITEM_HEIGHT;
    // Скроллим точно к элементу (фиксируем)
    ref.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  // Следим за scroll и сохраняем последнее положение (но не меняем значение)
  const handleScroll = (event, scrollYRef) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
  };

  const handleApply = () => {
    onTimeChange(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
    onClose();
  };

  // Рендер одного "колеса"
  const renderPicker = (label, value, setValue, max, ref, scrollYRef) => {
    // Добавляем пустые элементы сверху и снизу для эффекта "центра"
    const data = [
      ...Array(PADDING_ITEMS).fill(''),
      ...Array.from({ length: max }, (_, i) => String(i).padStart(2, '0')),
      ...Array(PADDING_ITEMS).fill(''),
    ];

    // Текущее выбранное значение вычисляем по scrollYRef
    const selectedIndex = Math.round(scrollYRef.current / ITEM_HEIGHT);

    return (
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <View style={styles.pickerWheelWrapper}>
          <Animated.ScrollView
            ref={ref}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
            bounces={false}
            contentContainerStyle={{
              paddingVertical: 0,
            }}
            onMomentumScrollEnd={event => handleMomentumScrollEnd(event, max, setValue, ref, scrollYRef)}
            onScroll={event => handleScroll(event, scrollYRef)}
            scrollEventThrottle={16}
            // Начальное смещение для центрирования
            contentOffset={{ y: value * ITEM_HEIGHT }}
          >
            {data.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.pickerItem,
                  i === selectedIndex + PADDING_ITEMS && item !== '' && styles.pickerItemSelected,
                ]}
              >
                <Text
                  style={[
                    styles.pickerText,
                    i === selectedIndex + PADDING_ITEMS && item !== '' && styles.pickerTextSelected,
                    item === '' && { color: 'transparent' },
                  ]}
                >
                  {item}
                </Text>
              </View>
            ))}
          </Animated.ScrollView>
          {/* Две фиолетовые полоски: одна сверху выбранного времени, одна снизу */}
          <View pointerEvents="none" style={styles.selectionOverlay}>
            <View style={styles.selectionLineTop} />
            <View style={styles.selectionLineBottom} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Выберите время</Text>
        <View style={styles.pickerRow}>
          {renderPicker('Часы', hours, setHours, 24, hoursScroll, hoursScrollY)}
          {renderPicker('Минуты', minutes, setMinutes, 60, minutesScroll, minutesScrollY)}
          {renderPicker('Секунды', seconds, setSeconds, 60, secondsScroll, secondsScrollY)}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
            <Text style={styles.buttonText}>Применить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '90%',
    backgroundColor: '#191920',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    elevation: 8,
  },
  title: {
    color: '#D3D3D3',
    fontSize: 18,
    marginBottom: 18,
    fontWeight: '600',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  pickerContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    color: '#D3D3D3',
    marginBottom: 6,
    fontSize: 14,
  },
  pickerWheelWrapper: {
    width: 70,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#23232A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2D2D38',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemSelected: {
    // Можно добавить фон или жирный шрифт
  },
  pickerText: {
    color: '#D3D3D3',
    fontSize: 22,
    fontWeight: '400',
    opacity: 0.6,
  },
  pickerTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 26,
    opacity: 1,
  },
  selectionOverlay: {
    position: 'absolute',
    left: 0, right: 0,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    top: 0,
    pointerEvents: 'none',
  },
  selectionLineTop: {
    position: 'absolute',
    left: 0, right: 0,
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    height: 0,
    borderTopWidth: 2,
    borderTopColor: '#723CEB',
  },
  selectionLineBottom: {
    position: 'absolute',
    left: 0, right: 0,
    top: ITEM_HEIGHT * (Math.floor(VISIBLE_ITEMS / 2) + 1),
    height: 0,
    borderTopWidth: 2,
    borderTopColor: '#723CEB',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#7F8E9D',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: '#723CEB',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TimePicker;