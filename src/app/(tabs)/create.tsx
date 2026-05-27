import { View, Text } from 'react-native';

export default function CreateObservationScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-safe-margin">
      <Text className="text-2xl font-sans text-primary mb-2">Capture Observation</Text>
      <Text className="text-on-surface text-base text-center">
        Camera and Gallery imports will appear here.
      </Text>
    </View>
  );
}
