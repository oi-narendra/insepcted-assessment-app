module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  // This must be the last plugin
  plugins.push('react-native-reanimated/plugin');
  plugins.push([
    'module-resolver',
    {
      root: ['.'],
      alias: {
        '@components': './components',
        '@hooks': './hooks',
        '@dataTypes': './types',
        '@utils': './utils',
        '@constants': './constants',
        '@assets': './assets',
      },
    },
  ]);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
