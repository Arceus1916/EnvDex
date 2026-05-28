import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@realm/react';
import { Observation, SpeciesRecord } from '../../database/schema';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  
  const species = useQuery(SpeciesRecord);
  const observations = useQuery(Observation);

  const filteredSpecies = query.length > 0
    ? species.filtered('commonName CONTAINS[c] $0 OR scientificName CONTAINS[c] $0', query)
    : [];
    
  const filteredObservations = query.length > 0
    ? observations.filtered('notes CONTAINS[c] $0 OR locationText CONTAINS[c] $0 OR title CONTAINS[c] $0', query)
    : [];

  const SearchResultItem = ({ item, type }: { item: any; type: 'species' | 'observation' }) => (
    <TouchableOpacity 
      className="bg-surface-container p-4 rounded-xl mb-3 flex-row items-center"
      onPress={() => {
        if (type === 'species') {
          router.push(`/species/${item.speciesId}`);
        } else {
          // If it's an observation, we could route to an observation detail view.
          // For now, if we have speciesId, go to that species.
          if (item.speciesId) router.push(`/species/${item.speciesId}`);
        }
      }}
    >
      <View className="w-12 h-12 bg-surface-variant rounded-lg items-center justify-center mr-4">
        <Text className="text-2xl">{type === 'species' ? '🌱' : '📍'}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-on-surface font-sans font-bold text-lg" numberOfLines={1}>
          {type === 'species' ? item.commonName : (item.locationText || 'Observation')}
        </Text>
        <Text className="text-on-surface-variant text-sm" numberOfLines={1}>
          {type === 'species' ? item.scientificName : item.notes}
        </Text>
      </View>
      <View className="bg-primary-container px-2 py-1 rounded-md">
        <Text className="text-on-primary-container text-xs capitalize">{type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background pt-12 px-safe-margin">
      <Text className="text-3xl font-sans font-bold text-primary mb-4">Search</Text>

      <View className="bg-surface-container flex-row items-center p-4 rounded-full mb-6">
        <Text className="text-xl mr-2">🔍</Text>
        <TextInput
          className="flex-1 text-on-surface text-base"
          placeholder="Search species, notes, or locations..."
          placeholderTextColor="#6d7a78"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text className="text-on-surface-variant text-lg font-bold">X</Text>
          </TouchableOpacity>
        )}
      </View>

      {query.length > 0 ? (
        <FlatList
          data={[
            ...filteredSpecies.map(s => ({ ...s, _type: 'species' })),
            ...filteredObservations.map(o => ({ ...o, _type: 'observation' }))
          ]}
          keyExtractor={(item: any) => item.speciesId || item.observationId}
          renderItem={({ item }: any) => <SearchResultItem item={item} type={item._type} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-on-surface-variant text-center mt-8">
              No results found for "{query}".
            </Text>
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-6xl mb-4">🔎</Text>
          <Text className="text-on-surface-variant text-center px-8">
            Search your entire local archive by species name, taxonomy, field notes, or GPS location.
          </Text>
        </View>
      )}
    </View>
  );
}
