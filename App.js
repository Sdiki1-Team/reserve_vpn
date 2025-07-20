import React from 'react';
import MainTabs from './src/system_functions/navigation';
import { View, StatusBar } from 'react-native';

function App() {
  return (
    <View style={{flex: 1}}>
      <StatusBar
        backgroundColor="#101010"
        barStyle="light-content"
      />
      <MainTabs />
    </View>
  )
}
export default App;

