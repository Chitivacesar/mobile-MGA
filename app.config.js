const { getDefaultConfig } = require('expo/metro-config');

module.exports = {
  name: 'MGA-MOVIL',
  slug: 'MGA-MOVIL',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'mgamovil',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      }
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: '35.0.0',
          kotlinVersion: '2.0.0',
          extraProguardRules: '-keep class com.cesarchitivax17.MGAMOVIL.BuildConfig { *; }'
        },
        ios: {
          deploymentTarget: '15.1',
          useFrameworks: 'static'
        }
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    apiUrl: 'https://apiwebmga.onrender.com',
    router: {},
    eas: {
      projectId: 'dc4fe196-c7d1-4018-8795-b59935a19515'
    }
  },
  ios: {
    supportsTablet: true,
    jsEngine: 'hermes',
    bundleIdentifier: 'com.cesarchitivax17.MGAMOVIL',
    deploymentTarget: '15.1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    edgeToEdgeEnabled: true,
    jsEngine: 'hermes',
    package: 'com.cesarchitivax17.MGAMOVIL'
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  }
};