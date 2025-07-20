import RNFS from 'react-native-fs';

// Получить список всех конфигов (названия и содержимое)
export async function getAllWireGuardConfigs(configsDir) {
  const files = await RNFS.readDir(configsDir);
  const configFiles = files.filter(f => f.name.endsWith('.txt'));
  const configs = [];
  for (const file of configFiles) {
    const body = await RNFS.readFile(file.path, 'utf8');
    configs.push({ name: file.name.replace(/\.txt$/, ''), body });
  }
  return configs;
}

// Получить конфиг по имени
export async function getWireGuardConfigByName(configsDir, configName) {
  const filePath = `${configsDir}/${configName}.txt`;
  const exists = await RNFS.exists(filePath);
  if (!exists) return null;
  const body = await RNFS.readFile(filePath, 'utf8');
  return { name: configName, body };
}

// Парсер .txt WireGuard в WireGuardConfig
export function parseWireGuardConfig(configText) {
  // Удаляем комментарии и пустые строки
  const lines = configText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  let config = {
    privateKey: '',
    publicKey: '',
    serverAddress: '',
    serverPort: 51820,
    allowedIPs: ['0.0.0.0/0'],
    dns: [],
    mtu: 1450,
    presharedKey: undefined
  };
  for (let line of lines) {
    if (line.startsWith('PrivateKey')) config.privateKey = line.split('=')[1].trim();
    if (line.startsWith('PublicKey')) config.publicKey = line.split('=')[1].trim();
    if (line.startsWith('Address')) config.address = line.split('=')[1].trim();
    if (line.startsWith('Endpoint')) {
      const endpoint = line.split('=')[1].trim();
      const [host, port] = endpoint.split(':');
      config.serverAddress = host;
      config.serverPort = parseInt(port, 10);
    }
    if (line.startsWith('AllowedIPs')) config.allowedIPs = line.split('=')[1].trim().split(',').map(ip => ip.trim());
    if (line.startsWith('DNS')) config.dns = line.split('=')[1].trim().split(',').map(d => d.trim());
    if (line.startsWith('PresharedKey')) config.presharedKey = line.split('=')[1].trim();
    if (line.startsWith('MTU')) config.mtu = parseInt(line.split('=')[1].trim(), 10);
  }
  // address -> not used in WireGuardConfig, skip
  return config;
}

// Путь к директории конфигов
export const configsPath = RNFS.DocumentDirectoryPath + '/configs';



