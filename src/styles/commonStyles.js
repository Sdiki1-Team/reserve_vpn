import { Dimensions, StyleSheet, Platform } from 'react-native';

const { height } = Dimensions.get('screen');
console.log(height);

export const pixelToHeight = (pixels) => {
  if (pixels === 1){
     return 1;
  }
  return (pixels / 800) * height;
};

export const commonStyles = StyleSheet.create({
  // Основные контейнеры
  container: {
    flex: 1,
    paddingTop: pixelToHeight(Platform.OS === 'ios' ? 55 : 25), 
    backgroundColor: '#101010',
  },
  
   centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: pixelToHeight(20),
  },
  
  // Контент с отступом сверху
  contentWithTopPadding: {
    flex: 1,
    paddingTop: pixelToHeight(50),
  },
  
  // Тексты
  titleText: {
    fontSize: pixelToHeight(24),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: pixelToHeight(30),
  },
  
  centeredTitleText: {
    fontSize: pixelToHeight(24),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: pixelToHeight(100),
  },

  absouluteCenteredTitile: {
    minWidth: Dimensions.get('window').width,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    top: pixelToHeight(25),
  },
  
  // Кнопки
  primaryButton: {
    backgroundColor: '#723CEB',
    paddingHorizontal: pixelToHeight(30),
    paddingVertical: pixelToHeight(15),
    borderRadius: pixelToHeight(10),
    marginTop: pixelToHeight(20),
  },
  
  wideButton: {
    backgroundColor: '#723CEB',
    paddingHorizontal: pixelToHeight(30),
    paddingVertical: pixelToHeight(15),
    borderRadius: pixelToHeight(10),
    marginTop: pixelToHeight(15),
    width: '80%',
  },
  
  buttonText: {
    color: 'white',
    fontSize: pixelToHeight(20),
    fontWeight: 'bolder',
    textAlign: 'center',
  },
  
  // Кнопки "Назад"
  backButton: {
    position: 'absolute',
    top: pixelToHeight(50),
    left: pixelToHeight(20),
    zIndex: 1,
    padding: pixelToHeight(10),
  },
  
  backButtonText: {
    fontSize: pixelToHeight(20),
    color: '#723CEB',
    fontWeight: 'bolder',
  },
}); 