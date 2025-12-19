import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface DataPoint {
  value: number;
  label: string;
  date: string;
}

interface Props {
  data: DataPoint[];
  type: 'weight' | 'height';
  onPointPress?: (item: DataPoint) => void;
}

export default function GrowthChart({ data, type, onPointPress }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);

  // Elite UI Colors
  const LINE_COLOR = '#8b5cf6'; // Violet-500
  const FILL_COLOR = '#8b5cf6'; 
  const POINTER_COLOR = '#f472b6'; // Pink-400

  // Calculate chart width and spacing - ensure equal spacing for all points
  const containerPadding = 16; // p-4 = 16px
  const outerPadding = 24; // px-6 from parent = 24px each side
  const availableWidth = screenWidth - (containerPadding * 2) - (outerPadding * 2);
  const initialSpace = 20; // Space before first point
  const endPadding = 20; // Space after last point to ensure it's fully visible
  
  // Fixed equal spacing between all points
  const fixedSpacing = 50; // Equal spacing for all points
  
  // Calculate required width: initialSpace + (n-1) * spacing + endPadding
  // This ensures the last point has space and is fully visible
  const requiredWidth = data.length > 1 
    ? initialSpace + (data.length - 1) * fixedSpacing + endPadding
    : availableWidth;
  
  // Chart width must be at least the required width to show all data
  const chartWidth = Math.max(availableWidth, requiredWidth);

  // Auto-scroll to end (newest data) when data changes
  useEffect(() => {
    if (data.length > 0 && scrollViewRef.current) {
      // Calculate the exact scroll position to reach the end
      const scrollToEnd = () => {
        if (scrollViewRef.current && chartWidth > availableWidth) {
          // Scroll to show the last point fully - add a bit extra to ensure visibility
          const scrollX = chartWidth - availableWidth + 10; // Add 10px buffer
          scrollViewRef.current.scrollTo({ x: scrollX, animated: false });
        }
      };
      
      // Try immediately and with delays to ensure chart is rendered
      scrollToEnd();
      setTimeout(scrollToEnd, 100);
      setTimeout(scrollToEnd, 300);
      setTimeout(scrollToEnd, 500);
      setTimeout(scrollToEnd, 800);
    }
  }, [data, chartWidth, availableWidth]);

  if (data.length === 0) {
    return (
      <View className="bg-slate-900/50 rounded-3xl p-4 border border-slate-800 h-64 items-center justify-center">
        <Text className="text-slate-400 text-base">No data to display</Text>
      </View>
    );
  }

  return (
    <View className="bg-slate-900/50 rounded-3xl p-4 border border-slate-800 overflow-hidden">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 0 }}
        onContentSizeChange={(contentWidth) => {
          // Scroll to end when content is loaded
          if (scrollViewRef.current && contentWidth > availableWidth) {
            const scrollX = contentWidth - availableWidth + 10; // Add buffer for last point
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({ x: scrollX, animated: false });
            }, 100);
          }
        }}
        onLayout={() => {
          // Also scroll on layout to catch any timing issues
          if (scrollViewRef.current && chartWidth > availableWidth) {
            const scrollX = chartWidth - availableWidth + 10; // Add buffer for last point
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({ x: scrollX, animated: false });
            }, 150);
          }
        }}
      >
        <LineChart
          areaChart
          curved
          data={data}
          height={250}
          width={chartWidth}
          color={LINE_COLOR}
          thickness={3}
          dataPointsColor="white"
          dataPointsRadius={5}
          startFillColor={FILL_COLOR}
          endFillColor={FILL_COLOR}
          startOpacity={0.4}
          endOpacity={0.0}
          initialSpacing={initialSpace}
          spacing={fixedSpacing}
          endSpacing={endPadding}
          noOfSections={5}
          yAxisColor="transparent"
          xAxisColor="transparent"
          yAxisIndicesColor="transparent"
          yAxisIndicesWidth={0}
          rulesColor="rgba(255,255,255,0.1)"
          yAxisTextStyle={{ color: '#94a3b8', fontSize: 12 }}
          xAxisLabelTextStyle={{ color: '#94a3b8', fontSize: 12 }}
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: 'rgba(255,255,255,0.2)',
            pointerStripWidth: 2,
            pointerColor: POINTER_COLOR,
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items: any) => {
              const item = items[0];
              return (
                <View className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-xl w-24 items-center justify-center">
                  <Text className="text-slate-400 text-xs mb-1">{item.date || ''}</Text>
                  <Text className="text-white font-bold text-lg">
                    {item.value} {type === 'weight' ? 'kg' : 'cm'}
                  </Text>
                </View>
              );
            },
          }}
        />
      </ScrollView>
    </View>
  );
}
