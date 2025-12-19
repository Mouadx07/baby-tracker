import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Scale, Ruler, Trophy, Settings, Plus, User, ArrowUpRight, Lightbulb, ChevronRight, Award } from 'lucide-react-native';
import Animated, { ZoomIn, FadeInDown } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useBaby } from '../../context/BabyContext';
import { getLatestGrowth, getGrowthHistory, GrowthRecord } from '../../services/growth';
import { getAchievedMilestones } from '../../services/milestones';
import { STANDARD_MILESTONES } from '../../utils/milestonesData';
import { calculateDetailedAge, getMainAge, getRemainingDays } from '../../utils/date';
import SettingsModal from '../../components/dashboard/SettingsModal';
import AddGrowthRecordModal from '../../components/AddGrowthRecordModal';

export default function DashboardScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);

  const navigation = useNavigation();
  const { currentBaby } = useBaby();
  const [latestGrowth, setLatestGrowth] = useState<GrowthRecord | null>(null);
  const [previousGrowth, setPreviousGrowth] = useState<GrowthRecord | null>(null);
  const [achievedMilestones, setAchievedMilestones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentBaby) {
      loadLatestGrowth();
    }
  }, [currentBaby]);

  // Refresh when screen comes into focus (e.g., returning from Growth screen)
  useFocusEffect(
    useCallback(() => {
      if (currentBaby) {
        loadLatestGrowth();
      }
    }, [currentBaby])
  );

  const loadLatestGrowth = async () => {
    if (!currentBaby) return;
    
    setIsLoading(true);
    try {
      // Always fetch fresh data
      const growth = await getLatestGrowth(currentBaby.id);
      setLatestGrowth(growth);
      
      // Get previous record for comparison
      // History is now ordered oldest to newest, so previous is second-to-last
      const history = await getGrowthHistory(currentBaby.id);
      if (history.length > 1) {
        // Get the second-to-last record (previous to latest)
        setPreviousGrowth(history[history.length - 2]);
      } else {
        setPreviousGrowth(null);
      }

      // Load achieved milestones for next goal
      const achieved = await getAchievedMilestones(currentBaby.id);
      setAchievedMilestones(achieved);
    } catch (error) {
      console.error('Error loading growth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentBaby) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <Text className="text-slate-400">No baby selected</Text>
      </SafeAreaView>
    );
  }

  // ✅ LOGIC FIX: Cleaner Age Display
  // If the baby is very young (days only), mainAge might be "5 Days".
  // We want to avoid saying "5 Days... and 5 days old".
  const mainAge = getMainAge(currentBaby.birth_date);
  const detailedAge = calculateDetailedAge(currentBaby.birth_date);
  
  // Only show the "remaining days" line if it adds value (e.g. "3 Months" -> "...and 4 days")
  // If mainAge contains "Day", we skip the secondary line to avoid repetition.
  const showSecondaryLine = !mainAge.includes('Day') && !mainAge.includes('day');
  const remainingDays = getRemainingDays(currentBaby.birth_date);

  const weightIncreased = latestGrowth && previousGrowth && latestGrowth.weight > previousGrowth.weight;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }} // Extra padding for FAB
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
  {/* Left Side: Greeting */}
  <View className="flex-1">
    <Text className="text-slate-400 text-sm font-medium">Good Morning,</Text>
    <Text className="text-white text-2xl font-bold mt-0.5">
      {currentBaby.name}
    </Text>
  </View>
  
  <View className="flex-row items-center gap-3">
    {/* Avatar -> CLICK TO SWITCH BABY */}
    <TouchableOpacity 
      onPress={() => navigation.navigate('ProfileSelector' as never)}
      activeOpacity={0.8}
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center border-2 border-white shadow-lg shadow-indigo-500/20"
        style={{ backgroundColor: currentBaby.theme_color || '#6366F1' }}
      >
        {currentBaby.avatar_url ? (
          <Image 
            source={{ uri: currentBaby.avatar_url }} 
            className="w-full h-full rounded-full" 
            contentFit="cover"
            transition={500}
            cachePolicy="memory-disk"
            onError={(e) => console.log("⚠️ IMAGE LOAD ERROR:", e.error)}
          />
        ) : (
          <User size={24} color="white" />
        )}
      </View>
    </TouchableOpacity>
    
    {/* Gear Icon -> CLICK TO OPEN SETTINGS */}
    <TouchableOpacity 
      onPress={() => setShowSettings(true)}
      activeOpacity={0.9}
      className="w-10 h-10 items-center justify-center bg-slate-900/50 rounded-full border border-slate-800 active:bg-slate-800"
    >
      <Settings size={20} color="#94A3B8" />
    </TouchableOpacity>
  </View>
