import Constants from 'expo-constants';

// Para desarrollo local - Configuración flexible
// URLs ordenadas por probabilidad de éxito
const DEV_API_URLS = [
  'http://localhost:3000/api',      // Para desarrollo en la misma máquina
  'http://127.0.0.1:3000/api',      // Localhost alternativo
  'http://10.0.2.2:3000/api',       // Para emulador Android (bridge)
  'http://172.20.10.5:3000/api',    // Tu IP actual (puede haber cambiado)
  'http://192.168.1.100:3000/api',  // IP común en redes domésticas
  'http://192.168.0.100:3000/api',  // Otra IP común
];

// Usa localhost como default (más probable que funcione)
const DEV_API_URL = DEV_API_URLS[0];

// Para producción o si está configurado en las variables de entorno
const EXPO_PUBLIC_API_BASE_URL = Constants.expoConfig?.extra?.apiUrl;

export const API_BASE_URL = EXPO_PUBLIC_API_BASE_URL || DEV_API_URL;

// Configuración adicional con timeouts más largos
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentado a 30 segundos
  retries: 3,
  retryDelay: 1000, // 1 segundo entre reintentos
};

// URLs alternativas para probar (exportar la lista completa)
export const ALTERNATIVE_URLS = DEV_API_URLS;

console.log('API Configuration:', {
  API_BASE_URL,
  EXPO_PUBLIC_API_BASE_URL,
  DEV_API_URL
});


