import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateObservationScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background items-center justify-center p-safe-margin">
      <View className="w-24 h-24 bg-primary-container rounded-full items-center justify-center mb-8">
        <Text className="text-4xl">📸</Text>
      </View>

      <Text className="text-3xl font-sans font-bold text-primary mb-4 text-center">
        New Observation
      </Text>
      <Text className="text-on-surface text-base text-center mb-12 px-4 leading-6">
        Capture a new sighting using your camera or import existing media from your gallery.
      </Text>

      <View className="w-full">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-full w-full items-center mb-4 flex-row justify-center"
          onPress={() => router.push('/observation/camera')}
        >
          <Text className="text-xl mr-2">📷</Text>
          <Text className="text-on-primary font-sans font-bold text-lg">Open Camera / Gallery</Text>
        </TouchableOpacity>
        
        {/* Placeholder for future text-only quick note feature */}
        <TouchableOpacity 
          className="py-4 items-center bg-surface-container rounded-full w-full"
          onPress={() => {
            // Note-only observation shortcut
            router.push('/observation/details');
          }}
        >
          <Text className="text-on-surface font-sans font-bold text-lg">Text-Only Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
