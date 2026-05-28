import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import * as Notifications from 'expo-notifications';

export default function ProfileScreen() {
  const router = useRouter();
  const { userHashId, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        setNotificationsEnabled(true);
        Alert.alert('Enabled', 'Local reminders are active.');
      } else {
        Alert.alert('Denied', 'Permission is required to send reminders.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out', 
      'Are you sure? Your data remains on the device, but you will need your Hash ID to log back in.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-background pt-12 px-safe-margin">
      <Text className="text-3xl font-sans font-bold text-primary mb-8">Profile</Text>

      <View className="bg-surface-container rounded-2xl p-6 mb-8 items-center">
        <View className="w-20 h-20 bg-primary-container rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-xl font-bold text-on-surface">Explorer</Text>
        <Text className="text-on-surface-variant mt-1">Hash ID: {userHashId}</Text>
      </View>

      <View className="mb-8">
        <Text className="text-sm font-bold text-on-surface-variant uppercase mb-4 px-2">Settings</Text>
        
        <View className="bg-surface-container rounded-2xl overflow-hidden">
          {/* Notifications Toggle */}
          <View className="flex-row items-center justify-between p-4 border-b border-surface-container-high">
            <View className="flex-row items-center">
              <Text className="text-xl mr-4">🔔</Text>
              <Text className="text-on-surface font-bold text-lg">Local Reminders</Text>
            </View>
            <Switch 
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#639b92' }} // Mint color
            />
          </View>

          {/* Theme Toggle (Mock) */}
          <View className="flex-row items-center justify-between p-4 border-b border-surface-container-high">
            <View className="flex-row items-center">
              <Text className="text-xl mr-4">🌙</Text>
              <Text className="text-on-surface font-bold text-lg">Dark Mode</Text>
            </View>
            <Switch 
              value={theme === 'dark'}
              onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
              trackColor={{ false: '#767577', true: '#639b92' }}
            />
          </View>

          {/* Recycle Bin */}
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4"
            onPress={() => router.push('/profile/recycle-bin')}
          >
            <View className="flex-row items-center">
              <Text className="text-xl mr-4">🗑️</Text>
              <Text className="text-on-surface font-bold text-lg">Recycle Bin</Text>
            </View>
            <Text className="text-on-surface-variant text-lg">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        className="mt-auto mb-8 bg-error/10 py-4 rounded-full items-center"
        onPress={handleLogout}
      >
        <Text className="text-error font-bold text-lg">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
