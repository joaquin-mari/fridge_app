// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolver for Node.js modules that might be used by dependencies
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    stream: require.resolve("stream-browserify"),
    http: require.resolve("@tradle/react-native-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("react-native-os"),
    path: require.resolve("path-browserify"),
    fs: require.resolve("react-native-level-fs"),
  },
};

module.exports = config;
