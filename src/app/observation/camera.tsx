import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRealm } from '@realm/react';
import { ObservationService } from '../../services/ObservationService';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const realm = useRealm();

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-safe-margin">
        <Text className="text-on-surface text-center mb-4 text-lg">
          EnvDex needs camera access to capture observations.
        </Text>
        <TouchableOpacity className="bg-primary py-4 px-8 rounded-full" onPress={requestPermission}>
          <Text className="text-on-primary font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      
      if (photo?.uri) {
        processMedia([photo.uri]);
      }
    }
  };

  const handleGallerySelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 8,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      processMedia(uris);
    }
  };

  const processMedia = async (uris: string[]) => {
    try {
      const draft = await ObservationService.createDraft(realm, uris);
      router.push({ pathname: '/observation/details', params: { draftId: draft.draftId } });
    } catch (err) {
      Alert.alert('Error', 'Failed to create observation draft.');
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        ref={cameraRef}
        className="flex-1" 
        facing={cameraType}
      >
        <View className="absolute bottom-12 flex-row w-full items-center justify-between px-12">
          {/* Gallery Button */}
          <TouchableOpacity 
            className="w-12 h-12 bg-surface-container/50 rounded-full items-center justify-center"
            onPress={handleGallerySelect}
          >
            <Text className="text-xl">🖼️</Text>
          </TouchableOpacity>

          {/* Capture Button */}
          <TouchableOpacity 
            className="w-20 h-20 bg-white rounded-full border-4 border-outline-variant items-center justify-center"
            onPress={handleCapture}
          />

          {/* Flip Button */}
          <TouchableOpacity 
            className="w-12 h-12 bg-surface-container/50 rounded-full items-center justify-center"
            onPress={() => setCameraType(cameraType === 'back' ? 'front' : 'back')}
          >
            <Text className="text-xl">🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Close Button */}
        <TouchableOpacity 
          className="absolute top-12 left-6 w-10 h-10 bg-surface-container/50 rounded-full items-center justify-center"
          onPress={() => router.back()}
        >
          <Text className="text-white text-lg font-bold">X</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}
