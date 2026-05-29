import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRealm } from '@realm/react';
import { AuthService } from '../../services/AuthService';
import { useAuthStore } from '../../stores/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const realm = useRealm();
  const loginToStore = useAuthStore((state) => state.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and Password are required.');
      return;
    }

    try {
      const user = AuthService.login(realm, {
        username: username,
        passwordHash: password,
      });

      if (user) {
        loginToStore(user.hashId);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View className="flex-1 bg-[#E4DDD3] pt-16">
      {/* Top Navigation */}
      <View className="w-full px-margin-mobile pb-lg flex-row justify-between items-center z-50">
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-high"
          onPress={() => router.back()}
        >
          <Text className="text-[20px]">←</Text>
        </TouchableOpacity>
        <Text className="font-sans text-[12px] font-semibold text-secondary tracking-widest uppercase">
          Welcome Back
        </Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-margin-mobile pt-md" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mb-xl text-center md:text-left">
          <Text className="text-[40px] font-bold text-primary mb-sm font-sans">
            Access Journal
          </Text>
          <Text className="text-[16px] text-on-surface-variant font-sans">
            Enter your credentials to decrypt your local archive.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-on-surface-variant font-bold mb-2 font-sans text-[12px] uppercase tracking-widest">Username *</Text>
          <TextInput
            className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl text-on-surface font-sans shadow-sm"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            selectionColor="#00A19B"
          />
        </View>

        <View className="mb-12">
          <Text className="text-on-surface-variant font-bold mb-2 font-sans text-[12px] uppercase tracking-widest">Password *</Text>
          <View className="relative">
            <TextInput
              className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl text-on-surface font-sans shadow-sm pr-12"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              selectionColor="#00A19B"
            />
            <TouchableOpacity 
              className="absolute right-4 top-4"
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6d7a78" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          className="w-full bg-[#00A19B] py-md rounded-full items-center shadow-lg active:opacity-90 flex-row justify-center mb-6"
          onPress={handleLogin}
        >
          <Text className="text-on-primary font-sans font-semibold text-[20px] mr-2">Login</Text>
          <Text className="text-on-primary text-[20px]">→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="py-4 items-center"
          onPress={() => router.push('/(auth)/category')}
        >
          <Text className="text-primary font-sans font-semibold text-[14px]">Don't have a profile? Create one</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
