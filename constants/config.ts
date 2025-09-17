import Constants from 'expo-constants';

// API en la nube - MGA Backend
const CLOUD_API_URL = 'https://apiwebmga.onrender.com';

// Para desarrollo local (fallback)
const LOCAL_API_URLS = [
  'http://localhost:3000/api',      // Para desarrollo local
  'http://127.0.0.1:3000/api',      // Localhost alternativo
];

// Usa la API en la nube como principal
const DEV_API_URL = CLOUD_API_URL;

// Para producción o si está configurado en las variables de entorno
const EXPO_PUBLIC_API_BASE_URL = Constants.expoConfig?.extra?.apiUrl;

export const API_BASE_URL = EXPO_PUBLIC_API_BASE_URL || DEV_API_URL;

// Configuración optimizada para mejor rendimiento
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos - adecuado para endpoints grandes
  retries: 1, // Solo 1 reintento
  retryDelay: 1000, // 1 segundo entre reintentos
};

// URLs alternativas para probar (local como fallback)
export const ALTERNATIVE_URLS = LOCAL_API_URLS;

console.log('🌐 API Configuration:', {
  API_BASE_URL,
  EXPO_PUBLIC_API_BASE_URL,
  DEV_API_URL,
  'Cloud API': CLOUD_API_URL
});


