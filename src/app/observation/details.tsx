import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRealm, useObject } from '@realm/react';
import * as Location from 'expo-location';
import { ObservationService } from '../../services/ObservationService';
import { DraftObservation } from '../../database/schema';
import { useAuthStore } from '../../stores/useAuthStore';

export default function ObservationDetailsScreen() {
  const router = useRouter();
  const realm = useRealm();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const userId = useAuthStore((state) => state.userHashId);
  
  const draft = useObject(DraftObservation, draftId || '');

  const [speciesName, setSpeciesName] = useState('');
  const [notes, setNotes] = useState('');
  const [locationText, setLocationText] = useState('Fetching location...');
  const [coords, setCoords] = useState<{lat: number; lon: number} | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Location permission denied.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setCoords({ lat: location.coords.latitude, lon: location.coords.longitude });
        
        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          setLocationText(`${geocode[0].city || geocode[0].region}, ${geocode[0].country}`);
        } else {
          setLocationText(`${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`);
        }
      } catch (err) {
        setLocationText('Location unavailable.');
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!userId || !draftId) return;

    try {
      await ObservationService.saveObservation(realm, draftId, userId, {
        speciesName: speciesName.trim() || 'Unknown Species',
        notes,
        locationText,
        latitude: coords?.lat,
        longitude: coords?.lon,
      });

      Alert.alert('Saved!', 'Observation added to your archive.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (err: any) {
      Alert.alert('Save Error', err.message);
    }
  };

  const handleDiscard = () => {
    if (draft) {
      realm.write(() => {
        realm.delete(draft);
      });
    }
    router.replace('/(tabs)');
  };

  if (!draft) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-safe-margin">
        <Text className="text-on-surface">Draft not found.</Text>
        <TouchableOpacity className="mt-4 p-4" onPress={() => router.replace('/(tabs)')}>
          <Text className="text-primary font-bold">Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-12">
      <View className="flex-row justify-between items-center px-safe-margin mb-4">
        <Text className="text-2xl font-sans font-bold text-primary">New Observation</Text>
        <TouchableOpacity onPress={handleDiscard}>
          <Text className="text-error font-bold text-base">Discard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-safe-margin" keyboardShouldPersistTaps="handled">
        {/* Media Preview Strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {draft.tempMediaUris && draft.tempMediaUris.map((uri, idx) => (
            <Image 
              key={idx} 
              source={{ uri }} 
              className="w-24 h-24 rounded-xl mr-3 bg-surface-container" 
            />
          ))}
        </ScrollView>

        <View className="mb-4">
          <Text className="text-on-surface-variant font-bold mb-2">Species Name</Text>
          <TextInput
            className="bg-surface-container p-4 rounded-xl text-on-surface text-lg font-sans"
            placeholder="e.g. Red Fox (Leave blank if unknown)"
            placeholderTextColor="#6d7a78"
            value={speciesName}
            onChangeText={setSpeciesName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-on-surface-variant font-bold mb-2">Location</Text>
          <View className="bg-surface-container p-4 rounded-xl flex-row items-center">
            <Text className="text-xl mr-2">📍</Text>
            <TextInput
              className="flex-1 text-on-surface text-base"
              value={locationText}
              onChangeText={setLocationText}
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-on-surface-variant font-bold mb-2">Field Notes</Text>
          <TextInput
            className="bg-surface-container p-4 rounded-xl text-on-surface text-base h-32"
            placeholder="Behavior, habitat, weather..."
            placeholderTextColor="#6d7a78"
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      <View className="p-safe-margin pb-8 bg-background border-t border-surface-container-high">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-full w-full items-center"
          onPress={handleSave}
        >
          <Text className="text-on-primary font-sans font-bold text-lg">Save Observation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
