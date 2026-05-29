import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRealm, useQuery } from '@realm/react';
import { User, SpeciesRecord, Observation } from '../../database/schema';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProfileScreen() {
  const router = useRouter();
  const { userHashId, logout } = useAuthStore();
  const realm = useRealm();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Get user data
  const currentUser = useQuery(User).filtered('hashId == $0', userHashId)[0];
  const userObservations = useQuery(Observation).filtered('userId == $0 AND deletedStatus == false', userHashId || '');
  const totalObservations = userObservations.length;
  // Sandboxing species count: unique species cataloged by user
  const totalSpecies = Array.from(new Set(userObservations.map(o => o.speciesId))).filter(Boolean).length;

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
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && currentUser) {
      realm.write(() => {
        currentUser.profilePicUri = result.assets[0].uri;
      });
    }
  };

  const fullName = currentUser?.fullName || 'Naturalist';
  const username = currentUser?.username || 'explorer';
  const categoryTag = currentUser?.categoryTag || 'Beginner';
  const profilePicSource = currentUser?.profilePicUri 
    ? { uri: currentUser.profilePicUri } 
    : { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Naturalist')}&background=00A19B&color=fff&size=150` };

  return (
    <View className="flex-1 bg-background relative">
      {/* Top Header */}
      <View className="absolute top-0 w-full z-50 bg-surface/90 border-b border-outline-variant/20 shadow-sm pt-safe-margin px-margin-mobile pb-2 flex-row justify-between items-center h-[90px]">
        <View className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 mt-4">
          <Image source={profilePicSource} className="w-full h-full object-cover" />
        </View>
        <Text className="font-sans text-[32px] font-bold text-primary tracking-tight mt-4">EnvDex</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center mt-4 rounded-full hover:bg-surface-container-high">
          <FontAwesome name="search" size={20} color="#006763" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 pt-[100px] pb-[120px] px-margin-mobile" showsVerticalScrollIndicator={false}>
        {/* Profile Identity Card */}
        <View className="bg-surface-container-lowest rounded-[24px] p-6 mb-4 items-center shadow-sm border border-outline-variant/10 relative overflow-hidden">
          <View className="absolute inset-0 bg-primary-container/5 pointer-events-none" />
          <View className="relative mb-4">
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <Image source={profilePicSource} className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-low shadow-sm" />
              <View className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-surface-container-lowest shadow-sm">
                <FontAwesome name="camera" size={12} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          <Text className="font-sans text-[28px] font-bold text-on-surface mb-1">{fullName}</Text>
          <Text className="font-sans text-[16px] text-secondary mb-2">@{username} • #{userHashId}</Text>
          <View className="bg-surface-container px-3 py-1 rounded-full mb-4">
            <Text className="font-sans text-[12px] font-semibold text-primary">{categoryTag}</Text>
          </View>
        </View>

        {/* Explicit Stats & Achievements Link */}
        <TouchableOpacity 
          className="bg-primary rounded-2xl p-4 mb-4 flex-row items-center justify-between shadow-sm active:scale-95 transition-transform"
          activeOpacity={0.9}
          onPress={() => router.push('/profile/stats')}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-4">
              <FontAwesome name="trophy" size={20} color="#fff" />
            </View>
            <View>
              <Text className="font-sans text-[16px] font-bold text-on-primary">Stats & Achievements</Text>
              <Text className="font-sans text-[12px] text-on-primary/80">View your rank and milestones</Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#fff" />
        </TouchableOpacity>

        {/* Stats Grid */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-surface-container-low rounded-xl p-4 flex-row items-center justify-between shadow-sm border border-outline-variant/10">
            <View className="flex-col">
              <Text className="font-sans text-[24px] font-bold text-on-surface">{totalSpecies}</Text>
              <Text className="font-sans text-[12px] font-semibold text-secondary">Species</Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
              <FontAwesome name="database" size={16} color="#006763" />
            </View>
          </View>
          
          <View className="flex-1 bg-surface-container-low rounded-xl p-4 flex-row items-center justify-between shadow-sm border border-outline-variant/10">
            <View className="flex-col">
              <Text className="font-sans text-[24px] font-bold text-on-surface">{totalObservations}</Text>
              <Text className="font-sans text-[12px] font-semibold text-secondary">Observations</Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
              <FontAwesome name="eye" size={16} color="#006763" />
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="mb-12">
          <Text className="font-sans text-[14px] font-bold text-on-surface-variant uppercase mb-4 px-2">Settings</Text>
          
          <View className="bg-surface-container rounded-[24px] overflow-hidden border border-outline-variant/10">
            <View className="flex-row items-center justify-between p-4 border-b border-surface-container-high">
              <View className="flex-row items-center">
                <FontAwesome name="bell" size={16} color="#006763" className="mr-4 w-6 text-center" />
                <Text className="font-sans text-[16px] font-bold text-on-surface">Local Reminders</Text>
              </View>
              <Switch 
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#767577', true: '#639b92' }}
              />
            </View>

            <TouchableOpacity 
              className="flex-row items-center justify-between p-4 border-b border-surface-container-high"
              onPress={() => router.push('/profile/recycle-bin')}
            >
              <View className="flex-row items-center">
                <FontAwesome name="trash" size={16} color="#006763" className="mr-4 w-6 text-center" />
                <Text className="font-sans text-[16px] font-bold text-on-surface">Recycle Bin</Text>
              </View>
              <FontAwesome name="chevron-right" size={12} color="#6d7a78" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center justify-between p-4"
              onPress={handleLogout}
            >
              <View className="flex-row items-center">
                <FontAwesome name="sign-out" size={16} color="#ba1a1a" className="mr-4 w-6 text-center" />
                <Text className="font-sans text-[16px] font-bold text-error">Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
