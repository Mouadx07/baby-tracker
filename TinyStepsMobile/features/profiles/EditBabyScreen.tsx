import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Trash2, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBaby } from '../../context/BabyContext';
import type { Baby } from '../../context/BabyContext';

const THEME_COLORS = [
  { name: 'Pink', hex: '#F472B6' },
  { name: 'Blue', hex: '#60A5FA' },
  { name: 'Purple', hex: '#A78BFA' },
  { name: 'Green', hex: '#34D399' },
  { name: 'Orange', hex: '#FB923C' },
  { name: 'Red', hex: '#F87171' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Indigo', hex: '#818CF8' },
];

export default function EditBabyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { babies, updateBaby, deleteBaby } = useBaby();
  
  // @ts-ignore - route params
  const babyId = route.params?.babyId as number;
  
  const [baby, setBaby] = useState<Baby | null>(null);
  const [name, setName] = useState('');
  const [themeColor, setThemeColor] = useState(THEME_COLORS[0].hex);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Find baby from context
    const foundBaby = babies.find(b => b.id === babyId);
    if (foundBaby) {
      setBaby(foundBaby);
      setName(foundBaby.name);
      setThemeColor(foundBaby.theme_color);
      if (foundBaby.avatar_url) {
        setImage(foundBaby.avatar_url);
      }
    }
  }, [babyId, babies]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please grant photo library access in Settings.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    if (!baby) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('theme_color', themeColor);
      // _method is added in BabyContext.updateBaby()

      if (image && image.startsWith('file://')) {
        // New image selected
        const imageUri = image;
        const filename = imageUri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('avatar', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      await updateBaby(baby.id, formData);
      
      Alert.alert('Success', 'Profile updated!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!baby) return;

    Alert.alert(
      'Delete Profile',
      'Are you sure? All growth data will be lost. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBaby(baby.id);
              navigation.navigate('ProfileSelector' as never);
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete profile');
            }
          },
        },
      ]
    );
  };

  if (!baby) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <Text className="text-slate-400">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 border-b border-slate-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text className="text-indigo-400 text-base font-medium">Cancel</Text>
        </TouchableOpacity>
        
        <Text className="text-white text-xl font-bold">Edit Profile</Text>
        
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text className={`text-base font-semibold ${isLoading ? 'text-slate-500' : 'text-indigo-400'}`}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 32, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(800).springify()}
          className="items-center mb-8"
        >
          <TouchableOpacity 
            onPress={pickImage}
            activeOpacity={0.8}
            className="relative"
            disabled={isLoading}
          >
            <View 
              className="w-40 h-40 rounded-full items-center justify-center border-4"
              style={{ 
                backgroundColor: image ? 'transparent' : '#1E293B',
                borderColor: '#6366F1',
              }}
            >
              {image ? (
                <Image 
                  source={{ uri: image }} 
                  className="w-full h-full rounded-full"
                  contentFit="cover"
                  transition={500}
                  cachePolicy="memory-disk"
                />
              ) : (
                <Camera size={48} color="#94A3B8" strokeWidth={2} />
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-2">
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text className="text-slate-400 text-sm mt-3">
            Tap to change photo
          </Text>
        </Animated.View>

        {/* Form Container */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(800).springify()}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 mb-6"
        >
          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-slate-300 mb-2 font-medium text-sm">Baby's Name</Text>
            <TextInput
              className="bg-slate-950/50 rounded-xl h-14 text-white px-4 text-base border border-slate-800"
              placeholder="Enter name"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>

          {/* Gender - Read Only */}
          <View className="mb-6">
            <Text className="text-slate-300 mb-2 font-medium text-sm">Gender</Text>
            <View className="bg-slate-950/30 rounded-xl h-14 px-4 items-center justify-center border border-slate-800">
              <Text className="text-slate-400 text-base capitalize">
                {baby.gender}
              </Text>
            </View>
            <Text className="text-slate-500 text-xs mt-1">Gender cannot be changed</Text>
          </View>

          {/* Birth Date - Read Only */}
          <View className="mb-6">
            <Text className="text-slate-300 mb-2 font-medium text-sm">Date of Birth</Text>
            <View className="bg-slate-950/30 rounded-xl h-14 px-4 items-center justify-center border border-slate-800">
              <Text className="text-slate-400 text-base">
                {new Date(baby.birth_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <Text className="text-slate-500 text-xs mt-1">Birth date cannot be changed</Text>
          </View>

          {/* Theme Color Picker */}
          <View>
            <Text className="text-slate-300 mb-3 font-medium text-sm">Profile Theme</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {THEME_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.hex}
                  onPress={() => setThemeColor(color.hex)}
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    themeColor === color.hex ? 'border-2 border-white' : ''
                  }`}
                  style={{ backgroundColor: color.hex }}
                  disabled={isLoading}
                >
                  {themeColor === color.hex && (
                    <View className="w-6 h-6 rounded-full bg-white/30" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(800).springify()}
          className="bg-slate-900/80 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6"
        >
          <Text className="text-red-400 font-semibold text-lg mb-2">Danger Zone</Text>
          <Text className="text-slate-400 text-sm mb-4">
            Deleting this profile will permanently remove all associated growth data and milestones.
          </Text>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isLoading}
            className="flex-row items-center justify-center gap-2"
          >
            <Trash2 size={18} color="#EF4444" />
            <Text className="text-red-500 font-semibold text-base">Delete Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

