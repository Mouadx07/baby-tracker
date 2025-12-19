import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileSelectorScreen from '../features/profiles/ProfileSelectorScreen';
import AddBabyScreen from '../features/profiles/AddBabyScreen';
import EditBabyScreen from '../features/profiles/EditBabyScreen';
import DashboardScreen from '../features/dashboard/DashboardScreen';
import GrowthScreen from '../features/growth/GrowthScreen';
import MilestonesScreen from '../features/milestones/MilestonesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="ProfileSelector"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="ProfileSelector" 
        component={ProfileSelectorScreen}
      />
      <Stack.Screen 
        name="AddBaby" 
        component={AddBabyScreen}
      />
      <Stack.Screen 
        name="EditBaby" 
        component={EditBabyScreen}
      />
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
      />
      <Stack.Screen 
        name="Growth" 
        component={GrowthScreen}
      />
      <Stack.Screen 
        name="Milestones" 
        component={MilestonesScreen}
      />
    </Stack.Navigator>
  );
}

