import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@realm/react';
import { SpeciesRecord } from '../../database/schema';
import { useRouter } from 'expo-router';

export default function SpeciesExplorerScreen() {
  const router = useRouter();
  const species = useQuery(SpeciesRecord).sorted('updatedAt', true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredSpecies = filter === 'favorites' 
    ? species.filtered('isFavorite == true') 
    : species;

  const renderItem = ({ item }: { item: SpeciesRecord }) => (
    <TouchableOpacity 
      className="flex-row items-center bg-surface-container p-4 rounded-2xl mb-4"
      onPress={() => router.push(`/species/${item.speciesId}`)}
    >
      <View className="w-16 h-16 bg-surface-variant rounded-xl items-center justify-center overflow-hidden mr-4">
        {item.coverMediaUri ? (
          <Image source={{ uri: item.coverMediaUri }} className="w-full h-full" />
        ) : (
          <Text className="text-2xl">🌱</Text>
        )}
      </View>
      
      <View className="flex-1">
        <Text className="text-xl font-sans font-bold text-on-surface">
          {item.commonName}
        </Text>
        {item.scientificName && (
          <Text className="text-sm italic text-on-surface-variant mt-1">
            {item.scientificName}
          </Text>
        )}
        <View className="flex-row items-center mt-2">
          <Text className="text-xs bg-primary-container text-on-primary-container px-2 py-1 rounded-md overflow-hidden">
            {item.totalObservations} Observations
          </Text>
        </View>
      </View>

      {item.isFavorite && (
        <Text className="text-2xl text-primary ml-2">⭐</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background pt-12 px-safe-margin">
      <Text className="text-3xl font-sans font-bold text-primary mb-6">Archive</Text>

      <View className="flex-row mb-6 bg-surface-container rounded-full p-1">
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-full items-center ${filter === 'all' ? 'bg-primary' : ''}`}
          onPress={() => setFilter('all')}
        >
          <Text className={`font-bold ${filter === 'all' ? 'text-on-primary' : 'text-on-surface'}`}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-full items-center ${filter === 'favorites' ? 'bg-primary' : ''}`}
          onPress={() => setFilter('favorites')}
        >
          <Text className={`font-bold ${filter === 'favorites' ? 'text-on-primary' : 'text-on-surface'}`}>Favorites</Text>
        </TouchableOpacity>
      </View>

      {filteredSpecies.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-on-surface-variant text-center mb-4">No species found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSpecies as unknown as SpeciesRecord[]}
          keyExtractor={(item) => item.speciesId}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}
