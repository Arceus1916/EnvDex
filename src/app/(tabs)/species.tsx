import { View, Text } from 'react-native';

export default function SpeciesScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-safe-margin">
      <Text className="text-2xl font-sans text-primary mb-2">Species Archive</Text>
      <Text className="text-on-surface text-base text-center">
        Grouped species records will appear here.
      </Text>
    </View>
  );
}
