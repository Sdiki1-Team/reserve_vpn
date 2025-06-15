import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

import HomeScreen from '../components/HomeScreen';
import ChangeServerScreen from '../components/ChangeServerScreen';
import ProfileScreen from '../components/ProfileScreen';
import FamilySubscribeScreen from '../components/FamilySubscribeScreen';
import SettingsScreen from '../components/SettingsScreen';
import SettingsConnectionScreen from '../components/SettingsConnectionScreen';
import SettingsVPNMOdeScreen from '../components/SettingsVPNMOdeScreen';
import AppSelection from '../components/AppSelectoin';
import SiteSelection from '../components/SiteSelection';
import SettingsParameters from '../components/SettingsParametersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack with gesture support
function HomeStack() {
  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#101010' }}>
        <Stack.Navigator 
          screenOptions={{ 
            gestureEnabled: false,
            headerShown: false,
            contentStyle: { backgroundColor: '#101010' }
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChangeServer" component={ChangeServerScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </View>
  );
}

// Profile Stack with gesture support
function ProfileStack() {
  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#101010' }}>
        <Stack.Navigator 
          screenOptions={{ 
            gestureEnabled: false,
            headerShown: false,
            contentStyle: { backgroundColor: '#101010' }
          }}
        >
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </View>
  );
}

// Settings Stack with gesture support
function SettingsStack() {
  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#101010' }}>
        <Stack.Navigator 
          screenOptions={{ 
            gestureEnabled: false,
            headerShown: false,
            contentStyle: { backgroundColor: '#101010' }
          }}
        >
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VPNSettings" component={SettingsVPNMOdeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ConnectionSettings" component={SettingsConnectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AppSelection" component={AppSelection} options={{ headerShown: false }} />
          <Stack.Screen name="SiteSelection" component={SiteSelection} options={{ headerShown: false }} />
          <Stack.Screen name="SettingsParameters" component={SettingsParameters} options={{ headerShown: false }} />
          <Stack.Screen name="FamilySubscribe" component={FamilySubscribeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </View>
  );
}

function MainTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#101010' }}>
          <NavigationContainer>
            <Tab.Navigator
              tabBar={props => <CustomTabBar {...props} />}
              screenOptions={{ 
                headerShown: false, 
                gestureEnabled: false,
                contentStyle: { backgroundColor: '#101010' }
              }}
            >
              <Tab.Screen name="HomeTab" component={HomeStack} />
              <Tab.Screen name="ProfileTab" component={ProfileStack} />
              <Tab.Screen name="SettingsTab" component={SettingsStack} />
            </Tab.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </View>
  );
}

export default MainTabs;
