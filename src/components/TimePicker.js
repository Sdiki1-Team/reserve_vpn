// src/components/TimePicker.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const TimePicker = ({ currentTime, onTimeChange, onClose }) => {
  const [hours, setHours] = useState(parseInt(currentTime.split(':')[0], 10));
  const [minutes, setMinutes] = useState(parseInt(currentTime.split(':')[1], 10));
  const [seconds, setSeconds] = useState(parseInt(currentTime.split(':')[2], 10));

  const handleApply = () => {
    onTimeChange(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    onClose();
  };

  const renderPicker = (label, value, setValue, max) => {
    return (
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          snapToInterval={40} // Высота элемента
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            const index = Math.round(offsetY / 40); // Высота элемента
            setValue(index);
          }}
        >
          {Array.from({ length: max }, (_, i) => (
            <View key={i} style={styles.pickerItem}>
              <Text style={styles.pickerText}>{String(i).padStart(2, '0')}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите время</Text>
      <View style={styles.pickerRow}>
        {renderPicker('Секунды', seconds, setSeconds, 60)}
        {renderPicker('Минуты', minutes, setMinutes, 60)}
        {renderPicker('Часы', hours, setHours, 24)}
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: '40%',
    backgroundColor: '#191920',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute', // Центрирование
    top: '50%',
    left: '50%',
    transform: [{ translateX: -0.5 * '80%' }, { translateY: -0.5 * '40%' }],
  },
  title: {
    color: '#D3D3D3',
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  pickerContainer: {
    alignItems: 'center',
    marginHorizontal: 5, // Уменьшенный отступ
  },
  pickerLabel: {
    color: '#D3D3D3',
    marginBottom: 5,
  },
  scrollContainer: {
    height: 80, // Высота видимой области
    overflow: 'hidden',
  },
  pickerItem: {
    height: 40, // Высота элемента
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerText: {
    color: '#D3D3D3',
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#7F8E9D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: '#723CEB',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default TimePicker;