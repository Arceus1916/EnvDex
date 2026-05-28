import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRealm } from '@realm/react';
import { ObservationService } from '../../services/ObservationService';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      <View className="flex-1 bg-[#000000] items-center justify-center p-safe-margin">
        <Text className="text-white text-center mb-4 text-[16px] font-sans">
          EnvDex needs camera access to capture observations.
        </Text>
        <TouchableOpacity className="bg-[#00A19B] py-md px-xl rounded-full" onPress={requestPermission}>
          <Text className="text-white font-bold font-sans">Grant Permission</Text>
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
        style={{ flex: 1 }}
        facing={cameraType}
      >
        {/* Top Controls */}
        <View className="absolute top-0 w-full z-20 flex-row justify-between items-center px-margin-mobile pt-[60px] pb-4 bg-black/40">
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10 active:scale-95"
            onPress={() => router.back()}
          >
            <FontAwesome name="times" size={18} color="#fff" />
          </TouchableOpacity>
          <View className="flex-row gap-4">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10 active:scale-95 mr-2">
              <FontAwesome name="bolt" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10 active:scale-95">
              <FontAwesome name="sun-o" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Focus Reticle */}
        <View className="absolute inset-0 z-10 items-center justify-center pointer-events-none">
          <View className="w-20 h-20 border-[1.5px] border-white/30 rounded-lg flex items-center justify-center">
            <View className="w-2 h-2 bg-white/50 rounded-full" />
          </View>
        </View>

        {/* Bottom Controls Area */}
        <View className="absolute bottom-0 w-full z-20 bg-black/40 border-t border-white/10 pb-[40px] pt-md px-margin-mobile items-center">
          
          {/* Mode Switcher */}
          <View className="flex-row gap-lg mb-lg">
            <Text className="text-white font-bold font-sans text-[12px] tracking-widest mr-4">PHOTO</Text>
            <Text className="text-white/60 font-semibold font-sans text-[12px] tracking-widest mr-4">VIDEO</Text>
            <Text className="text-white/60 font-semibold font-sans text-[12px] tracking-widest">MACRO</Text>
          </View>

          {/* Main Action Bar */}
          <View className="flex-row justify-between items-center w-full max-w-xs mb-lg">
            
            {/* Gallery Preview */}
            <TouchableOpacity 
              className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 active:scale-95"
              onPress={handleGallerySelect}
            >
              <Image source={{ uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc' }} className="w-full h-full object-cover" />
            </TouchableOpacity>

            {/* Shutter Button */}
            <TouchableOpacity 
              className="w-20 h-20 rounded-full bg-white p-1 active:scale-90 items-center justify-center"
              style={{ shadowColor: '#00A19B', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20 }}
              onPress={handleCapture}
            >
              <View className="w-full h-full rounded-full bg-white border-2 border-black items-center justify-center">
                <View className="w-[85%] h-[85%] rounded-full border border-gray-300" />
              </View>
            </TouchableOpacity>

            {/* Camera Switch */}
            <TouchableOpacity 
              className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center border border-white/10 active:scale-95"
              onPress={() => setCameraType(cameraType === 'back' ? 'front' : 'back')}
            >
              <FontAwesome name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

      </CameraView>
    </View>
  );
}
