module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Unistyles rewrites StyleSheet.create calls under src/ so theme changes
    // reach native views without a React re-render.
    plugins: [['react-native-unistyles/plugin', { root: 'src' }]],
  };
};
