import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery } from '@realm/react';
import { Observation, User } from '../../database/schema';
import { useAuthStore } from '../../stores/useAuthStore';

export default function StatsScreen() {
  const router = useRouter();
  const { userHashId } = useAuthStore();
  
  const currentUser = useQuery(User).filtered('hashId == $0', userHashId)[0];
  const userObservations = useQuery(Observation).filtered('userId == $0 AND deletedStatus == false', currentUser?.userId || '');

  const totalObservations = userObservations.length;
  
  const calculateStreak = () => {
    if (!totalObservations) return 0;
    
    const uniqueDates = Array.from(new Set(userObservations.map(o => o.timestamp.toDateString())))
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

  const currentStreak = calculateStreak();

  return (
    <View className="flex-1 bg-surface relative">
      {/* Top Header */}
      <View className="absolute top-0 w-full z-50 bg-surface/90 border-b border-outline-variant/20 shadow-sm pt-safe-margin px-margin-mobile pb-2 flex-row justify-between items-center h-[90px]">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-surface-container-highest/50 items-center justify-center mt-4"
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={16} color="#181c1b" />
        </TouchableOpacity>
        <Text className="font-sans text-[24px] font-bold text-primary tracking-tight mt-4">Archive Stats</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center mt-4 rounded-full hover:bg-surface-container-high">
          <FontAwesome name="search" size={20} color="#006763" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 pt-[100px] px-margin-mobile" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Biodiversity Impact */}
        <View className="mb-6">
          <Text className="font-sans text-[20px] font-semibold text-on-surface mb-3">Biodiversity Impact</Text>
          <View className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/10 relative overflow-hidden">
            <View className="absolute inset-0 bg-white/40 pointer-events-none" />
            <View className="flex-col md:flex-row items-center gap-6">
              
              <View className="relative w-32 h-32 self-center">
                <View className="absolute inset-0 rounded-full border-[8px] border-surface-container-high" />
                <View className="absolute inset-0 rounded-full border-[8px] border-primary" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '45deg' }] }} />
                <View className="absolute inset-0 items-center justify-center">
                  <Text className="font-sans text-[32px] font-bold text-primary">75%</Text>
                  <Text className="font-sans text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Seasonal Goal</Text>
                </View>
              </View>

              <View className="flex-1 mt-4">
                <Text className="font-sans text-[14px] text-on-surface-variant mb-4">You've consistently increased your local species documentation this season. Keep up the excellent work in the field.</Text>
                <View className="flex-row gap-4">
                  <View className="flex-1 bg-surface-container-low rounded-xl p-3">
                    <Text className="font-sans text-[10px] font-semibold text-secondary uppercase tracking-wider">Total Cataloged</Text>
                    <Text className="font-sans text-[24px] font-bold text-on-surface">{totalObservations}</Text>
                  </View>
                  <View className="flex-1 bg-surface-container-low rounded-xl p-3">
                    <Text className="font-sans text-[10px] font-semibold text-secondary uppercase tracking-wider">Rare Sightings</Text>
                    <Text className="font-sans text-[24px] font-bold text-on-surface">0</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>
        </View>

        {/* Collection Breakdown */}
        <View className="mb-6">
          <Text className="font-sans text-[20px] font-semibold text-on-surface mb-3">Collection Breakdown</Text>
          <View className="flex-row justify-between gap-3">
            <View className="flex-1 bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/10">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-[#e8f5e9] items-center justify-center mr-2">
                  <FontAwesome name="tree" size={14} color="#2e7d32" />
                </View>
                <Text className="font-sans text-[16px] font-semibold text-on-surface">Flora</Text>
              </View>
              <Text className="font-sans text-[28px] font-bold text-primary">--</Text>
              <Text className="font-sans text-[10px] font-semibold text-secondary uppercase tracking-wider">Entries</Text>
            </View>
            <View className="flex-1 bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/10">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-[#e3f2fd] items-center justify-center mr-2">
                  <FontAwesome name="paw" size={14} color="#1565c0" />
                </View>
                <Text className="font-sans text-[16px] font-semibold text-on-surface">Fauna</Text>
              </View>
              <Text className="font-sans text-[28px] font-bold text-primary">--</Text>
              <Text className="font-sans text-[10px] font-semibold text-secondary uppercase tracking-wider">Entries</Text>
            </View>
            <View className="flex-1 bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/10">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-[#fff3e0] items-center justify-center mr-2">
                  <FontAwesome name="leaf" size={14} color="#e65100" />
                </View>
                <Text className="font-sans text-[16px] font-semibold text-on-surface">Fungi</Text>
              </View>
              <Text className="font-sans text-[28px] font-bold text-primary">--</Text>
              <Text className="font-sans text-[10px] font-semibold text-secondary uppercase tracking-wider">Entries</Text>
            </View>
          </View>
        </View>

        {/* Naturalist Milestones */}
        <View className="mb-6">
          <Text className="font-sans text-[20px] font-semibold text-on-surface mb-3">Naturalist Milestones</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className={`w-[48%] bg-surface-container-lowest rounded-2xl p-4 mb-3 items-center shadow-sm relative ${totalObservations >= 100 ? 'border border-primary-container/20' : 'opacity-60'}`}>
              {totalObservations >= 100 && (
                <View className="absolute -top-2 -right-2 w-6 h-6 bg-primary-container rounded-full items-center justify-center border-2 border-surface-container-lowest">
                  <FontAwesome name="star" size={10} color="#fff" />
                </View>
              )}
              <View className="w-12 h-12 rounded-full bg-surface-container-low items-center justify-center mb-2">
                <FontAwesome name="trophy" size={20} color="#006763" />
              </View>
              <Text className="font-sans text-[12px] font-semibold text-on-surface mb-1">First 100</Text>
              <Text className="font-sans text-[10px] text-on-surface-variant text-center">Observations</Text>
            </View>
            
            <View className="w-[48%] bg-surface-container-lowest rounded-2xl p-4 mb-3 items-center shadow-sm opacity-60">
              <View className="w-12 h-12 rounded-full bg-surface-container-low items-center justify-center mb-2">
                <FontAwesome name="eye" size={20} color="#006763" />
              </View>
              <Text className="font-sans text-[12px] font-semibold text-on-surface mb-1">Rare Spotter</Text>
              <Text className="font-sans text-[10px] text-on-surface-variant text-center">Endangered Species</Text>
            </View>

            <View className="w-[48%] bg-surface-container-lowest rounded-2xl p-4 mb-3 items-center shadow-sm opacity-60">
              <View className="w-12 h-12 rounded-full bg-surface-container-low items-center justify-center mb-2">
                <FontAwesome name="bookmark" size={20} color="#625e56" />
              </View>
              <Text className="font-sans text-[12px] font-semibold text-on-surface mb-1">Taxonomy Master</Text>
              <Text className="font-sans text-[10px] text-on-surface-variant text-center">Identify 50 Families</Text>
            </View>

            <View className="w-[48%] bg-surface-container-lowest rounded-2xl p-4 mb-3 items-center shadow-sm opacity-60">
              <View className="w-12 h-12 rounded-full bg-surface-container-low items-center justify-center mb-2">
                <FontAwesome name="map" size={20} color="#625e56" />
              </View>
              <Text className="font-sans text-[12px] font-semibold text-on-surface mb-1">Explorer</Text>
              <Text className="font-sans text-[10px] text-on-surface-variant text-center">Visit 10 Biomes</Text>
            </View>
          </View>
        </View>

        {/* Field Hours & Streak */}
        <View className="flex-row gap-4">
          <View className="flex-1 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
            <Text className="font-sans text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Current Streak</Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="font-sans text-[32px] font-bold text-on-surface">{currentStreak}</Text>
              <Text className="font-sans text-[14px] text-on-surface-variant">days</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
