import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background items-center justify-center p-safe-margin">
      <View className="flex-1 items-center justify-center w-full">
        {/* Placeholder for Hero Illustration */}
        <View className="w-48 h-48 bg-surface-container rounded-full mb-8 items-center justify-center">
          <Text className="text-4xl">🌿</Text>
        </View>

        <Text className="text-3xl font-sans font-bold text-primary mb-4 text-center">
          Welcome to EnvDex
        </Text>
        <Text className="text-on-surface text-base text-center mb-8 px-4 leading-6">
          Your personal offline-first biodiversity archive and nature journal. Capture the world around you.
        </Text>
      </View>

      <View className="w-full pb-8">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-full w-full items-center mb-4"
          onPress={() => router.push('/(auth)/category')}
        >
          <Text className="text-on-primary font-sans font-bold text-lg">Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="py-2 items-center"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-primary font-sans text-base">I already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
