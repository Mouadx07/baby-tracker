import api from './api';

export interface GrowthRecord {
  id: number;
  baby_id: number;
  weight: number;
  height: number;
  recorded_at: string;
  created_at?: string;
  updated_at?: string;
}

export async function getLatestGrowth(babyId: number): Promise<GrowthRecord | null> {
  try {
    const response = await api.get(`/babies/${babyId}/growth/latest`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No growth records yet
    }
    throw error;
  }
}

export async function getGrowthHistory(babyId: number): Promise<GrowthRecord[]> {
  try {
    const response = await api.get(`/babies/${babyId}/growth`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

