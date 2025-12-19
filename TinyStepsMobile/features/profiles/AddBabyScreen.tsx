import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, User as UserIcon, Calendar } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useBaby } from '../../context/BabyContext';

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

export default function AddBabyScreen() {
  const navigation = useNavigation();
  const { createBaby } = useBaby();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [themeColor, setThemeColor] = useState(THEME_COLORS[0].hex);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please grant photo library access in Settings to upload a profile picture.');
        return;
      }

      // Launch image picker (mediaTypes defaults to 'Images')
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    if (!gender) {
      Alert.alert('Error', 'Please select a gender');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('gender', gender);
      formData.append('birth_date', birthDate.toISOString().split('T')[0]);
      formData.append('theme_color', themeColor);

      if (image) {
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

      await createBaby(formData);
      Alert.alert('Success', `${name}'s profile created!`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950"
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 40, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(800).springify()}
          className="mb-8"
        >
          <Text className="text-4xl font-bold text-white text-center mb-2">
            Welcome to the world! 🌟
          </Text>
          <Text className="text-slate-400 text-center text-base">
            Let's set up your baby's profile
          </Text>
        </Animated.View>

        {/* Form Container */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(800).springify()}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6"
        >
          {/* Avatar Picker */}
          <View className="items-center mb-6">
            <TouchableOpacity 
              onPress={pickImage}
              activeOpacity={0.8}
              className="relative"
            >
              <View 
                className="w-32 h-32 rounded-full items-center justify-center border-4"
                style={{ 
                  backgroundColor: image ? 'transparent' : '#1E293B',
                  borderColor: image ? '#6366F1' : '#475569',
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
                  <Camera size={40} color="#94A3B8" strokeWidth={2} />
                )}
              </View>
              {image && (
                <View className="absolute bottom-0 right-0 bg-indigo-500 rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-semibold">Edit</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text className="text-slate-400 text-sm mt-3">
              Tap to {image ? 'change' : 'add'} photo
            </Text>
          </View>

          {/* Name Input */}
          <View className="mb-4">
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

          {/* Gender Selector */}
          <View className="mb-4">
            <Text className="text-slate-300 mb-2 font-medium text-sm">Gender</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setGender('male')}
                className={`flex-1 h-14 rounded-xl items-center justify-center border-2 ${
                  gender === 'male' 
                    ? 'bg-blue-500/20 border-blue-500' 
                    : 'bg-slate-950/50 border-slate-800'
                }`}
                disabled={isLoading}
              >
                <Text className={gender === 'male' ? 'text-blue-400 font-semibold' : 'text-slate-400'}>
                  👦 Boy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setGender('female')}
                className={`flex-1 h-14 rounded-xl items-center justify-center border-2 ${
                  gender === 'female' 
                    ? 'bg-pink-500/20 border-pink-500' 
                    : 'bg-slate-950/50 border-slate-800'
                }`}
                disabled={isLoading}
              >
                <Text className={gender === 'female' ? 'text-pink-400 font-semibold' : 'text-slate-400'}>
                  👧 Girl
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Birthday Picker */}
          <View className="mb-4">
            <Text className="text-slate-300 mb-2 font-medium text-sm">Date of Birth</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-slate-950/50 rounded-xl h-14 px-4 flex-row items-center justify-between border border-slate-800"
              disabled={isLoading}
            >
              <Text className="text-white text-base">
                {formatDate(birthDate)}
              </Text>
              <Calendar size={20} color="#94A3B8" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Theme Color Picker */}
          <View className="mb-6">
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

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
            className="overflow-hidden rounded-2xl"
          >
            <LinearGradient
              colors={isLoading ? ['#818CF8', '#A78BFA'] : ['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-14 items-center justify-center"
            >
              <Text className="text-white text-lg font-semibold">
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

