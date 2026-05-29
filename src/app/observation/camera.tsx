import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { useRealm } from '@realm/react';
import { ObservationService } from '../../services/ObservationService';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [cameraMode, setCameraMode] = useState<'photo' | 'video' | 'macro'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recentImageUri, setRecentImageUri] = useState<string | null>(null);
  
  // New features
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [zoom, setZoom] = useState(0); // 0 to 1
  const [showSettings, setShowSettings] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const realm = useRealm();

  useEffect(() => {
    (async () => {
      if (!mediaLibraryPermission?.granted) {
        const { status } = await requestMediaLibraryPermission();
        if (status === 'granted') {
          fetchRecentImage();
        }
      } else {
        fetchRecentImage();
      }
    })();
  }, [mediaLibraryPermission]);

  // Set default zoom when switching to macro
  useEffect(() => {
    if (cameraMode === 'macro') {
      setZoom(0.05); // Macro base zoom
    } else if (cameraMode === 'video') {
      setZoom(0); // Reset for video
    } else {
      setZoom(0); // Reset for photo
    }
  }, [cameraMode]);

  const fetchRecentImage = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({ first: 1, sortBy: [['creationTime', false]] });
      if (assets.length > 0) {
        setRecentImageUri(assets[0].uri);
      }
    } catch (e) {
      console.warn("Failed to fetch recent image", e);
    }
  };

  if (!cameraPermission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!cameraPermission.granted) {
    return (
      <View className="flex-1 bg-[#000000] items-center justify-center p-safe-margin">
        <Text className="text-white text-center mb-4 text-[16px] font-sans">
          EnvDex needs camera access to capture observations.
        </Text>
        <TouchableOpacity className="bg-[#00A19B] py-md px-xl rounded-full mb-4" onPress={requestCameraPermission}>
          <Text className="text-white font-bold font-sans">Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    if (cameraMode === 'video') {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        if (!micPermission?.granted) {
          const micStatus = await requestMicPermission();
          if (!micStatus.granted) {
            Alert.alert("Permission Required", "Microphone access is required for video.");
            return;
          }
        }
        setIsRecording(true);
        try {
          const video = await cameraRef.current.recordAsync();
          setIsRecording(false);
          if (video?.uri) {
            processMedia([video.uri]);
          }
        } catch (e) {
          setIsRecording(false);
          Alert.alert("Error", "Failed to record video.");
        }
      }
    } else {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        if (photo?.uri) {
          processMedia([photo.uri]);
        }
      } catch (e) {
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  const handleGallerySelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
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

  const toggleFlash = () => {
    setFlashMode(prev => prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off');
  };

  // Zoom controls (0.0 to 1.0)
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0));

  const flashIcon = flashMode === 'off' ? 'flash-off' : flashMode === 'on' ? 'flash' : 'flash-auto';

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={cameraType}
        mode={cameraMode === 'video' ? 'video' : 'picture'}
        {...(zoom > 0 ? { zoom } : {})}
        {...(flashMode === 'on' ? { enableTorch: true } : {})}
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
            <TouchableOpacity 
              className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 active:scale-95 ${flashMode !== 'off' ? 'bg-primary/80' : 'bg-black/40'}`}
              onPress={toggleFlash}
              accessibilityLabel={`Flash ${flashMode}`}
              accessibilityRole="button"
            >
              <FontAwesome name={flashMode === 'auto' ? 'bolt' : 'bolt'} size={18} color={flashMode === 'auto' ? '#f59e0b' : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity 
              className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 active:scale-95 ${showSettings ? 'bg-primary/80' : 'bg-black/40'}`}
              onPress={() => setShowSettings(!showSettings)}
              accessibilityLabel="Settings"
              accessibilityRole="button"
            >
              <FontAwesome name="cog" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Overlay */}
        {showSettings && (
          <View className="absolute top-[120px] right-margin-mobile bg-black/80 p-4 rounded-2xl z-30 border border-white/10 shadow-lg w-[200px]">
            <Text className="text-white font-bold mb-4 font-sans text-[14px]">Camera Settings</Text>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white/80 font-sans text-[14px]">Grid Lines</Text>
              <TouchableOpacity 
                className={`w-12 h-6 rounded-full flex-row items-center px-1 ${showGrid ? 'bg-primary' : 'bg-white/20'}`}
                onPress={() => setShowGrid(!showGrid)}
              >
                <View className={`w-4 h-4 rounded-full bg-white transition-transform ${showGrid ? 'translate-x-6' : 'translate-x-0'}`} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Grid Lines Overlay */}
        {showGrid && (
          <View className="absolute inset-0 pointer-events-none z-10 flex-col justify-evenly px-0">
            <View className="w-full h-[1px] bg-white/30" />
            <View className="w-full h-[1px] bg-white/30" />
            <View className="absolute inset-0 flex-row justify-evenly py-0">
              <View className="h-full w-[1px] bg-white/30" />
              <View className="h-full w-[1px] bg-white/30" />
            </View>
          </View>
        )}

        {/* Center Focus Reticle (Show only on Photo/Macro) */}
        {(cameraMode === 'photo' || cameraMode === 'macro') && (
          <View className="absolute inset-0 z-10 items-center justify-center pointer-events-none">
            <View className={`w-20 h-20 border-[1.5px] ${cameraMode === 'macro' ? 'border-primary' : 'border-white/30'} rounded-lg flex items-center justify-center`}>
              <View className={`w-2 h-2 ${cameraMode === 'macro' ? 'bg-primary' : 'bg-white/50'} rounded-full`} />
            </View>
          </View>
        )}

        {/* Bottom Controls Area */}
        <View className="absolute bottom-0 w-full z-20 bg-black/40 border-t border-white/10 pb-[40px] pt-md px-margin-mobile items-center">
          
          {/* Zoom Controls */}
          <View className="flex-row justify-center items-center mb-6 gap-6 w-full px-8">
            <TouchableOpacity 
              onPress={zoomOut}
              className="w-10 h-10 rounded-full bg-black/40 border border-white/20 items-center justify-center active:scale-90"
              accessibilityLabel="Zoom Out"
            >
              <FontAwesome name="minus" size={12} color="#fff" />
            </TouchableOpacity>
            
            <View className="w-16 items-center">
              <Text className="text-white font-bold font-sans text-[12px] tracking-wider">
                {cameraMode === 'macro' ? 'MACRO ' : ''}{(zoom * 10 + 1).toFixed(1)}x
              </Text>
            </View>

            <TouchableOpacity 
              onPress={zoomIn}
              className="w-10 h-10 rounded-full bg-black/40 border border-white/20 items-center justify-center active:scale-90"
              accessibilityLabel="Zoom In"
            >
              <FontAwesome name="plus" size={12} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Mode Switcher */}
          <View className="flex-row gap-lg mb-lg">
            <TouchableOpacity onPress={() => setCameraMode('photo')}>
              <Text className={`${cameraMode === 'photo' ? 'text-white font-bold' : 'text-white/60 font-semibold'} font-sans text-[12px] tracking-widest mr-4`}>PHOTO</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCameraMode('video')}>
              <Text className={`${cameraMode === 'video' ? 'text-white font-bold' : 'text-white/60 font-semibold'} font-sans text-[12px] tracking-widest mr-4`}>VIDEO</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCameraMode('macro')}>
              <Text className={`${cameraMode === 'macro' ? 'text-white font-bold' : 'text-white/60 font-semibold'} font-sans text-[12px] tracking-widest`}>MACRO</Text>
            </TouchableOpacity>
          </View>

          {/* Main Action Bar */}
          <View className="flex-row justify-between items-center w-full max-w-xs mb-lg">
            
            {/* Gallery Preview */}
            <TouchableOpacity 
              className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 active:scale-95 bg-surface-variant"
              onPress={handleGallerySelect}
            >
              {recentImageUri ? (
                <Image source={{ uri: recentImageUri }} className="w-full h-full object-cover" />
              ) : (
                <View className="w-full h-full items-center justify-center bg-surface-container-high">
                  <FontAwesome name="picture-o" size={16} color="#6d7a78" />
                </View>
              )}
            </TouchableOpacity>

            {/* Shutter Button */}
            <TouchableOpacity 
              className="w-20 h-20 rounded-full p-1 active:scale-90 items-center justify-center bg-white"
              style={{ shadowColor: cameraMode === 'video' ? '#FF3B30' : '#00A19B', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20 }}
              onPress={handleCapture}
            >
              <View className="w-full h-full rounded-full bg-white border-2 border-black items-center justify-center">
                <View className={`w-[85%] h-[85%] rounded-full ${isRecording ? 'bg-error' : (cameraMode === 'video' ? 'bg-error/80' : 'border border-gray-300')}`} />
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
