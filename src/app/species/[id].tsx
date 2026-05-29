import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRealm, useObject, useQuery } from '@realm/react';
import { SpeciesRecord, Observation } from '../../database/schema';
import { useAuthStore } from '../../stores/useAuthStore';

export default function SpeciesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const realm = useRealm();
  
  const species = useObject(SpeciesRecord, id || '');
  const userHashId = useAuthStore(state => state.userHashId);
  
  const observations = useQuery(Observation)
    .filtered('speciesId == $0 AND userId == $1 AND deletedStatus == false', id, userHashId || '')
    .sorted('timestamp', true);

  if (!species) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-safe-margin">
        <Text className="text-on-surface">Species not found.</Text>
        <TouchableOpacity className="mt-4 p-4" onPress={() => router.back()}>
          <Text className="text-primary font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFavorite = () => {
    realm.write(() => {
      species.isFavorite = !species.isFavorite;
    });
  };

  const renderObservation = ({ item }: { item: Observation }) => {
    const firstMedia = item.media && item.media.length > 0 ? item.media[0].localUri : null;
    return (
      <TouchableOpacity 
        className="flex-row items-center bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/10 mb-4"
        onPress={() => router.push({ pathname: '/observation/details', params: { observationId: item.observationId } })}
      >
        {firstMedia ? (
          <Image source={{ uri: firstMedia }} className="w-16 h-16 rounded-lg mr-4 bg-surface-variant" />
        ) : (
          <View className="w-16 h-16 rounded-lg mr-4 bg-surface-variant items-center justify-center">
            <Text className="text-xl">📸</Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="text-on-surface font-sans font-bold" numberOfLines={1}>
            {item.locationText || 'Unknown Location'}
          </Text>
          <Text className="text-on-surface-variant text-sm mt-1" numberOfLines={2}>
            {item.notes || 'No notes.'}
          </Text>
          <Text className="text-primary text-xs mt-2">
            {item.timestamp.toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-12 pb-6 px-safe-margin bg-surface-container-high rounded-b-3xl">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-primary font-bold text-lg">← Back</Text>
        </TouchableOpacity>
        
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-4xl font-sans font-bold text-primary mb-1">
              {species.scientificName || species.commonName}
            </Text>
            {species.scientificName ? (
              <Text className="text-lg italic text-on-surface-variant">
                {species.commonName}
              </Text>
            ) : null}
            <Text className="text-sm font-bold text-on-surface mt-4 bg-primary-container self-start px-3 py-1 rounded-full overflow-hidden">
              {species.totalObservations} Observations
            </Text>
          </View>
          
          <TouchableOpacity 
            className="w-12 h-12 bg-surface-container rounded-full items-center justify-center"
            onPress={toggleFavorite}
          >
            <Text className="text-2xl">{species.isFavorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        className="flex-1 px-safe-margin pt-6"
        data={observations as any}
        keyExtractor={(item) => item.observationId}
        renderItem={renderObservation}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
