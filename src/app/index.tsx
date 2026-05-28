import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../stores/useAuthStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AppEntry() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const fadeAnim = new Animated.Value(0);
  const floatAnim = new Animated.Value(10);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(floatAnim, {
        toValue: 0,
        friction: 4,
        tension: 20,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, fadeAnim, floatAnim]);

  return (
    <View className="flex-1 bg-secondary-container items-center justify-center relative">
      <View className="absolute inset-0 bg-white/30" />
      
      <Animated.View 
        className="z-10 flex flex-col items-center justify-center w-full px-margin-mobile"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: floatAnim }]
        }}
      >
        <View className="mb-sm opacity-90">
          <FontAwesome name="globe" size={64} color="#006763" />
        </View>
        <Text className="text-[40px] font-bold text-primary tracking-tight font-sans">
          EnvDex
        </Text>
        <Text className="text-[12px] font-bold text-secondary mt-xs tracking-widest uppercase opacity-60 font-sans">
          Field Journal
        </Text>
        
        <View className="absolute top-[250px] w-48 flex flex-col items-center">
          <View className="w-full h-[2px] bg-outline-variant/30 rounded-full overflow-hidden relative">
             <View className="absolute top-0 left-0 h-full w-1/3 bg-primary rounded-full" />
          </View>
          <Text className="text-[10px] text-tertiary mt-sm opacity-50 tracking-widest uppercase font-bold font-sans">
            Calibrating
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
