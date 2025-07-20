import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

/**
 * Инициализация конфигураций VPN
 * Копирует конфиги из assets в DocumentsDirectory
 */
export const initConfigs = async () => {
  try {
    const configsDir = RNFS.DocumentDirectoryPath + '/configs';
    const exists = await RNFS.exists(configsDir);
    
    if (!exists) {
      await RNFS.mkdir(configsDir);
      console.log('Создана директория для конфигов:', configsDir);
    }

    // Список конфигов для копирования
    const configs = [
      {
        name: 'вовин конфиг',
        content: `
[Interface]
PrivateKey = QJAYUHT4XGsu2CfWBIxMNB/hJGD9MIubd6Sk5eura30=
Address = 10.8.0.13/24
DNS = 8.8.8.8


[Peer]
PublicKey = 5JXE+CsfLlE2nLjQ3+1aC+nhwXZsqkLGuZmQzjUSiUA=
PresharedKey = kenLv1GNknrAZAnwYwndcvXh12X9hDO4tYmHuBRHuy4=
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 0
Endpoint = 147.45.224.103:51820`
      },
      {
        name: 'публичный конфиг',
        content: `[Interface]
PrivateKey = YJY4c0C3/jQlJ+8Y0z1CiJQS7sqnYF6e06GZdnKfU2c=
Address = 10.8.0.88/24
DNS = 1.1.1.1

[Peer]
PublicKey = bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=
AllowedIPs = 0.0.0.0/0
Endpoint = engage.cloudflareclient.com:2408`
      }
    ];

    // Копируем конфиги
    for (const config of configs) {
      const filePath = `${configsDir}/${config.name}.txt`;
      const fileExists = await RNFS.exists(filePath);
      
      
        await RNFS.writeFile(filePath, config.content, 'utf8');
        console.log(`Скопирован конфиг: ${config.name}`);
      
    }

    console.log('Инициализация конфигов завершена');
    return true;
  } catch (error) {
    console.error('Ошибка инициализации конфигов:', error);
    return false;
  }
}; 