import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Calendar, Camera, CheckCircle2, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AchievedMilestone } from '../services/milestones';
import { Milestone } from '../utils/milestonesData';
import { MILESTONE_ICONS } from '../utils/milestonesData';

interface MilestoneDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  milestone: Milestone;
  achieved: AchievedMilestone;
  onUncheck: () => void;
}

export default function MilestoneDetailModal({
  isVisible,
  onClose,
  milestone,
  achieved,
  onUncheck,
}: MilestoneDetailModalProps) {
  const IconComponent = MILESTONE_ICONS[milestone.icon] || CheckCircle2;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
                <View className="flex-row items-center gap-3">
                  <View className="bg-amber-500/20 p-2 rounded-xl">
                    <IconComponent size={24} color="#F59E0B" fill="#F59E0B" />
                  </View>
                  <Text className="text-white text-2xl font-bold">{milestone.title}</Text>
                </View>
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
                  {/* Description */}
                  <View className="mb-6">
                    <Text className="text-slate-400 text-base leading-6">
                      {milestone.description}
                    </Text>
                  </View>

                  {/* Achievement Date */}
                  <View className="mb-6">
                    <View className="flex-row items-center mb-3">
                      <Calendar size={20} color="#F59E0B" />
                      <Text className="text-amber-400 text-sm font-medium ml-2">
                        Achievement Date
                      </Text>
                    </View>
                    <View className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                      <Text className="text-white text-lg font-semibold">
                        {formatDate(achieved.achieved_at)}
                      </Text>
                    </View>
                  </View>

                  {/* Photo */}
                  {achieved.photo_url && (
                    <View className="mb-6">
                      <View className="flex-row items-center mb-3">
                        <Camera size={20} color="#F59E0B" />
                        <Text className="text-amber-400 text-sm font-medium ml-2">
                          Photo
                        </Text>
                      </View>
                      <Image
                        source={{ uri: achieved.photo_url }}
                        className="w-full h-64 rounded-2xl"
                        contentFit="cover"
                        transition={500}
                        cachePolicy="memory-disk"
                      />
                    </View>
                  )}

                  {/* Notes */}
                  {achieved.notes && (
                    <View className="mb-6">
                      <Text className="text-amber-400 text-sm font-medium mb-3">
                        Notes
                      </Text>
                      <View className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                        <Text className="text-white text-base leading-6">
                          {achieved.notes}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Uncheck Button */}
                  <TouchableOpacity
                    onPress={onUncheck}
                    className="mt-4"
                  >
                    <View className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex-row items-center justify-center">
                      <Trash2 size={20} color="#EF4444" />
                      <Text className="text-red-400 font-bold text-base ml-2">
                        Uncheck Milestone
                      </Text>
                    </View>
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

