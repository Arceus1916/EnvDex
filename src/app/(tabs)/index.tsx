import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-safe-margin">
      <Text className="text-3xl font-sans text-primary mb-2">EnvDex Home</Text>
      <Text className="text-on-surface text-base text-center">
        Your latest observations will appear here.
      </Text>
    </View>
  );
}
