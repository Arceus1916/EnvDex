import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: 'student', title: 'Student', icon: '🎒', desc: 'Learning about nature.' },
  { id: 'researcher', title: 'Researcher', icon: '🔬', desc: 'Academic and scientific logging.' },
  { id: 'explorer', title: 'Explorer', icon: '🏕️', desc: 'Hiking and outdoor adventures.' },
  { id: 'photographer', title: 'Photographer', icon: '📸', desc: 'Capturing nature through a lens.' },
  { id: 'collector', title: 'Collector', icon: '📚', desc: 'Building a personal biodiversity archive.' },
];

export default function CategoryScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background p-safe-margin pt-12">
      <Text className="text-3xl font-sans font-bold text-primary mb-2">
        How will you use EnvDex?
      </Text>
      <Text className="text-on-surface text-base mb-8 leading-6">
        This helps personalize your logging experience. You can always change this later.
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity 
            key={cat.id}
            className="flex-row items-center bg-surface-container p-4 rounded-2xl mb-4"
            onPress={() => router.push({ pathname: '/(auth)/permissions', params: { category: cat.id } })}
          >
            <View className="w-12 h-12 bg-surface-container-high rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">{cat.icon}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-sans font-bold text-on-surface">{cat.title}</Text>
              <Text className="text-sm text-on-surface-variant mt-1">{cat.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="pt-4 pb-8">
        <TouchableOpacity 
          className="py-4 items-center"
          onPress={() => router.push('/(auth)/permissions')}
        >
          <Text className="text-outline font-sans text-base">Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
