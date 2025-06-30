import { Dimensions, StyleSheet } from 'react-native';

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
    paddingTop: 25, 
    backgroundColor: '#101010',
  },
  
   centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  
  // Контент с отступом сверху
  contentWithTopPadding: {
    flex: 1,
    paddingTop: 50,
  },
  
  // Тексты
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  
  centeredTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 100,
  },

  absouluteCenteredTitile: {
    minWidth: Dimensions.get('window').width,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    top: 25,
  },
  
  // Кнопки
  primaryButton: {
    backgroundColor: '#723CEB',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  
  wideButton: {
    backgroundColor: '#723CEB',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
    width: '80%',
  },
  
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bolder',
    textAlign: 'center',
  },
  
  // Кнопки "Назад"
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  
  backButtonText: {
    fontSize: 20,
    color: '#723CEB',
    fontWeight: 'bolder',
  },
}); 