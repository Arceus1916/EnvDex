import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85 > 320 ? 320 : width * 0.85;

export default function WelcomeScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/(auth)/signup');
  };

  return (
    <View className="flex-1 bg-background">
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUvftwKuKS185duqe-iFWGapen9MwOqs_088-Uhccxle87tAL17GEJ_3erxpo1nz6vH24e8-YGur2I9zy6bl3VkiOQ9bxm4MggVlg15rLxUbhfzQyoy1p5ssT7DEIYLoTpwZgpn80f3Pw8Q3JsS97FTXqTKmdRKmOH7u-OV0CxOASfC_4zmnFyHUYvDb_FAGGCJsXU0-UBNaqSvjcOJ7FL7LXH9l-7ZTMZDl57oyx-ZkCjvpwOxhmzzWrdbzIIbwPc5D9CD_3ygwDr' }}
        className="absolute inset-0 z-0"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/60 z-0" />
      </ImageBackground>

      <View className="relative z-10 flex-1 justify-between pb-safe-margin">
        <View className="pt-[132px] px-margin-mobile items-center">
          <Text className="text-[40px] font-bold text-surface-container-lowest tracking-tight font-sans text-center shadow-lg">
            Welcome to EnvDex
          </Text>
          <Text className="text-[20px] font-semibold text-surface-container-low mt-xs opacity-90 font-sans text-center">
            Capture discoveries
          </Text>
        </View>

        <View className="w-full pb-lg">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}
          >
            {/* Card 1 */}
            <View 
              className="bg-surface/90 rounded-[24px] p-lg mr-4 border border-outline-variant/30 justify-between"
              style={{ width: CARD_WIDTH }}
            >
              <View className="w-12 h-12 rounded-full bg-primary-container/20 items-center justify-center mb-sm">
                <FontAwesome name="book" size={24} color="#006763" />
              </View>
              <View>
                <Text className="text-[20px] font-semibold text-on-surface mb-base font-sans">Local Species Tracking</Text>
                <Text className="text-[14px] text-on-surface-variant leading-relaxed font-sans">
                  Log botanical and faunal specimens with ease, creating a personal library of nature encounters.
                </Text>
              </View>
            </View>

            {/* Card 2 */}
            <View 
              className="bg-surface/90 rounded-[24px] p-lg mr-4 border border-outline-variant/30 justify-between"
              style={{ width: CARD_WIDTH }}
            >
              <View className="w-12 h-12 rounded-full bg-primary-container/20 items-center justify-center mb-sm">
                <FontAwesome name="pencil-square-o" size={24} color="#006763" />
              </View>
              <View>
                <Text className="text-[20px] font-semibold text-on-surface mb-base font-sans">Personal Journal</Text>
                <Text className="text-[14px] text-on-surface-variant leading-relaxed font-sans">
                  Maintain a private, offline catalog of your own nature discoveries, sightings, and media.
                </Text>
              </View>
            </View>

            {/* Card 3 */}
            <View 
              className="bg-surface/90 rounded-[24px] p-lg mr-4 border border-outline-variant/30 justify-between"
              style={{ width: CARD_WIDTH }}
            >
              <View className="w-12 h-12 rounded-full bg-primary-container/20 items-center justify-center mb-sm">
                <FontAwesome name="shield" size={24} color="#006763" />
              </View>
              <View>
                <Text className="text-[20px] font-semibold text-on-surface mb-base font-sans">Offline Archive</Text>
                <Text className="text-[14px] text-on-surface-variant leading-relaxed font-sans">
                  Your data stays securely on your device, completely isolated and accessible without any internet.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="px-margin-mobile w-full max-w-[500px] mx-auto mt-xs gap-y-3">
            <TouchableOpacity 
              className="w-full bg-primary rounded-full py-[18px] flex-row items-center justify-center shadow-md active:opacity-80"
              onPress={() => router.push('/(auth)/category')}
            >
              <Text className="text-on-primary font-bold text-[14px] font-sans">
                Create New Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="w-full bg-surface-container-lowest rounded-full py-[18px] flex-row items-center justify-center border border-outline-variant/30 shadow-sm active:opacity-80"
              onPress={() => router.push('/(auth)/login')}
            >
              <Text className="text-primary font-bold text-[14px] font-sans">
                Already a User? Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
