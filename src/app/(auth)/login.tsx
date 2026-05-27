import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRealm } from '@realm/react';
import { AuthService } from '../../services/AuthService';
import { useAuthStore } from '../../stores/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const realm = useRealm();
  const loginToStore = useAuthStore((state) => state.login);

  const [hashId, setHashId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!hashId || !password) {
      Alert.alert('Error', 'Hash ID and Password are required.');
      return;
    }

    try {
      const user = AuthService.login(realm, {
        hashId: hashId.toUpperCase(),
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
    <View className="flex-1 bg-background p-safe-margin pt-12 justify-center">
      <Text className="text-3xl font-sans font-bold text-primary mb-2 text-center">
        Welcome Back
      </Text>
      <Text className="text-on-surface text-base mb-8 leading-6 text-center">
        Enter your Hash ID to access your local archive.
      </Text>

      <View className="mb-4">
        <Text className="text-on-surface-variant font-bold mb-2">Hash ID *</Text>
        <TextInput
          className="bg-surface-container p-4 rounded-xl text-on-surface"
          placeholder="e.g. A1B2C3"
          placeholderTextColor="#6d7a78"
          autoCapitalize="characters"
          value={hashId}
          onChangeText={setHashId}
        />
      </View>

      <View className="mb-8">
        <Text className="text-on-surface-variant font-bold mb-2">Password *</Text>
        <TextInput
          className="bg-surface-container p-4 rounded-xl text-on-surface"
          placeholder="••••••••"
          placeholderTextColor="#6d7a78"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity 
        className="bg-primary py-4 rounded-full w-full items-center mb-4"
        onPress={handleLogin}
      >
        <Text className="text-on-primary font-sans font-bold text-lg">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="py-4 items-center"
        onPress={() => router.push('/(auth)/signup')}
      >
        <Text className="text-primary font-sans text-base">Create a new profile</Text>
      </TouchableOpacity>
    </View>
  );
}
