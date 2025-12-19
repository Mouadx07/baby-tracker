import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator uses 10.0.2.2 to access host machine's localhost
const API_BASE_URL = 'http://192.168.1.50/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to inject Bearer token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

