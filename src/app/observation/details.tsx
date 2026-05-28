import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRealm, useObject } from '@realm/react';
import * as Location from 'expo-location';
import { ObservationService } from '../../services/ObservationService';
import { DraftObservation } from '../../database/schema';
import { useAuthStore } from '../../stores/useAuthStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ObservationDetailsScreen() {
  const router = useRouter();
  const realm = useRealm();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const userId = useAuthStore((state) => state.userHashId);
  
  const draft = useObject(DraftObservation, draftId || '');

  const [animalNickname, setAnimalNickname] = useState('');
  const [scientificName, setScientificName] = useState('');
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
        animalNickname: animalNickname.trim(),
        scientificName: scientificName.trim(),
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

  const mediaCount = draft.tempMediaUris ? draft.tempMediaUris.length : 0;
  const firstMedia = mediaCount > 0 ? draft.tempMediaUris![0] : 'https://images.unsplash.com/photo-1590209706318-7b98a58f4eb8';

  return (
    <View className="flex-1 bg-surface-container relative">
      {/* Header */}
      <View className="absolute top-0 w-full z-50 bg-surface/90 border-b border-outline-variant/20 shadow-sm pt-safe-margin px-margin-mobile pb-2 flex-row justify-between items-center h-[90px]">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-surface-container-highest/50 items-center justify-center mt-4"
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={16} color="#181c1b" />
        </TouchableOpacity>
        <Text className="font-sans text-[20px] font-semibold text-on-surface mt-4">Observation Details</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center mt-4 rounded-full hover:bg-primary-container/20">
          <FontAwesome name="ellipsis-v" size={20} color="#006763" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 pt-[100px] px-margin-mobile" 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Media Carousel Section */}
        <View className="relative w-full aspect-[4/3] rounded-[24px] bg-surface-container-highest overflow-hidden mb-6 border border-outline-variant/10 shadow-sm">
          <Image source={{ uri: firstMedia }} className="w-full h-full object-cover" />
          <View className="absolute bottom-4 right-4 bg-inverse-surface/60 rounded-full px-3 py-1 flex-row items-center shadow-sm">
            <FontAwesome name="picture-o" size={12} color="#fff" />
            <Text className="text-white font-sans text-[12px] font-semibold ml-2">1 / {mediaCount || 1}</Text>
          </View>
          <TouchableOpacity className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-surface/90 items-center justify-center shadow-sm">
            <FontAwesome name="camera" size={16} color="#006763" />
          </TouchableOpacity>
        </View>

        {/* Identification Form */}
        <View className="bg-surface rounded-[24px] p-6 shadow-sm flex-col gap-4 mb-6 border border-outline-variant/10">
          <Text className="font-sans text-[12px] font-semibold text-secondary uppercase tracking-wider">Identification</Text>
          
          <View className="flex-col gap-2">
            <Text className="font-sans text-[12px] font-semibold text-on-surface-variant">Common Name (or Nickname)</Text>
            <TextInput
              className="w-full bg-surface-container-lowest border-[1.5px] border-outline-variant rounded-xl px-4 py-3 font-sans text-[16px] text-on-surface"
              placeholder="e.g. Blue Morpho"
              placeholderTextColor="#6d7a78"
              value={animalNickname}
              onChangeText={setAnimalNickname}
            />
          </View>

          <View className="flex-col gap-2 mt-2">
            <Text className="font-sans text-[12px] font-semibold text-on-surface-variant">Scientific Name</Text>
            <TextInput
              className="w-full bg-surface-container-lowest border-[1.5px] border-outline-variant rounded-xl px-4 py-3 font-sans text-[16px] text-on-surface italic"
              placeholder="e.g. Morpho peleides"
              placeholderTextColor="#6d7a78"
              value={scientificName}
              onChangeText={setScientificName}
            />
          </View>
        </View>

        {/* GPS Location Card */}
        <View className="bg-surface rounded-[24px] p-6 shadow-sm flex-col gap-4 mb-6 border border-outline-variant/10">
          <View className="flex-row justify-between items-center">
            <Text className="font-sans text-[12px] font-semibold text-secondary uppercase tracking-wider">Location</Text>
            <TouchableOpacity className="flex-row items-center">
              <FontAwesome name="crosshairs" size={14} color="#006763" />
              <Text className="font-sans text-[12px] font-semibold text-primary ml-1">Update</Text>
            </TouchableOpacity>
          </View>
          <View className="relative w-full h-32 rounded-xl overflow-hidden bg-surface-container-highest border border-outline-variant/20">
             <Image source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b' }} className="w-full h-full object-cover opacity-80" />
             <View className="absolute inset-0 flex items-center justify-center">
                <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
                  <View className="w-3 h-3 rounded-full bg-primary border border-white" />
                </View>
             </View>
          </View>
          <View className="flex-col">
            <Text className="font-sans text-[14px] text-on-surface font-semibold">{locationText}</Text>
            <Text className="font-sans text-[12px] text-on-surface-variant mt-1">Lat: {coords?.lat?.toFixed(4) || '--'}° N, Lon: {coords?.lon?.toFixed(4) || '--'}° W</Text>
          </View>
        </View>

        {/* Attributes & Tags */}
        <View className="bg-surface rounded-[24px] p-6 shadow-sm flex-col gap-4 mb-6 border border-outline-variant/10">
          <Text className="font-sans text-[12px] font-semibold text-secondary uppercase tracking-wider">Attributes</Text>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity className="bg-[#7ef6ee] px-4 py-2 rounded-full flex-row items-center border border-primary/10">
              <FontAwesome name="tree" size={12} color="#00201e" />
              <Text className="font-sans text-[12px] font-semibold text-[#00201e] ml-2">Rainforest</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#7ef6ee] px-4 py-2 rounded-full flex-row items-center border border-primary/10">
              <FontAwesome name="sun-o" size={12} color="#00201e" />
              <Text className="font-sans text-[12px] font-semibold text-[#00201e] ml-2">Daytime</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface-container-highest border border-outline-variant border-dashed px-4 py-2 rounded-full flex-row items-center">
              <FontAwesome name="plus" size={12} color="#474743" />
              <Text className="font-sans text-[12px] font-semibold text-[#474743] ml-2">Add Tag</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Field Notes */}
        <View className="bg-surface rounded-[24px] p-6 shadow-sm flex-col gap-4 border border-outline-variant/10">
          <Text className="font-sans text-[12px] font-semibold text-secondary uppercase tracking-wider">Field Notes</Text>
          <TextInput
            className="w-full bg-surface-container-lowest border-[1.5px] border-outline-variant rounded-xl px-4 py-3 font-sans text-[16px] text-on-surface h-32"
            placeholder="Record behavioral observations, weather conditions, or environmental context..."
            placeholderTextColor="#6d7a78"
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View className="absolute bottom-0 w-full z-50 bg-surface/90 border-t border-outline-variant/10 shadow-sm pt-4 pb-8 px-margin-mobile flex-row gap-4">
        <TouchableOpacity 
          className="flex-1 bg-surface border-[1.5px] border-outline-variant rounded-full py-4 items-center justify-center active:scale-95"
          onPress={handleDiscard}
        >
          <Text className="font-sans text-[18px] font-semibold text-on-surface">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-[2] bg-primary rounded-full py-4 flex-row items-center justify-center active:scale-95 shadow-sm"
          onPress={handleSave}
        >
          <FontAwesome name="save" size={18} color="#fff" className="mr-2" />
          <Text className="font-sans text-[18px] font-semibold text-on-primary ml-2">Save Observation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
