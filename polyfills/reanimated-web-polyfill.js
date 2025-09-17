// Polyfill para React Native Reanimated en web
// Evita el error de timeout y useNativeDriver

import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Polyfill para Animated en web
  const originalAnimated = require('react-native-reanimated');
  
  // Sobrescribir la configuración para web
  if (originalAnimated.configureReanimated) {
    originalAnimated.configureReanimated({
      useNativeDriver: false,
    });
  }
  
  // Polyfill para evitar timeouts
  const originalTiming = originalAnimated.timing;
  if (originalTiming) {
    originalAnimated.timing = (value, config) => {
      const webConfig = {
        ...config,
        useNativeDriver: false,
        duration: Math.min(config.duration || 300, 1000), // Limitar duración máxima
      };
      return originalTiming(value, webConfig);
    };
  }
  
  // Polyfill para spring
  const originalSpring = originalAnimated.spring;
  if (originalSpring) {
    originalAnimated.spring = (value, config) => {
      const webConfig = {
        ...config,
        useNativeDriver: false,
        tension: Math.min(config.tension || 100, 200), // Limitar tensión
        friction: Math.max(config.friction || 7, 3), // Aumentar fricción mínima
      };
      return originalSpring(value, webConfig);
    };
  }
}
