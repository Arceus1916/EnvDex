import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRealm } from '@realm/react';
import { AuthService } from '../../services/AuthService';
import { useAuthStore } from '../../stores/useAuthStore';

export default function SignupScreen() {
  const router = useRouter();
  const realm = useRealm();
  const { category } = useLocalSearchParams<{ category: string }>();
  const loginToStore = useAuthStore((state) => state.login);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and Password are required.');
      return;
    }

    try {
      const user = await AuthService.signup(realm, {
        fullName,
        username,
        passwordHash: password, // MVP: basic storage
        categoryTag: category,
      });

      loginToStore(user.hashId);
      Alert.alert('Success', `Account created! Your Hash ID is: ${user.hashId}\nSave this ID if you need to log back in.`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <View className="flex-1 bg-background p-safe-margin pt-12">
      <Text className="text-3xl font-sans font-bold text-primary mb-2">
        Create Local Profile
      </Text>
      <Text className="text-on-surface text-base mb-8 leading-6">
        Your data is encrypted and stays on this device.
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="mb-4">
          <Text className="text-on-surface-variant font-bold mb-2">Full Name (Optional)</Text>
          <TextInput
            className="bg-surface-container p-4 rounded-xl text-on-surface"
            placeholder="Jane Doe"
            placeholderTextColor="#6d7a78"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-on-surface-variant font-bold mb-2">Username *</Text>
          <TextInput
            className="bg-surface-container p-4 rounded-xl text-on-surface"
            placeholder="nature_lover"
            placeholderTextColor="#6d7a78"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
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
          onPress={handleSignup}
        >
          <Text className="text-on-primary font-sans font-bold text-lg">Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="py-4 items-center"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-primary font-sans text-base">Already have a profile? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
