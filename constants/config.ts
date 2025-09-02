import Constants from 'expo-constants';

// Para desarrollo local - Usar IP de la máquina en lugar de localhost
// Si estás en el mismo WiFi, usa la IP de tu computadora
const DEV_API_URL = 'http://172.20.10.5:3000/api';

// Para producción o si está configurado en las variables de entorno
const EXPO_PUBLIC_API_BASE_URL = Constants.expoConfig?.extra?.apiUrl;

export const API_BASE_URL = EXPO_PUBLIC_API_BASE_URL || DEV_API_URL;

// Configuración adicional
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  retries: 3,
};

console.log('API Configuration:', {
  API_BASE_URL,
  EXPO_PUBLIC_API_BASE_URL,
  DEV_API_URL
});


