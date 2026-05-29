import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQuery } from '@realm/react';
import { Observation } from '../../database/schema';
import { useAuthStore } from '../../stores/useAuthStore';

// Helper to format "time ago"
function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  return Math.floor(seconds) + 's ago';
}

export default function StatsScreen() {
  const router = useRouter();
  const { userHashId } = useAuthStore();
  
  const userObservations = useQuery(Observation).filtered('userId == $0 AND deletedStatus == false', userHashId || '');
  const totalObservations = userObservations.length;
  
  const floraCount = userObservations.filter(obs => obs.observationTags?.includes('Flora')).length;
  const faunaCount = userObservations.filter(obs => obs.observationTags?.includes('Fauna')).length;
  const fungiCount = userObservations.filter(obs => obs.observationTags?.includes('Fungi')).length;
  
  const floraPct = totalObservations > 0 ? (floraCount / totalObservations) * 100 : 0;
  const faunaPct = totalObservations > 0 ? (faunaCount / totalObservations) * 100 : 0;
  const fungiPct = totalObservations > 0 ? (fungiCount / totalObservations) * 100 : 0;

  // Streak logic
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

  // 7 Days Visual Logic
  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Get past 7 days (including today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const hasObs = userObservations.some(obs => {
        const obsDate = new Date(obs.timestamp);
        obsDate.setHours(0,0,0,0);
        return obsDate.getTime() === d.getTime();
      });
      days.push({
        date: d,
        label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        isActive: hasObs,
        isToday: i === 0
      });
    }
    return days;
  }, [userObservations]);

  // Recent Activity Timeline
  const recentObservations = Array.from(userObservations)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 3);

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
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 pt-[100px] px-margin-mobile" contentContainerStyle={{ paddingBottom: 140 }}>
        
        {/* Header Info */}
        <View className="mb-6">
          <Text className="font-sans text-[26px] font-bold text-primary mb-2">Field Records</Text>
          <Text className="font-sans text-[16px] text-on-surface-variant">A quantitative overview of your documented biodiversity findings. These metrics represent verified observations synced to your archive.</Text>
        </View>

        {/* Collection Breakdown */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <FontAwesome name="pie-chart" size={18} color="#006763" />
              <Text className="font-sans text-[20px] font-semibold text-tertiary">Collection Breakdown</Text>
            </View>
            <Text className="font-sans text-[12px] font-semibold text-on-surface-variant uppercase tracking-widest">Global Stats</Text>
          </View>
          
          <View className="flex-col gap-4">
            {/* Flora Card */}
            <View className="bg-white border border-outline-variant/50 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <View className="flex-row justify-between items-start mb-4">
                <View className="w-12 h-12 bg-primary-container/10 rounded-lg items-center justify-center">
                  <FontAwesome name="leaf" size={24} color="#006763" />
                </View>
                <Text className="font-sans text-[14px] font-bold text-primary tracking-widest">FLORA</Text>
              </View>
              <View className="mb-4">
                <Text className="font-sans text-[32px] font-bold text-on-surface leading-tight">{floraCount}</Text>
                <Text className="font-sans text-[14px] text-on-surface-variant">Documented Species</Text>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-sans text-[12px] text-on-surface-variant font-medium">Growth</Text>
                <Text className="font-sans text-[12px] font-bold text-primary">{floraPct.toFixed(0)}%</Text>
              </View>
              <View className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <View className="h-full bg-primary-container rounded-full" style={{ width: `${Math.max(floraPct, 5)}%` }} />
              </View>
            </View>

            {/* Fauna Card */}
            <View className="bg-white border border-outline-variant/50 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <View className="flex-row justify-between items-start mb-4">
                <View className="w-12 h-12 bg-primary-container/10 rounded-lg items-center justify-center">
                  <FontAwesome name="paw" size={24} color="#006763" />
                </View>
                <Text className="font-sans text-[14px] font-bold text-primary tracking-widest">FAUNA</Text>
              </View>
              <View className="mb-4">
                <Text className="font-sans text-[32px] font-bold text-on-surface leading-tight">{faunaCount}</Text>
                <Text className="font-sans text-[14px] text-on-surface-variant">Documented Species</Text>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-sans text-[12px] text-on-surface-variant font-medium">Growth</Text>
                <Text className="font-sans text-[12px] font-bold text-primary">{faunaPct.toFixed(0)}%</Text>
              </View>
              <View className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <View className="h-full bg-primary-container rounded-full" style={{ width: `${Math.max(faunaPct, 5)}%` }} />
              </View>
            </View>

            {/* Fungi Card */}
            <View className="bg-white border border-outline-variant/50 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <View className="flex-row justify-between items-start mb-4">
                <View className="w-12 h-12 bg-primary-container/10 rounded-lg items-center justify-center">
                  <FontAwesome name="tree" size={24} color="#006763" />
                </View>
                <Text className="font-sans text-[14px] font-bold text-primary tracking-widest">FUNGI</Text>
              </View>
              <View className="mb-4">
                <Text className="font-sans text-[32px] font-bold text-on-surface leading-tight">{fungiCount}</Text>
                <Text className="font-sans text-[14px] text-on-surface-variant">Documented Species</Text>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-sans text-[12px] text-on-surface-variant font-medium">Growth</Text>
                <Text className="font-sans text-[12px] font-bold text-primary">{fungiPct.toFixed(0)}%</Text>
              </View>
              <View className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <View className="h-full bg-primary-container rounded-full" style={{ width: `${Math.max(fungiPct, 5)}%` }} />
              </View>
            </View>
          </View>
        </View>

        {/* Current Streak Section */}
        <View className="bg-white border border-outline-variant/50 rounded-xl p-4 shadow-sm mb-8">
          <View className="flex-col gap-2 mb-6">
            <View className="flex-row justify-between items-center">
              <Text className="font-sans text-[20px] font-semibold text-primary">Current Streak</Text>
              <View className="flex-row items-center gap-2 bg-primary-container/10 px-3 py-1.5 rounded-full">
                <FontAwesome name="fire" size={16} color="#006763" />
                <Text className="font-sans text-[16px] font-bold text-primary-container">{currentStreak} Days</Text>
              </View>
            </View>
            <Text className="font-sans text-[14px] text-on-surface-variant">Document species daily to maintain your field journal rhythm.</Text>
          </View>

          <View className="flex-row justify-between items-center bg-surface p-4 rounded-xl border border-outline-variant/30">
            {last7Days.map((day, i) => (
              <View key={i} className="flex-col items-center gap-2">
                <Text className={`font-sans text-[12px] ${day.isActive || day.isToday ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                  {day.label}
                </Text>
                <View className={`w-10 h-10 items-center justify-center rounded-full ${day.isActive ? 'bg-primary-container border-primary shadow-sm' : 'bg-surface-container-highest border border-outline-variant'}`}>
                  <FontAwesome name="leaf" size={16} color={day.isActive ? '#fff' : '#bec9c7'} />
                  {day.isToday && day.isActive && (
                    <View className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-container rounded-full border-2 border-white" />
                  )}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            className="mt-6 flex-row items-center justify-center gap-2 bg-primary py-3 rounded-full hover:opacity-90 active:scale-95 transition-all"
            onPress={() => router.push('/(tabs)')}
          >
            <FontAwesome name="plus-circle" size={18} color="#fff" />
            <Text className="font-sans text-[14px] font-semibold text-white">Log New Observation</Text>
          </TouchableOpacity>
        </View>

        {/* Journal Timeline (Recent Activity) */}
        <View className="mb-6">
          <Text className="font-sans text-[20px] font-semibold text-tertiary mb-4">Journal Timeline</Text>
          <View className="bg-white border border-outline-variant/50 rounded-xl overflow-hidden divide-y divide-outline-variant/30">
            
            {recentObservations.length > 0 ? recentObservations.map(obs => (
              <TouchableOpacity key={obs.observationId} className="p-4 flex-row items-center justify-between" onPress={() => router.push({ pathname: '/observation/details', params: { observationId: obs.observationId } })}>
                <View className="flex-row items-center gap-4 flex-1">
                  <View className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center">
                    <FontAwesome name="camera" size={16} color="#006763" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans text-[16px] text-on-surface font-medium" numberOfLines={1}>Spotted {obs.title || obs.animalNickname}</Text>
                    <Text className="font-sans text-[12px] text-on-surface-variant">{obs.locationText || 'Unknown Location'} • {timeAgo(obs.timestamp)}</Text>
                  </View>
                </View>
                <FontAwesome name="chevron-right" size={14} color="#6d7a78" />
              </TouchableOpacity>
            )) : (
              <View className="p-6 items-center">
                <Text className="font-sans text-on-surface-variant text-[14px]">No recent observations.</Text>
              </View>
            )}

          </View>
        </View>

      </ScrollView>
    </View>
  );
}
