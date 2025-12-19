import api from './api';

export interface AchievedMilestone {
  id: number;
  milestone_id: number;
  baby_id: number;
  achieved_at: string;
  photo_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MilestoneWithStatus {
  milestone: {
    id: number;
    title: string;
    description: string;
    expectedMonth: number;
    icon: string;
    category: string;
  };
  achieved?: AchievedMilestone;
  status: 'locked' | 'achieved' | 'next';
}

export async function getAchievedMilestones(babyId: number): Promise<AchievedMilestone[]> {
  try {
    const response = await api.get(`/babies/${babyId}/milestones`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return []; // No milestones achieved yet
    }
    throw error;
  }
}

export async function markMilestoneAchieved(
  babyId: number,
  milestoneId: number,
  achievedAt: string,
  photoUri?: string,
  notes?: string
): Promise<AchievedMilestone> {
  try {
    const formData = new FormData();
    formData.append('milestone_id', milestoneId.toString());
    formData.append('achieved_at', achievedAt);
    if (notes) {
      formData.append('notes', notes);
    }
    if (photoUri) {
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'milestone-photo.jpg',
      } as any);
    }

    const response = await api.post(`/babies/${babyId}/milestones`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteMilestoneRecord(babyId: number, achievedMilestoneId: number): Promise<void> {
  try {
    await api.delete(`/babies/${babyId}/milestones/${achievedMilestoneId}`);
  } catch (error) {
    throw error;
  }
}

