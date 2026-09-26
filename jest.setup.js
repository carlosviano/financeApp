// Unistyles and Nitro are native modules with no runtime under Jest. The
// package ships mocks for both.
require('react-native-unistyles/mocks');

// Register the themes before any component module runs StyleSheet.create,
// just as index.ts does in the app.
require('./src/theme/runtime');
