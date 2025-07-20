import { DeviceEventEmitter, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WireguardModule from 'wireguard-native-bridge';
import { getWireGuardConfigByName, configsPath, getAllWireGuardConfigs } from '../config/configs';
import { initConfigs } from '../config/initConfigs';

export class NetworkService {
  constructor() {
    this.currentConfigName = null;
    this.isConnected = false;
    this.version = '2.0.0';
    this.initialize();
  }

  async initialize() {
    try {
      await initConfigs(); // Гарантируем, что папка и файлы существуют
      await WireguardModule.prepareVPN();
    } catch (error) {
      console.error('Ошибка prepareVPN:', error);
    }
    await this.loadSavedConfig();
  }

  async loadSavedConfig() {
    try {
      const savedConfigName = await AsyncStorage.getItem('lastConfigName');
      if (savedConfigName) {
        this.currentConfigName = savedConfigName;
      }
    } catch (error) {
      this.currentConfigName = null;
    }
  }

  async connect() {
    if (!this.currentConfigName) throw new Error('No configuration selected');
    try {
      const configObj = await getWireGuardConfigByName(configsPath, this.currentConfigName);
      if (!configObj) throw new Error('Config not found');
      
      // Добавляем необходимые параметры в конфиг
      let configText = configObj.body;
      
      
      console.log('now config:', this.currentConfigName);
      console.log('config text:', configText);

      
      
      await WireguardModule.startTunnel(configText);
      this.isConnected = true;
      await this.saveConfig();
      return true;
    } catch (error) {
      this.isConnected = false;
      console.error('Connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.isConnected) {
        await WireguardModule.stopTunnel();
        this.isConnected = false;
      }
      return true;
    } catch (error) {
      console.error('Disconnection error:', error);
      throw error;
    }
  }

  async setConfig(configName) {
    // Не переподключаем если конфиг не изменился
    if (this.currentConfigName === configName) return;
    
    const wasConnected = this.isConnected;
    
    if (wasConnected) {
      await this.disconnect();
    }
    
    this.currentConfigName = configName;
    await AsyncStorage.setItem('lastConfigName', configName);
    
    if (wasConnected) {
      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnection failed:', error);
      }
    }
  }

  async saveConfig() {
    if (!this.currentConfigName) return;
    try {
      await AsyncStorage.setItem('lastConfigName', this.currentConfigName);
      let history = await AsyncStorage.getItem('vpnConfigs');
      history = history ? JSON.parse(history) : [];
      
      // Обновляем существующую запись вместо добавления новой
      const existingIndex = history.findIndex(h => h.name === this.currentConfigName);
      if (existingIndex !== -1) {
        history[existingIndex].date = new Date().toISOString();
      } else {
        history.unshift({ 
          name: this.currentConfigName, 
          date: new Date().toISOString() 
        });
      }
      
      await AsyncStorage.setItem('vpnConfigs', JSON.stringify(history.slice(0, 10)));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  async getStatus() {
    return {
      isConnected: this.isConnected,
      config: this.currentConfigName ? { name: this.currentConfigName } : null,
      version: this.version
    };
  }

  async getAvailableConfigs() {
    try {
      const configs = await AsyncStorage.getItem('vpnConfigs');
      return configs ? JSON.parse(configs) : [];
    } catch (error) {
      console.error('Error getting configs:', error);
      return [];
    }
  }

  async getAllConfigs() {
    try {
      const configs = await getAllWireGuardConfigs(configsPath);
      return configs.map(c => ({ name: c.name }));
    } catch (error) {
      console.error('Error getting all configs:', error);
      return [];
    }
  }

  cleanup() {
    // Очищаем ресурсы при необходимости
  }

  onNetworkStateChange(callback) {
    // Реализуйте обработчик изменений состояния сети
  }
}

export const vpnService = new NetworkService();
