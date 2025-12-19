import api from './api';

export interface Baby {
  id: number;
  user_id: number;
  name: string;
  gender: string;
  birth_date: string;
  theme_color: string;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export const updateBaby = async (id: number, formData: FormData) => {
  const response = await api.post(`/babies/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

