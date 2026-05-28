import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useRealm } from '@realm/react';
import { Observation, User } from '../../database/schema';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuthStore } from '../../stores/useAuthStore';

export default function HomeScreen() {
  const router = useRouter();
  const realm = useRealm();
  const { userHashId } = useAuthStore();
  
  // Sandbox query to current user
  const currentUser = useQuery(User).filtered('hashId == $0', userHashId)[0];
  const observations = useQuery(Observation)
    .filtered('userId == $0 AND deletedStatus == false', userHashId || '')
    .sorted('timestamp', true);

  const handleDelete = (item: Observation) => {
    Alert.alert(
      'Delete Observation',
      'Are you sure you want to delete this observation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            realm.write(() => {
              realm.delete(item);
            });
          }
        }
      ]
    );
  };

  const renderObservation = ({ item }: { item: Observation }) => {
    const firstMedia = item.media.length > 0 ? item.media[0].localUri : null;
    const displayTitle = item.title || item.animalNickname || 'Unknown Sighting';
    const displaySubtitle = item.scientificName || 'Unknown Species';

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-sm pb-lg shadow-sm flex flex-col mb-4 overflow-hidden"
        onPress={() => router.push(`/species/${item.speciesId}`)}
      >
        <View className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-surface-variant">
          {firstMedia ? (
            <Image source={{ uri: firstMedia }} className="w-full h-full object-cover" />
          ) : (
            <View className="w-full h-full items-center justify-center bg-surface-variant">
              <FontAwesome name="leaf" size={48} color="#6d7a78" />
            </View>
          )}
          
          <View className="absolute inset-0 bg-white/10" />
          
          <View className="absolute top-sm left-sm bg-surface/90 rounded-full px-sm py-1 border border-outline-variant/20 flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-primary mr-1" />
            <Text className="font-sans text-[12px] font-semibold text-on-surface uppercase">{item.observationTags?.[0] || 'General'}</Text>
          </View>
        </View>

        <View className="px-xs pt-4 flex-col gap-base">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-4">
              <Text className="font-sans text-[20px] font-semibold text-on-surface">{displayTitle}</Text>
              <Text className="font-sans text-[14px] text-secondary italic">{displaySubtitle}</Text>
            </View>
            <TouchableOpacity 
              className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center"
              onPress={() => handleDelete(item)}
            >
              <FontAwesome name="trash" size={16} color="#ba1a1a" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mt-sm border-t border-outline-variant/20 pt-sm">
            <View className="flex-row items-center mr-4">
              <FontAwesome name="clock-o" size={14} color="#625e56" className="mr-1" />
              <Text className="font-sans text-[12px] font-semibold text-secondary ml-1">
                {item.timestamp.toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center flex-1">
              <FontAwesome name="map-marker" size={14} color="#625e56" className="mr-1" />
              <Text className="font-sans text-[12px] font-semibold text-secondary ml-1" numberOfLines={1}>
                {item.locationText || 'Unknown Location'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const calculateStreak = () => {
    if (!observations.length) return 0;
    
    const uniqueDates = Array.from(new Set(observations.map(o => o.timestamp.toDateString())))
      .map(d => new Date(d));
    uniqueDates.sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    
    if (uniqueDates.length > 0) {
      const latestDate = uniqueDates[0];
      latestDate.setHours(0,0,0,0);
      const diffTime = Math.abs(currentDate.getTime() - latestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 1) return 0;

      streak = 1;
      let checkDate = latestDate;
      for (let i = 1; i < uniqueDates.length; i++) {
        const nextDate = uniqueDates[i];
        nextDate.setHours(0,0,0,0);
        const dayDiff = Math.abs(checkDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          streak++;
          checkDate = nextDate;
        } else {
          break;
        }
      }
    }
    return streak;
  };

  const streakCount = calculateStreak();

  const renderHeader = () => (
    <View className="pt-24 px-margin-mobile">
      {/* Header & Streak Section */}
      <View className="flex-col mt-md mb-6">
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="font-sans text-[28px] font-bold text-on-surface">Living Dashboard</Text>
            <Text className="font-sans text-[14px] text-secondary mt-1">Your ecological impact this week.</Text>
          </View>
          <View className="flex-row items-center bg-secondary-container/50 border border-outline-variant/30 rounded-full px-sm py-1 shadow-sm">
            <FontAwesome name={streakCount > 0 ? "fire" : "circle-o"} size={16} color={streakCount > 0 ? "#e65100" : "#625e56"} />
            <Text className="font-sans text-[12px] font-semibold text-on-surface ml-1">{streakCount} DAYS</Text>
          </View>
        </View>
      </View>

      {/* Primary Stat Card Full Width */}
      <View className="bg-surface-container-low border border-outline-variant/20 rounded-[24px] p-lg shadow-sm mb-8 flex-row items-center justify-between">
        <View>
          <Text className="font-sans text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Total Cataloged</Text>
          <Text className="font-sans text-[48px] font-bold text-on-surface tracking-tight">{observations.length}</Text>
        </View>
        <View className="w-16 h-16 rounded-full bg-primary-container items-center justify-center">
          <FontAwesome name="database" size={24} color="#f3fffd" />
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-sans text-[20px] font-semibold text-on-surface">Recent Observations</Text>
      </View>
    </View>
  );

  const profilePicSource = currentUser?.profilePicUri 
    ? { uri: currentUser.profilePicUri } 
    : { uri: 'https://i.pravatar.cc/150?img=33' };

  return (
    <View className="flex-1 bg-surface relative">
      {/* Top Header */}
      <View className="absolute top-0 w-full z-50 bg-surface/90 border-b border-outline-variant/20 shadow-sm pt-safe-margin px-margin-mobile pb-2 flex-row justify-between items-center h-[90px]">
        <View className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 mt-4">
          <Image source={profilePicSource} className="w-full h-full object-cover" />
        </View>
        <Text className="font-sans text-[40px] font-bold text-primary tracking-tight mt-2">EnvDex</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center mt-4" onPress={() => router.push('/(tabs)/search')}>
          <FontAwesome name="search" size={24} color="#006763" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={observations as unknown as Observation[]}
        keyExtractor={(item) => item.observationId}
        renderItem={renderObservation}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-margin-mobile">
            <Text className="font-sans text-[16px] text-on-surface-variant mb-4">No observations yet.</Text>
            <TouchableOpacity 
              className="bg-primary py-3 px-6 rounded-full shadow-sm"
              onPress={() => router.push('/observation/camera')}
            >
              <Text className="font-sans font-bold text-on-primary">Capture Sighting</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />
    </View>
  );
}
