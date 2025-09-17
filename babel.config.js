module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
        },
      ],
      // Use the new Worklets plugin (moved from Reanimated)
      'react-native-worklets/plugin',
    ],
  };
};
