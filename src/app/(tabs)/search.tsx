import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useQuery } from '@realm/react';
import { Observation, SpeciesRecord, User } from '../../database/schema';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuthStore } from '../../stores/useAuthStore';

const TAXONOMY_FILTERS = ['All Species', 'Lepidoptera', 'Aves', 'Fungi', 'Amphibia'];

export default function SpeciesExplorerScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('All Species');
  
  const { userHashId } = useAuthStore();
  
  const currentUser = useQuery(User).filtered('hashId == $0', userHashId)[0];
  const userObservations = useQuery(Observation).filtered('userId == $0 AND deletedStatus == false', userHashId || '');
  const userSpeciesIds = Array.from(new Set(userObservations.map(o => o.speciesId))).filter(Boolean);

  const allSpecies = useQuery(SpeciesRecord);
  const species = allSpecies.filter(s => userSpeciesIds.includes(s.speciesId));

  const safeQuery = query.trim();

  const filteredSpecies = safeQuery.length > 0
    ? species.filter(s => 
        s.commonName?.toLowerCase().includes(safeQuery.toLowerCase()) || 
        s.scientificName?.toLowerCase().includes(safeQuery.toLowerCase())
      )
    : species;

  const renderItem = ({ item }: { item: any }) => {
    // For now, mapping both species and observation as "Card"
    const title = item.commonName || item.title || item.animalNickname || 'Unknown';
    const subtitle = item.scientificName || item.locationText || 'Unknown Location';
    const category = item.categoryId || 'General';
    // Dummy image for species since we might not have local ones stored easily, fallback to observation media if it's an observation
    const imageUri = item.media && item.media.length > 0 ? item.media[0].localUri : 'https://images.unsplash.com/photo-1590209706318-7b98a58f4eb8';

    if (viewMode === 'list') {
      return (
        <TouchableOpacity 
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-[24px] p-4 mb-4 flex-row shadow-sm"
          onPress={() => router.push(`/species/${item.speciesId || item.observationId}`)}
        >
          <Image source={{ uri: imageUri }} className="w-20 h-20 rounded-xl bg-surface-variant object-cover mr-4" />
          <View className="flex-1 justify-center">
            <Text className="text-[12px] font-semibold text-secondary uppercase tracking-wider font-sans mb-1">{subtitle}</Text>
            <Text className="text-[18px] font-bold text-on-surface font-sans">{title}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        className="flex-1 bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/10 m-2 overflow-hidden"
        onPress={() => router.push(`/species/${item.speciesId || item.observationId}`)}
      >
        <View className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-surface-container relative">
          <Image source={{ uri: imageUri }} className="w-full h-full object-cover" />
          <View className="absolute inset-0 bg-white/10" />
          <View className="absolute top-2 right-2 bg-surface/90 rounded-full px-2 py-1 flex-row items-center shadow-sm">
            <FontAwesome name="eye" size={10} color="#006763" />
            <Text className="font-sans text-[10px] font-semibold text-on-surface ml-1">12</Text>
          </View>
        </View>
        <View className="flex-col">
          <Text className="font-sans text-[10px] font-semibold text-secondary uppercase tracking-wider mb-1" numberOfLines={1}>{subtitle}</Text>
          <Text className="font-sans text-[16px] font-bold text-on-surface mb-2" numberOfLines={1}>{title}</Text>
          <View className="flex-row gap-2 flex-wrap">
            <View className="bg-surface-container-high px-2 py-1 rounded-full">
              <Text className="font-sans text-[10px] text-on-surface-variant">{category}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View className="pt-24 px-margin-mobile">
      <View className="mb-6">
        <Text className="font-sans text-[32px] font-bold text-on-surface mb-2">The Pokedex Archive</Text>
        <Text className="font-sans text-[16px] text-secondary">Discover and document preserved digital specimens.</Text>
      </View>

      <View className="flex-col mb-4">
        <Text className="font-sans text-[12px] font-semibold text-on-surface-variant mb-2">Search Archive</Text>
        <View className="flex-row items-center">
          <View className="flex-1 relative justify-center">
            <View className="absolute left-4 z-10">
              <FontAwesome name="search" size={18} color="#6d7a78" />
            </View>
            <TextInput
              className="w-full bg-surface-container-lowest border-[1.5px] border-outline-variant rounded-lg py-3 pl-12 pr-4 font-sans text-[14px] text-on-surface"
              placeholder="Enter species or common name..."
              placeholderTextColor="#6d7a78"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              selectionColor="#00A19B"
            />
          </View>
          <View className="flex-row bg-surface-container rounded-lg border border-outline-variant/30 ml-4 p-1">
            <TouchableOpacity 
              className={`p-2 rounded-md items-center justify-center ${viewMode === 'grid' ? 'bg-surface-container-lowest shadow-sm' : ''}`}
              onPress={() => setViewMode('grid')}
            >
              <FontAwesome name="th-large" size={16} color={viewMode === 'grid' ? '#006763' : '#625e56'} />
            </TouchableOpacity>
            <TouchableOpacity 
              className={`p-2 rounded-md items-center justify-center ${viewMode === 'list' ? 'bg-surface-container-lowest shadow-sm' : ''}`}
              onPress={() => setViewMode('list')}
            >
              <FontAwesome name="list" size={16} color={viewMode === 'list' ? '#006763' : '#625e56'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="mb-6 -mx-margin-mobile px-margin-mobile">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
          {TAXONOMY_FILTERS.map((filter) => (
            <TouchableOpacity 
              key={filter}
              className={`mr-3 px-4 py-2 rounded-full border ${activeFilter === filter ? 'bg-primary border-primary' : 'bg-inverse-primary/20 border-primary/10'}`}
              onPress={() => setActiveFilter(filter)}
            >
              <Text className={`font-sans text-[12px] font-semibold ${activeFilter === filter ? 'text-on-primary' : 'text-primary-fixed-variant'}`}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant flex-row items-center">
            <FontAwesome name="sliders" size={14} color="#3d4948" className="mr-2" />
            <Text className="font-sans text-[12px] font-semibold text-on-surface-variant ml-1">Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );

  const profilePicSource = currentUser?.profilePicUri 
    ? { uri: currentUser.profilePicUri } 
    : { uri: 'https://i.pravatar.cc/150?img=33' };

  return (
    <View className="flex-1 bg-background relative">
      {/* Top Header */}
      <View className="absolute top-0 w-full z-50 bg-surface/90 border-b border-outline-variant/20 shadow-sm pt-safe-margin px-margin-mobile pb-2 flex-row justify-between items-center h-[90px]">
        <View className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 mt-4">
          <Image source={profilePicSource} className="w-full h-full object-cover" />
        </View>
        <Text className="font-sans text-[40px] font-bold text-primary tracking-tight mt-2">EnvDex</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center mt-4">
          <FontAwesome name="search" size={24} color="#006763" />
        </TouchableOpacity>
      </View>

      <FlatList
        key={viewMode} // force re-render when switching modes
        data={filteredSpecies as any}
        keyExtractor={(item: any) => item.speciesId || item.observationId || Math.random().toString()}
        renderItem={renderItem}
        numColumns={viewMode === 'grid' ? 2 : 1}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: viewMode === 'grid' ? 12 : 20, paddingBottom: 100 }}
      />
    </View>
  );
}
