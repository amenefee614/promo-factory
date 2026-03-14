import { Text, View, Platform } from 'react-native';

export function AudioNote() {
  if (Platform.OS !== 'web') return null;

  return (
    <View className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}>
      <Text className="text-xs text-center" style={{ color: '#A5B4FC' }}>
        🔊 Sound effects are enabled on mobile devices (iOS/Android)
      </Text>
    </View>
  );
}
