import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useBaby } from '../../context/BabyContext';
import { getGrowthHistory, GrowthRecord } from '../../services/growth';
import GrowthChart from '../../components/GrowthChart';

type ChartType = 'weight' | 'height';

interface ChartDataPoint {
  value: number;
  label: string;
  date: string;
}

export default function GrowthScreen() {
  const { currentBaby } = useBaby();
  const [chartType, setChartType] = useState<ChartType>('weight');
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);

  useEffect(() => {
    if (currentBaby) {
      loadGrowthData();
    }
  }, [currentBaby]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (currentBaby) {
        loadGrowthData();
      }
    }, [currentBaby])
  );

  const loadGrowthData = async () => {
    if (!currentBaby) return;

    setIsLoading(true);
    try {
      const records = await getGrowthHistory(currentBaby.id);
      // Backend now returns ASC order, but ensure it's sorted correctly
      const sorted = records.sort((a, b) => 
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
      );
      setGrowthRecords(sorted);
    } catch (error) {
      console.error('Error loading growth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIX: Force values to be Numbers to prevent invisible lines
  const getChartData = (): ChartDataPoint[] => {
    const seenMonths = new Set<string>();
    
    return growthRecords.map(record => {
      const date = new Date(record.recorded_at);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const monthYear = `${month} ${date.getFullYear()}`;
      
      const rawValue = chartType === 'weight' ? record.weight : record.height;

      // Only show label for the first record of each month
      let label = '';
      if (!seenMonths.has(monthYear)) {
        label = month;
        seenMonths.add(monthYear);
      }

      return {
        value: parseFloat(String(rawValue)), // ⚠️ Critical Fix: Parse string "8.11" to number 8.11
        label: label,
        date: date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      };
    });
  };

  const formatValue = (value: number): string => {
    return chartType === 'weight' ? `${value} kg` : `${value} cm`;
  };

  const renderHistoryItem = ({ item }: { item: GrowthRecord }) => {
    const date = new Date(item.recorded_at);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return (
      <View className="flex-row items-center justify-between py-4 border-b border-slate-800/50">
        <Text className="text-slate-400 text-base">{formattedDate}</Text>
        <Text className="text-white text-lg font-semibold">
          {formatValue(chartType === 'weight' ? item.weight : item.height)}
        </Text>
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

  const chartData = getChartData();

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-white text-3xl font-bold mb-6">Growth Journey</Text>
          
          {/* Segmented Control */}
          <View className="flex-row bg-slate-900/80 rounded-2xl p-1 border border-slate-800">
            <TouchableOpacity
              onPress={() => setChartType('weight')}
              className={`flex-1 py-3 rounded-xl items-center transition-all ${
                chartType === 'weight' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20' : ''
              }`}
            >
              <Text className={`font-semibold ${chartType === 'weight' ? 'text-white' : 'text-slate-400'}`}>
                Weight
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setChartType('height')}
              className={`flex-1 py-3 rounded-xl items-center transition-all ${
                chartType === 'height' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20' : ''
              }`}
            >
              <Text className={`font-semibold ${chartType === 'height' ? 'text-white' : 'text-slate-400'}`}>
                Height
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : chartData.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
             {/* Empty State */}
            <Animated.View 
              entering={FadeInDown.duration(600).springify()}
              className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 items-center w-full"
            >
              <Text className="text-slate-400 text-lg mb-2 text-center font-medium">
                No Data Yet
              </Text>
              <Text className="text-slate-500 text-sm text-center">
                Add your first measurement to see the magic.
              </Text>
            </Animated.View>
          </View>
        ) : (
          <View className="flex-1">
            {/* Chart Section */}
            <View className="px-6 mb-6">
               {/* NOTE: Ensure your src/components/GrowthChart.tsx 
                   file is updated with the code I sent in the previous turn!
               */}
              <GrowthChart 
                data={chartData} 
                type={chartType}
                onPointPress={(item) => setSelectedPoint(item)}
              />
            </View>

            {/* History List */}
            <Animated.View 
              entering={FadeInDown.delay(200).duration(600).springify()}
              className="flex-1 mx-6 mb-0"
            >
              <View className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-t-3xl p-6 flex-1">
                <Text className="text-white text-xl font-bold mb-4">History</Text>
                <FlatList
                  data={[...growthRecords].reverse()}
                  renderItem={renderHistoryItem}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              </View>
            </Animated.View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}