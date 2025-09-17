import { Platform } from 'react-native';

/**
 * Hook para configurar Reanimated de manera compatible con web
 * En web, useNativeDriver debe ser false
 * En móvil, puede usar useNativeDriver: true
 */
export const useReanimatedConfig = () => {
  const isWeb = Platform.OS === 'web';
  
  return {
    useNativeDriver: !isWeb, // false en web, true en móvil
    duration: isWeb ? 300 : 250, // Animaciones más rápidas en web
  };
};

/**
 * Configuración por defecto para animaciones
 */
export const getAnimationConfig = () => {
  const isWeb = Platform.OS === 'web';
  
  return {
    useNativeDriver: !isWeb,
    duration: isWeb ? 300 : 250,
  };
};
