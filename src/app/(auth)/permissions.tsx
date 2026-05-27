import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PermissionsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();

  return (
    <View className="flex-1 bg-background p-safe-margin pt-12">
      <Text className="text-3xl font-sans font-bold text-primary mb-2">
        Permissions Overview
      </Text>
      <Text className="text-on-surface text-base mb-8 leading-6">
        EnvDex works entirely offline. We only request permissions necessary for core features.
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-surface-container p-4 rounded-2xl mb-4">
          <Text className="text-xl font-bold mb-2">📸 Camera & Gallery</Text>
          <Text className="text-on-surface-variant leading-5">
            Required to capture new observations and import existing media into your local archive.
          </Text>
        </View>

        <View className="bg-surface-container p-4 rounded-2xl mb-4">
          <Text className="text-xl font-bold mb-2">📍 Location</Text>
          <Text className="text-on-surface-variant leading-5">
            Used to automatically tag where you found a species. You can disable this and type locations manually.
          </Text>
        </View>

        <View className="bg-surface-container p-4 rounded-2xl mb-4">
          <Text className="text-xl font-bold mb-2">🔔 Notifications</Text>
          <Text className="text-on-surface-variant leading-5">
            Local reminders to review drafts or revisit areas. No data leaves your device.
          </Text>
        </View>
      </ScrollView>

      <View className="w-full pb-8 pt-4">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-full w-full items-center"
          onPress={() => router.push({ pathname: '/(auth)/signup', params: { category } })}
        >
          <Text className="text-on-primary font-sans font-bold text-lg">Continue to Setup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
