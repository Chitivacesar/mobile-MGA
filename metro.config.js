const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración para resolver alias de importación
config.resolver.alias = {
  '@': __dirname,
};

module.exports = config;
