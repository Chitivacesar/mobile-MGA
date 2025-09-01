import Constants from 'expo-constants';

// Para desarrollo local
const DEV_API_URL = 'http://localhost:3000/api';

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


