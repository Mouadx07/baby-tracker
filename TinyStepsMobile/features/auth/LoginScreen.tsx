import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
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

      {/* Login Form Container */}
      <View className="flex-1 justify-center px-6">
        <Animated.View 
          entering={FadeInDown.delay(200).duration(800).springify()}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </Text>
            <Text className="text-slate-400 text-base">
              Sign in to continue to TinySteps
            </Text>
          </View>

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
            className="mb-6"
          >
            <Text className="text-slate-300 mb-2 font-medium text-sm">Password</Text>
            <View className="flex-row items-center h-14 bg-slate-950 rounded-2xl px-4 border border-slate-800">
              <Lock size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Enter your password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </Animated.View>

          {/* Login Button */}
          <Animated.View entering={FadeInDown.delay(600).duration(800).springify()}>
            <TouchableOpacity
              onPress={handleLogin}
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
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            entering={FadeInDown.delay(700).duration(800).springify()}
            className="mt-6"
          >
            <TouchableOpacity onPress={() => navigation.navigate('Signup' as never)}>
              <Text className="text-slate-500 text-center text-sm">
                Don't have an account?{' '}
                <Text className="text-indigo-400 font-semibold">Sign up</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