</View>

        {/* Hero Card - Age Display */}
        <Animated.View
          entering={ZoomIn.delay(200).duration(600).springify()}
          className="mx-6 mb-6"
        >
          <LinearGradient
            colors={['#4f46e5', '#7c3aed']} // Indigo-600 to Violet-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 shadow-2xl shadow-indigo-500/30 border border-white/10"
          >
            <Text className="text-indigo-100 text-base mb-1 text-center font-medium">
              You are exactly
            </Text>
            
            {/* Big Main Age (e.g., "3 Months") */}
            <Text className="text-white text-5xl font-extrabold text-center tracking-tight mb-2">
              {mainAge}
            </Text>
            
            {/* Subtext Logic */}
            {showSecondaryLine && remainingDays > 0 ? (
               <Text className="text-indigo-200 text-lg text-center font-medium">
                ...and {remainingDays} {remainingDays === 1 ? 'day' : 'days'} old today.
              </Text>
            ) : (
              <Text className="text-indigo-200 text-lg text-center font-medium">
                old today!
              </Text>
            )}
            
            {/* Tiny detail text */}
            <View className="mt-4 bg-white/10 self-center px-4 py-1.5 rounded-full">
              <Text className="text-white text-xs font-semibold tracking-wide">
                {detailedAge}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ✅ LAYOUT FIX: Stats Row (Fixed Height, not Aspect Ratio) */}
        <View className="flex-row gap-3 px-6 mb-6">
          {/* Weight Card */}
          <Animated.View entering={FadeInDown.delay(400).duration(600).springify()} className="flex-1">
            <View className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 h-32 justify-between">
              <View className="flex-row justify-between items-start">
                <View className="bg-blue-500/10 p-2 rounded-xl">
                  <Scale size={20} color="#60A5FA" />
                </View>
                {weightIncreased && <ArrowUpRight size={16} color="#10B981" />}
              </View>
              
              <View>
                <Text className="text-white text-xl font-bold" numberOfLines={1} adjustsFontSizeToFit>
                  {isLoading ? '--' : latestGrowth ? `${latestGrowth.weight}` : '--'}
                  <Text className="text-sm font-normal text-slate-400"> kg</Text>
                </Text>
                <Text className="text-slate-400 text-xs font-medium mt-1">Weight</Text>
              </View>
            </View>
          </Animated.View>

          {/* Height Card */}
          <Animated.View entering={FadeInDown.delay(500).duration(600).springify()} className="flex-1">
            <View className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 h-32 justify-between">
              <View className="flex-row justify-between items-start">
                <View className="bg-emerald-500/10 p-2 rounded-xl">
                  <Ruler size={20} color="#34D399" />
                </View>
              </View>
              
              <View>
                <Text className="text-white text-xl font-bold" numberOfLines={1} adjustsFontSizeToFit>
                  {isLoading ? '--' : latestGrowth ? `${latestGrowth.height}` : '--'}
                  <Text className="text-sm font-normal text-slate-400"> cm</Text>
                </Text>
                <Text className="text-slate-400 text-xs font-medium mt-1">Height</Text>
              </View>
            </View>
          </Animated.View>

          {/* Milestone Card */}
          <Animated.View entering={FadeInDown.delay(600).duration(600).springify()} className="flex-1">
            <View className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 h-32 justify-between">
              <View className="flex-row justify-between items-start">
                <View className="bg-amber-500/10 p-2 rounded-xl">
                  <Trophy size={20} color="#FBBF24" />
                </View>
              </View>
              
              <View>
                <Text className="text-white text-sm font-bold leading-tight" numberOfLines={2}>
                  {getNextMilestone(mainAge, achievedMilestones)}
                </Text>
                <Text className="text-slate-400 text-xs font-medium mt-1">Next Goal</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* View Growth Chart Button */}
        {!isLoading && (
          <Animated.View
            entering={FadeInDown.delay(700).duration(600).springify()}
            className="px-6 mb-4"
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Growth' as never)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#334155', '#1e293b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center justify-between p-4 rounded-2xl border border-slate-700"
              >
                <View className="flex-row items-center gap-3">
                  <View className="bg-indigo-500/20 p-2.5 rounded-xl">
                    <ArrowUpRight size={20} color="#818cf8" />
                  </View>
                  <View>
                    <Text className="text-white font-semibold text-base">Growth Trends</Text>
                    <Text className="text-slate-400 text-xs">View full charts & history</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* View Milestones Button */}
        {!isLoading && (
          <Animated.View
            entering={FadeInDown.delay(750).duration(600).springify()}
            className="px-6 mb-8"
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Milestones' as never)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#334155', '#1e293b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center justify-between p-4 rounded-2xl border border-slate-700"
              >
                <View className="flex-row items-center gap-3">
                  <View className="bg-amber-500/20 p-2.5 rounded-xl">
                    <Award size={20} color="#FBBF24" />
                  </View>
                  <View>
                    <Text className="text-white font-semibold text-base">Development Path</Text>
                    <Text className="text-slate-400 text-xs">Track milestones & achievements</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ✅ NEW SECTION: Daily Insight (Fills the Void) */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(600).springify()}
          className="px-6 mb-6"
        >
          <Text className="text-white text-lg font-bold mb-3">Daily Insight</Text>
          <View className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
            {/* Background Glow Effect */}
            <View className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <View className="flex-row gap-4">
              <View className="bg-amber-500/10 w-10 h-10 rounded-full items-center justify-center">
                <Lightbulb size={20} color="#FBBF24" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base mb-1">
                  Did you know?
                </Text>
                <Text className="text-slate-400 leading-relaxed text-sm">
                  Babies typically double their birth weight by 5 months. Keep tracking those measurements to see the progress!
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        entering={FadeInDown.delay(900).duration(600).springify()}
        className="absolute bottom-8 right-6"
      >
        <TouchableOpacity
          onPress={() => setShowAddRecord(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-indigo-500/40 border border-white/20"
          >
            <Plus size={32} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <SettingsModal 
        isVisible={showSettings} 
        onClose={() => setShowSettings(false)} 
        babyName={currentBaby.name}
        babyId={currentBaby.id}
      />
      
      {currentBaby && (
        <AddGrowthRecordModal
          isVisible={showAddRecord}
          onClose={() => setShowAddRecord(false)}
          babyId={currentBaby.id}
          onSuccess={loadLatestGrowth}
        />
      )}
    </SafeAreaView>
  );
}

// Helper function to get next unachieved milestone
function getNextMilestone(age: string, achievedMilestones: any[]): string {
  // Find the first unachieved milestone
  const achievedMilestoneIds = achievedMilestones.map(a => a.milestone_id);
  const nextMilestone = STANDARD_MILESTONES.find(
    milestone => !achievedMilestoneIds.includes(milestone.id)
  );
  
  if (nextMilestone) {
    return nextMilestone.title;
  }
  
  // If all milestones are achieved, return a completion message
  return 'All milestones achieved! 🎉';
}