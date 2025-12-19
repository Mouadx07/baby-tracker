import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Trophy, Calendar, Camera } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useBaby } from '../../context/BabyContext';
import { STANDARD_MILESTONES, MILESTONE_ICONS, Milestone } from '../../utils/milestonesData';
import { getAchievedMilestones, markMilestoneAchieved, deleteMilestoneRecord, AchievedMilestone, MilestoneWithStatus } from '../../services/milestones';
import MarkMilestoneModal from '../../components/MarkMilestoneModal';
import MilestoneDetailModal from '../../components/MilestoneDetailModal';

export default function MilestonesScreen() {
  const { currentBaby } = useBaby();
  const [achievedMilestones, setAchievedMilestones] = useState<AchievedMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAchieved, setSelectedAchieved] = useState<AchievedMilestone | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentBaby) {
      loadMilestones();
    }
  }, [currentBaby]);

  useFocusEffect(
    useCallback(() => {
      if (currentBaby) {
        loadMilestones();
      }
    }, [currentBaby])
  );

  const loadMilestones = async () => {
    if (!currentBaby) return;

    setIsLoading(true);
    try {
      const achieved = await getAchievedMilestones(currentBaby.id);
      setAchievedMilestones(achieved);
    } catch (error) {
      console.error('Error loading milestones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate baby's age in months
  const getBabyAgeInMonths = (): number => {
    if (!currentBaby?.birth_date) return 0;
    const birthDate = new Date(currentBaby.birth_date);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                   (today.getMonth() - birthDate.getMonth());
    return Math.max(0, months);
  };

  // Determine milestone status - compute directly to ensure it updates instantly
  const milestonesWithStatus = STANDARD_MILESTONES.map((milestone: Milestone) => {
    const achieved = achievedMilestones.find(a => a.milestone_id === milestone.id);

    if (achieved) {
      return {
        milestone,
        achieved,
        status: 'achieved' as const,
      };
    }

    // All unachieved milestones are now accessible (no "locked" status)
    return {
      milestone,
      status: 'next' as const,
    };
  });

  const achievedCount = achievedMilestones.length;
  const totalCount = STANDARD_MILESTONES.length;
  const progress = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

  const handleMilestonePress = (milestone: Milestone, status: string, achieved: AchievedMilestone | undefined) => {
    // If achieved, show detail modal
    if (status === 'achieved') {
      const foundAchieved = achieved || achievedMilestones.find(a => a.milestone_id === milestone.id);
      if (foundAchieved) {
        setSelectedMilestone(milestone);
        setSelectedAchieved(foundAchieved);
        setShowDetailModal(true);
        return;
      }
    }
    
    // For all unachieved milestones (past or future), open modal to mark as achieved
    setSelectedMilestone(milestone);
    setShowModal(true);
  };

  const handleUncheck = async () => {
    if (!selectedAchieved) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await deleteMilestoneRecord(currentBaby!.id, selectedAchieved.id);
      // Close modal first
      setShowDetailModal(false);
      setSelectedAchieved(null);
      setSelectedMilestone(null);
      // Reload data from database to ensure we have the latest state
      await loadMilestones();
    } catch (error) {
      Alert.alert('Error', 'Failed to uncheck milestone');
    }
  };

  const handleMilestoneAchieved = async (achieved: AchievedMilestone) => {
    // Close modal first
    setShowModal(false);
    setSelectedMilestone(null);
    setSelectedAchieved(null);
    // Reload data from database to ensure we have the latest state
    await loadMilestones();
  };


  // Pulsing animation component for "Next Up" milestones
  const PulsingIcon = ({ Icon, color }: { Icon: any; color: string }) => {
    const scale = useSharedValue(1);

    useEffect(() => {
      scale.value = withRepeat(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    return (
      <Animated.View style={animatedStyle}>
        <Icon size={20} color={color} />
      </Animated.View>
    );
  };

  const renderMilestoneCard = (item: MilestoneWithStatus, index: number) => {
    const { milestone, achieved, status } = item;
    const IconComponent = MILESTONE_ICONS[milestone.icon] || Trophy;
    const isLast = index === milestonesWithStatus.length - 1;

    return (
      <View key={`${milestone.id}-${status}-${achieved?.id || 'none'}`} className="flex-row">
        {/* Timeline Line */}
        <View className="items-center mr-4">
          <View className={`w-12 h-12 rounded-full items-center justify-center ${
            status === 'achieved' ? 'bg-amber-500/20 border-2 border-amber-500' :
            'bg-slate-800/40 border-2 border-slate-700 opacity-60'
          }`}>
            {status === 'achieved' ? (
              <CheckCircle2 size={20} color="#F59E0B" fill="#F59E0B" />
            ) : (
              <IconComponent size={20} color="#64748B" />
            )}
          </View>
          {!isLast && (
            <View className={`w-0.5 flex-1 ${
              status === 'achieved' ? 'bg-amber-500/30' : 'bg-slate-800'
            }`} style={{ minHeight: 60 }} />
          )}
        </View>

        {/* Milestone Card */}
        <TouchableOpacity
          onPress={() => handleMilestonePress(milestone, status, achieved)}
          className={`flex-1 mb-6 rounded-2xl border ${
            status === 'achieved' 
              ? 'bg-amber-500/10 border-amber-500 opacity-100' 
              : 'bg-slate-900/40 border-slate-800 opacity-60'
          }`}
          activeOpacity={0.7}
        >
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-white">
                {milestone.title}
              </Text>
              {status === 'achieved' && (
                <View className="bg-amber-500/20 rounded-full px-2 py-1">
                  <CheckCircle2 size={14} color="#F59E0B" fill="#F59E0B" />
                </View>
              )}
            </View>

            <Text className="text-sm mb-3 text-slate-400">
              {milestone.description}
            </Text>

            {status === 'achieved' && achieved && (
              <View className="mt-2">
                <View className="flex-row items-center mb-2">
                  <Calendar size={14} color="#F59E0B" />
                  <Text className="text-amber-400 text-xs ml-2 font-medium">
                    Achieved on {new Date(achieved.achieved_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                {achieved.photo_url && !failedImageUrls.has(achieved.photo_url) ? (
                  <View className="w-full h-32 rounded-xl mt-2 overflow-hidden bg-slate-800/50">
                    <Image
                      source={{ uri: achieved.photo_url }}
                      className="w-full h-full"
                      contentFit="cover"
                      transition={500}
                      cachePolicy="memory-disk"
                      onError={(e) => {
                        console.log("FAILED URL:", achieved.photo_url, e.error);
                        setFailedImageUrls(prev => new Set(prev).add(achieved.photo_url!));
                      }}
                    />
                  </View>
                ) : achieved.photo_url && failedImageUrls.has(achieved.photo_url) ? (
                  <View className="w-full h-32 rounded-xl mt-2 overflow-hidden bg-slate-800/50 items-center justify-center">
                    <Camera size={32} color="#64748B" />
                  </View>
                ) : null}
              </View>
            )}

            {status !== 'achieved' && (
              <View className="mt-2">
                <Text className="text-slate-400 text-xs font-medium">
                  Expected ~Month {milestone.expectedMonth}
                </Text>
                <Text className="text-slate-500 text-xs mt-1">
                  Tap to mark as achieved
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (!currentBaby) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <Text className="text-slate-400">No baby selected</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <Text className="text-white text-3xl font-bold mb-4">Development Path</Text>
            
            {/* Progress Bar */}
            <View className="mb-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-slate-400 text-sm">
                  {achievedCount} of {totalCount} Milestones Achieved
                </Text>
                <Text className="text-slate-400 text-sm">{Math.round(progress)}%</Text>
              </View>
              <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-full rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </View>
            </View>
          </Animated.View>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : (
          <View className="px-6 pb-6">
            {milestonesWithStatus.map((item, index) => (
              <Animated.View
                key={`${item.milestone.id}-${item.status}-${item.achieved?.id || 'none'}`}
                entering={FadeInDown.delay(index * 50).duration(600).springify()}
              >
                {renderMilestoneCard(item, index)}
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Mark Milestone Modal */}
      {selectedMilestone && !showDetailModal && (
        <MarkMilestoneModal
          isVisible={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedMilestone(null);
          }}
          babyId={currentBaby.id}
          milestone={selectedMilestone}
          onSuccess={handleMilestoneAchieved}
        />
      )}

      {/* Milestone Detail Modal */}
      {selectedMilestone && selectedAchieved && (
        <MilestoneDetailModal
          isVisible={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAchieved(null);
            setSelectedMilestone(null);
          }}
          milestone={selectedMilestone}
          achieved={selectedAchieved}
          onUncheck={handleUncheck}
        />
      )}
    </SafeAreaView>
  );
}

