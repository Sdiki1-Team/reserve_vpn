import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

function ChangeServerScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../images/backgroud_stripes.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      <View style={[commonStyles.centeredContainer, { paddingTop: 50 }]}>
        <Text style={commonStyles.titleText}>Выбор сервера</Text>
        
        <TouchableOpacity 
          style={commonStyles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={commonStyles.buttonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default ChangeServerScreen;
