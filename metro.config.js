const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Get base config
const defaultConfig = getDefaultConfig(__dirname);

// Add SVG support using react-native-svg-transformer
const { assetExts, sourceExts } = defaultConfig.resolver;

// Configuration for SVG files
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
