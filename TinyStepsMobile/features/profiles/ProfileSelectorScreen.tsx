import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Plus, Pencil } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useBaby } from '../../context/BabyContext';
import type { Baby } from '../../context/BabyContext';

export default function ProfileSelectorScreen() {
  const navigation = useNavigation();
  const { babies, fetchBabies, selectBaby, isLoading } = useBaby();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isManageMode, setIsManageMode] = useState(false);

  useEffect(() => {
    loadBabies();
  }, []);

  const loadBabies = async () => {
    try {
      await fetchBabies();
    } catch (error) {
      Alert.alert('Error', 'Failed to load profiles. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSelectProfile = (baby: Baby) => {
    // Log the image URL when profile is clicked
    console.log('Profile clicked - Avatar URL:', baby.avatar_url);
    
    if (isManageMode) {
      // Navigate to edit screen
      navigation.navigate('EditBaby' as never, { babyId: baby.id } as never);
    } else {
      // Normal selection
      selectBaby(baby);
      navigation.navigate('Dashboard' as never);
    }
  };

  const handleAddProfile = () => {
    navigation.navigate('AddBaby' as never);
  };

  // Show loading state
  if (isInitializing) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-slate-400 mt-4">Loading profiles...</Text>
      </View>
    );
  }

  // Show empty state if no babies
  if (babies.length === 0) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center px-6">
        <Animated.View 
          entering={FadeInDown.duration(800).springify()}
          className="items-center"
        >
          <View className="w-32 h-32 rounded-full items-center justify-center mb-6 bg-slate-900/50 border-4 border-dashed border-slate-700">
            <Plus size={56} color="#94A3B8" strokeWidth={2.5} />
          </View>
          <Text className="text-3xl font-bold text-white text-center mb-3">
            No Profiles Yet
          </Text>
          <Text className="text-slate-400 text-center mb-8">
            Create your first baby profile to get started
          </Text>
          <TouchableOpacity
            onPress={handleAddProfile}
            className="overflow-hidden rounded-2xl"
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-8 py-4"
            >
              <Text className="text-white text-lg font-semibold">
                Add Your First Baby
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      {/* Atmospheric Gradient Orb */}
      <Animated.View 
        entering={FadeIn.duration(1000)}
        className="absolute -top-40 -right-20 w-96 h-96"
      >
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          className="w-full h-full rounded-full opacity-30"
          style={{ transform: [{ scale: 1.5 }] }}
        />
      </Animated.View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-6">
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.delay(200).duration(800).springify()}
            className="mb-16"
          >
            <Text className="text-5xl font-bold text-white text-center mb-3">
              {isManageMode ? 'Manage Profiles' : "Your Babies"}
            </Text>
            <Text className="text-slate-400 text-lg text-center">
              {isManageMode ? 'Tap a profile to edit' : 'Select a profile to continue'}
            </Text>
          </Animated.View>

        {/* Profile Grid - Centered Wrapping Layout */}
        <View className="flex-row flex-wrap justify-center items-center gap-6 px-4">
          {/* Baby Profiles */}
          {babies.map((baby, index) => (
            <Animated.View
              key={baby.id}
              entering={FadeInDown.delay(400 + index * 100).duration(800).springify()}
            >
              <TouchableOpacity
                onPress={() => handleSelectProfile(baby)}
                activeOpacity={0.8}
                className="items-center"
              >
                {/* Avatar Circle */}
                <View 
                  className="w-32 h-32 rounded-full items-center justify-center mb-4 border-4 relative overflow-hidden"
                  style={{ 
                    backgroundColor: baby.theme_color + '20',
                    borderColor: baby.theme_color,
                  }}
                >
                  {baby.avatar_url ? (
                    <Image
                      source={{ uri: baby.avatar_url }}
                      className="w-full h-full"
                      contentFit="cover"
                      transition={500}
                      cachePolicy="memory-disk"
                      onError={(e) => console.log("⚠️ IMAGE LOAD ERROR:", e.error)}
                    />
                  ) : (
                    <User size={56} color={baby.theme_color} strokeWidth={2.5} />
                  )}
                  
                  {/* Edit Overlay - Only shown in Manage Mode */}
                  {isManageMode && (
                    <View 
                      className="absolute bg-black/40 rounded-full items-center justify-center"
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Pencil size={32} color="#FFFFFF" strokeWidth={2} style={{ opacity: 0.8 }} />
                    </View>
                  )}
                </View>
                
                {/* Name */}
                <Text className="text-white text-xl font-semibold">
                  {baby.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Add New Profile Button */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(800).springify()}
          >
            <TouchableOpacity
              onPress={handleAddProfile}
              activeOpacity={0.8}
              className="items-center"
            >
              {/* Add Button Circle */}
              <View className="w-32 h-32 rounded-full items-center justify-center mb-4 border-4 border-dashed border-slate-700 bg-slate-900/50">
                <Plus size={56} color="#94A3B8" strokeWidth={2.5} />
              </View>
              
              {/* Label */}
              <Text className="text-slate-400 text-xl font-semibold">
                Add Baby
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Manage Profiles Link */}
        <Animated.View 
          entering={FadeInDown.delay(900).duration(800).springify()}
          className="mt-16"
        >
          <TouchableOpacity onPress={() => setIsManageMode(!isManageMode)}>
            <Text className={`text-base ${isManageMode ? 'text-indigo-400 font-semibold' : 'text-slate-500'}`}>
              {isManageMode ? 'Exit Manage Mode' : 'Manage Profiles'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

