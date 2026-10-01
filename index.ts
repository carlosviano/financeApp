// Order matters: themes before any StyleSheet.create, and the mock API
// (there is no backend yet) before any request.
import './src/theme/runtime';
import './src/mocks/install';
import 'expo-router/entry';
