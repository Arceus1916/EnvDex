import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@realm/react';
import { Observation } from '../../database/schema';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const observations = useQuery(Observation).sorted('timestamp', true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const renderItem = ({ item }: { item: Observation }) => {
    const isGrid = viewMode === 'grid';
    const firstMedia = item.media.length > 0 ? item.media[0].localUri : null;

    return (
      <TouchableOpacity 
        className={`mb-4 bg-surface-container rounded-2xl overflow-hidden ${isGrid ? 'flex-1 m-2' : 'flex-row'}`}
        onPress={() => router.push(`/species/${item.speciesId}`)}
      >
        {firstMedia ? (
          <Image 
            source={{ uri: firstMedia }} 
            className={isGrid ? 'w-full h-32' : 'w-24 h-24 m-2 rounded-xl'} 
          />
        ) : (
          <View className={`bg-surface-variant items-center justify-center ${isGrid ? 'w-full h-32' : 'w-24 h-24 m-2 rounded-xl'}`}>
            <Text className="text-3xl">🌿</Text>
          </View>
        )}
        
        <View className={`p-4 ${isGrid ? '' : 'flex-1 justify-center'}`}>
          <Text className="text-lg font-sans font-bold text-on-surface" numberOfLines={1}>
            {item.title || 'Unknown Sighting'}
          </Text>
          <Text className="text-sm text-on-surface-variant mt-1" numberOfLines={1}>
            {item.locationText || 'Unknown Location'}
          </Text>
          <Text className="text-xs text-primary mt-2">
            {item.timestamp.toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background pt-12 px-safe-margin">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-sans font-bold text-primary">Recent</Text>
        <TouchableOpacity 
          className="bg-surface-container p-2 rounded-full"
          onPress={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
        >
          <Text className="text-xl">{viewMode === 'list' ? '🔲' : '📋'}</Text>
        </TouchableOpacity>
      </View>

      {observations.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-on-surface-variant text-center mb-4">No observations yet.</Text>
          <TouchableOpacity 
            className="bg-primary py-3 px-6 rounded-full"
            onPress={() => router.push('/(tabs)/create')}
          >
            <Text className="text-on-primary font-bold">Capture Sighting</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          key={viewMode} // force re-render when switching modes
          data={observations as unknown as Observation[]}
          keyExtractor={(item) => item.observationId}
          renderItem={renderItem}
          numColumns={viewMode === 'grid' ? 2 : 1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}
