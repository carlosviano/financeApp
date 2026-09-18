import { Text, View } from 'react-native';

/**
 * Placeholder route. Phase 1 builds the token system and the enforcement
 * around it, not screens. This exists so the app boots and so the test and
 * typecheck pipeline has something real to run against.
 */
export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>financeApp</Text>
    </View>
  );
}
