import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Scale, Ruler, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import api from '../services/api';

interface AddGrowthRecordModalProps {
  isVisible: boolean;
  onClose: () => void;
  babyId: number;
  onSuccess: () => void;
}

export default function AddGrowthRecordModal({
  isVisible,
  onClose,
  babyId,
  onSuccess,
}: AddGrowthRecordModalProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [recordedAt, setRecordedAt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setRecordedAt(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!weight || !height) {
      Alert.alert('Error', 'Please fill in both weight and height');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    if (isNaN(heightNum) || heightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid height');
      return;
    }

    // Check date is not in the future
    if (recordedAt > new Date()) {
      Alert.alert('Error', 'Date cannot be in the future');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/growth', {
        baby_id: babyId,
        weight: weightNum,
        height: heightNum,
        recorded_at: recordedAt.toISOString().split('T')[0],
      });

      // Refresh data immediately
      onSuccess();
      
      // Reset form
      setWeight('');
      setHeight('');
      setRecordedAt(new Date());
      
      Alert.alert('Success', 'Growth record added!', [
        { text: 'OK', onPress: () => {
          onClose();
        }}
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add growth record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-black/60 items-center justify-center px-6"
      >
        <TouchableOpacity
          className="absolute inset-0"
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          entering={FadeInDown.duration(400).springify()}
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 w-full max-w-md"
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-2xl font-bold">Add Growth Record</Text>
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Weight Input */}
          <View className="mb-4">
            <Text className="text-slate-300 mb-2 font-medium text-sm">Weight (kg)</Text>
            <View className="flex-row items-center bg-slate-950/50 rounded-xl h-14 px-4 border border-slate-800">
              <Scale size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Enter weight"
                placeholderTextColor="#64748B"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Height Input */}
          <View className="mb-4">
            <Text className="text-slate-300 mb-2 font-medium text-sm">Height (cm)</Text>
            <View className="flex-row items-center bg-slate-950/50 rounded-xl h-14 px-4 border border-slate-800">
              <Ruler size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Enter height"
                placeholderTextColor="#64748B"
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Date Picker */}
          <View className="mb-6">
            <Text className="text-slate-300 mb-2 font-medium text-sm">Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center bg-slate-950/50 rounded-xl h-14 px-4 border border-slate-800"
              disabled={isLoading}
            >
              <Calendar size={20} color="#94A3B8" />
              <Text className="flex-1 ml-3 text-white text-base">
                {formatDate(recordedAt)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={recordedAt}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
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
                {isLoading ? 'Adding...' : 'Add Record'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

