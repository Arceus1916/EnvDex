import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRealm, useQuery } from '@realm/react';
import { Observation, SpeciesRecord } from '../../database/schema';
import { useAuthStore } from '../../stores/useAuthStore';

export default function RecycleBinScreen() {
  const router = useRouter();
  const realm = useRealm();
  const userId = useAuthStore((state) => state.userHashId);
  
  const deletedObservations = useQuery(Observation)
    .filtered('deletedStatus == true AND userId == $0', userId || '')
    .sorted('recycleBinTimestamp', true);

  const handleRestore = (obs: Observation) => {
    realm.write(() => {
      obs.deletedStatus = false;
      obs.recycleBinTimestamp = undefined;
    });
    Alert.alert('Restored', 'Observation returned to your archive.');
  };

  const handlePermanentDelete = (obs: Observation) => {
    Alert.alert(
      'Permanent Delete',
      'This action cannot be undone. Delete forever?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            realm.write(() => {
              const speciesId = obs.speciesId;
              realm.delete(obs);
              
              if (speciesId) {
                const remaining = realm.objects(Observation).filtered('speciesId == $0', speciesId);
                if (remaining.length === 0) {
                  const species = realm.objects(SpeciesRecord).filtered('speciesId == $0', speciesId)[0];
                  if (species) {
                    realm.delete(species);
                  }
                }
              }
            });
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Observation }) => (
    <View className="flex-row items-center bg-surface-container p-4 rounded-xl mb-3">
      <View className="flex-1">
        <Text className="text-on-surface font-sans font-bold text-lg" numberOfLines={1}>
          {item.title || item.locationText || 'Unknown Observation'}
        </Text>
        <Text className="text-on-surface-variant text-sm mt-1" numberOfLines={1}>
          Deleted: {item.recycleBinTimestamp?.toLocaleDateString()}
        </Text>
      </View>
      
      <View className="flex-row">
        <TouchableOpacity 
          className="bg-primary-container px-4 py-2 rounded-lg mr-2"
          onPress={() => handleRestore(item)}
        >
          <Text className="text-on-primary-container font-bold">Restore</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-error/20 px-4 py-2 rounded-lg"
          onPress={() => handlePermanentDelete(item)}
        >
          <Text className="text-error font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <View className="pt-12 pb-4 px-safe-margin bg-surface-container-high">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-primary font-bold text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-sans font-bold text-primary">Recycle Bin</Text>
        <Text className="text-on-surface-variant mt-2">
          Items here are kept for 30 days before permanent deletion.
        </Text>
      </View>

      <FlatList
        className="flex-1 px-safe-margin pt-6"
        data={deletedObservations as unknown as Observation[]}
        keyExtractor={(item) => item.observationId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center mt-12">
            <Text className="text-6xl mb-4">♻️</Text>
            <Text className="text-on-surface-variant text-center">
              Recycle bin is empty.
            </Text>
          </View>
        }
      />
    </View>
  );
}
