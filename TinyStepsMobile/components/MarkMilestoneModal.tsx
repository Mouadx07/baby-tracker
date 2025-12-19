import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Calendar, Camera, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { markMilestoneAchieved, AchievedMilestone } from '../services/milestones';
import { Milestone } from '../utils/milestonesData';

interface MarkMilestoneModalProps {
  isVisible: boolean;
  onClose: () => void;
  babyId: number;
  milestone: Milestone;
  onSuccess: (achieved: AchievedMilestone) => void;
}

export default function MarkMilestoneModal({
  isVisible,
  onClose,
  babyId,
  milestone,
  onSuccess,
}: MarkMilestoneModalProps) {
  const [achievedAt, setAchievedAt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAchievedAt(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Format date as YYYY-MM-DD (date only, no time)
      const dateString = achievedAt.toISOString().split('T')[0];
      const achieved = await markMilestoneAchieved(
        babyId,
        milestone.id,
        dateString,
        photoUri || undefined,
        notes || undefined
      );
      // Reset form first
      setPhotoUri(null);
      setNotes('');
      setAchievedAt(new Date());
      // Call onSuccess before closing to ensure state updates
      onSuccess(achieved);
      // Close modal after state update
      setTimeout(() => {
        onClose();
      }, 0);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to mark milestone');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity 
            activeOpacity={1}
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <View style={{ justifyContent: 'flex-end' }}>
            <Animated.View
              entering={FadeInDown.duration(400).springify()}
              style={{
                backgroundColor: '#0f172a',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderTopWidth: 1,
                borderTopColor: '#1e293b',
                maxHeight: '90%',
              }}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between p-6 border-b border-slate-800">
                <Text className="text-white text-2xl font-bold">Mark as Achieved</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                nestedScrollEnabled={true}
              >
                <View className="p-6">
                {/* Milestone Title */}
                <View className="mb-6">
                  <Text className="text-white text-xl font-bold mb-2">
                    Did {milestone.title} happen?
                  </Text>
                  <Text className="text-slate-400 text-base">
                    {milestone.description}
                  </Text>
                </View>

                {/* Date Picker */}
                <View className="mb-6">
                  <Text className="text-slate-300 mb-2 font-medium text-sm">Date Achieved</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="flex-row items-center h-14 bg-slate-950 rounded-2xl px-4 border border-slate-800"
                  >
                    <Calendar size={20} color="#94A3B8" />
                    <Text className="flex-1 ml-3 text-white text-base">
                      {formatDate(achievedAt)}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={achievedAt}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </View>

                {/* Photo Upload */}
                <View className="mb-6">
                  <Text className="text-slate-300 mb-2 font-medium text-sm">Photo (Optional)</Text>
                  {photoUri ? (
                    <View className="relative">
                      <Image
                        source={{ uri: photoUri }}
                        className="w-full h-48 rounded-2xl"
                        contentFit="cover"
                        transition={500}
                        cachePolicy="memory-disk"
                      />
                      <TouchableOpacity
                        onPress={() => setPhotoUri(null)}
                        className="absolute top-2 right-2 bg-slate-900/80 rounded-full p-2"
                      >
                        <X size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={pickImage}
                      className="flex-row items-center justify-center h-32 bg-slate-950 rounded-2xl border border-slate-800 border-dashed"
                    >
                      <Camera size={24} color="#94A3B8" />
                      <Text className="ml-2 text-slate-400 text-base">Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Notes */}
                <View className="mb-6">
                  <Text className="text-slate-300 mb-2 font-medium text-sm">Notes (Optional)</Text>
                  <TextInput
                    className="bg-slate-950 rounded-2xl px-4 py-3 text-white text-base border border-slate-800"
                    placeholder="Add any notes about this milestone..."
                    placeholderTextColor="#64748B"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading}
                  className="mb-6"
                >
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    className="h-14 rounded-2xl items-center justify-center shadow-lg shadow-indigo-500/50"
                  >
                    {isLoading ? (
                      <Text className="text-white font-bold text-base">Saving...</Text>
                    ) : (
                      <View className="flex-row items-center">
                        <Check size={20} color="#fff" />
                        <Text className="text-white font-bold text-base ml-2">Mark as Achieved</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

