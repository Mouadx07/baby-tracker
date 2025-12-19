import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigation = useNavigation();

  const handleSignup = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      // Navigation handled by App.tsx based on auth state
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.email?.[0] || 
                          'Registration failed. Please try again.';
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-950"
    >
      {/* Atmospheric Gradient Orb */}
      <Animated.View 
        entering={FadeIn.duration(1000)}
        className="absolute -top-20 -left-20 w-80 h-80"
      >
        <LinearGradient
          colors={['#7C3AED', '#4338CA']}
          className="w-full h-full rounded-full opacity-40"
          style={{ transform: [{ scale: 1.5 }] }}
        />
      </Animated.View>

      {/* Signup Form Container */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(200).duration(1000).springify()}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-white mb-2">
              Create Account
            </Text>
            <Text className="text-slate-400 text-base">
              Join TinySteps and track your baby's journey
            </Text>
          </View>

          {/* Full Name Input */}
          <Animated.View 
            entering={FadeInDown.delay(300).duration(800).springify()}
            className="mb-4"
          >
            <Text className="text-slate-300 mb-2 font-medium text-sm">Full Name</Text>
            <View className="flex-row items-center h-14 bg-slate-950 rounded-2xl px-4 border border-slate-800">
              <User size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Enter your full name"
                placeholderTextColor="#64748B"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>
          </Animated.View>

          {/* Email Input */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800).springify()}
            className="mb-4"
          >
            <Text className="text-slate-300 mb-2 font-medium text-sm">Email</Text>
            <View className="flex-row items-center h-14 bg-slate-950 rounded-2xl px-4 border border-slate-800">
              <Mail size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Enter your email"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </Animated.View>

          {/* Password Input */}
          <Animated.View 
            entering={FadeInDown.delay(500).duration(800).springify()}
            className="mb-4"
          >
            <Text className="text-slate-300 mb-2 font-medium text-sm">Password</Text>
            <View className="flex-row items-center h-14 bg-slate-950 rounded-2xl px-4 border border-slate-800">
              <Lock size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Create a password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </Animated.View>

          {/* Confirm Password Input */}
          <Animated.View 
            entering={FadeInDown.delay(600).duration(800).springify()}
            className="mb-6"
          >
            <Text className="text-slate-300 mb-2 font-medium text-sm">Confirm Password</Text>
            <View className="flex-row items-center h-14 bg-slate-950 rounded-2xl px-4 border border-slate-800">
              <Lock size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Confirm your password"
                placeholderTextColor="#64748B"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </Animated.View>

          {/* Signup Button */}
          <Animated.View entering={FadeInDown.delay(700).duration(800).springify()}>
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
              className="overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={isLoading ? ['#818CF8', '#A78BFA'] : ['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-14 items-center justify-center shadow-lg shadow-indigo-500/50"
              >
                <Text className="text-white text-lg font-semibold">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Login Link */}
          <Animated.View 
            entering={FadeInDown.delay(800).duration(800).springify()}
            className="mt-6"
          >
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Text className="text-slate-500 text-center text-sm">
                Already have an account?{' '}
                <Text className="text-indigo-400 font-semibold">Login</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

