import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const PATHS = [
  { id: 'CLS-01', title: 'Student', desc: 'Learning identification and basic ecological principles.', icon: 'graduation-cap', tag: 'Student' },
  { id: 'RSCH-02', title: 'Researcher', desc: 'Gathering structured data for scientific study and analysis.', icon: 'flask', tag: 'Researcher' },
  { id: 'EXPL-03', title: 'Explorer', desc: 'Discovering new trails and cataloging diverse habitats.', icon: 'compass', tag: 'Explorer' },
  { id: 'PHOT-04', title: 'Photographer', desc: 'Capturing high-quality visual records of flora and fauna.', icon: 'camera', tag: 'Photographer' },
  { id: 'COLL-05', title: 'Collector', desc: 'Building a comprehensive personal compendium of species.', icon: 'book', tag: 'Collector' },
  { id: 'CONS-06', title: 'Conservationist', desc: 'Monitoring ecosystem health and tracking endangered subjects.', icon: 'leaf', tag: 'Conservationist' },
];

export default function CategoryScreen() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string>('Explorer');

  const handleContinue = () => {
    router.push({ pathname: '/(auth)/signup', params: { category: selectedPath } });
  };

  return (
    <View className="flex-1 bg-[#E4DDD3]">
      {/* Top Navigation */}
      <View className="w-full px-margin-mobile py-lg flex-row justify-between items-center z-50 pt-16">
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-high"
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#181c1b" />
        </TouchableOpacity>
        <Text className="font-sans text-[12px] font-semibold text-secondary tracking-widest uppercase">
          Step 2 of 4
        </Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1 px-margin-mobile pt-md" showsVerticalScrollIndicator={false}>
        <View className="mb-xl text-center items-center md:items-start md:text-left">
          <Text className="text-[40px] font-bold text-primary mb-sm font-sans">
            Select Path
          </Text>
          <Text className="text-[16px] text-on-surface-variant max-w-[300px] text-center md:text-left font-sans">
            Choose how you interact with the natural world. This helps us tailor your tools and discovery feeds.
          </Text>
        </View>

        <View className="flex-col gap-4 pb-32">
          {PATHS.map((path) => {
            const isSelected = selectedPath === path.tag;
            return (
              <TouchableOpacity
                key={path.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPath(path.tag)}
                className={`relative rounded-xl bg-surface-container-lowest border border-outline/20 overflow-hidden flex-col shadow-sm ${isSelected ? '-translate-y-1' : ''}`}
                style={{ 
                  shadowColor: isSelected ? '#00A19B' : '#000',
                  shadowOffset: { width: 0, height: isSelected ? 8 : 1 },
                  shadowOpacity: isSelected ? 0.3 : 0.05,
                  shadowRadius: isSelected ? 12 : 2,
                  elevation: isSelected ? 10 : 1,
                  transform: [{ translateY: isSelected ? -4 : 0 }]
                }}
              >
                {/* Accent Bar */}
                <View 
                  className="absolute left-0 top-0 bottom-0"
                  style={{
                    backgroundColor: isSelected ? '#00A19B' : 'rgba(0, 161, 155, 0.8)',
                    width: isSelected ? 20 : 16
                  }}
                />
                
                <View className="pl-10 p-6 flex-col relative">
                  <View className="absolute top-4 right-4 px-2 py-0.5 border border-dashed border-outline-variant rounded bg-surface-container-low">
                    <Text className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
                      {path.id}
                    </Text>
                  </View>
                  
                  <View className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isSelected ? 'bg-primary-container' : 'bg-surface-container-high'}`}>
                    <FontAwesome name={path.icon as any} size={24} color={isSelected ? '#f3fffd' : '#006763'} />
                  </View>
                  
                  <Text className="text-[20px] font-semibold text-on-surface mb-1 font-sans">
                    {path.title}
                  </Text>
                  <Text className="text-[14px] text-on-surface-variant font-sans pr-4">
                    {path.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Area */}
      <View className="absolute bottom-0 w-full pt-lg pb-md px-margin-mobile">
        <TouchableOpacity 
          className="w-full py-md rounded-full bg-[#00A19B] shadow-lg flex-row items-center justify-center active:opacity-90"
          onPress={handleContinue}
        >
          <Text className="text-on-primary font-semibold text-[20px] font-sans mr-2">
            Continue
          </Text>
          <FontAwesome name="arrow-right" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
