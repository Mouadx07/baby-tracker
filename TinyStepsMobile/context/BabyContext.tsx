import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { updateBaby as updateBabyService } from '../services/babyService';

interface Baby {
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

interface BabyContextType {
  babies: Baby[];
  currentBaby: Baby | null;
  isLoading: boolean;
  fetchBabies: () => Promise<void>;
  createBaby: (formData: FormData) => Promise<void>;
  updateBaby: (id: number, formData: FormData) => Promise<void>;
  deleteBaby: (id: number) => Promise<void>;
  selectBaby: (baby: Baby) => void;
  clearBaby: () => void;
}

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [currentBaby, setCurrentBaby] = useState<Baby | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBabies = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/babies');
      setBabies(response.data);
      
      // Auto-select first baby if none selected
      if (response.data.length > 0 && !currentBaby) {
        setCurrentBaby(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createBaby = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/babies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const newBaby = response.data;
      setBabies([...babies, newBaby]);
      
      // Auto-select the newly created baby
      setCurrentBaby(newBaby);
      
      return response.data;
    } catch (error) {
      console.error('Error creating baby:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBaby = async (id: number, formData: FormData) => {
    setIsLoading(true);
    try {
      const updatedBaby = await updateBabyService(id, formData);
      
      setBabies(babies.map(baby => baby.id === id ? updatedBaby : baby));
      
      // Update currentBaby if it's the one being edited
      if (currentBaby?.id === id) {
        setCurrentBaby(updatedBaby);
      }
      
      return updatedBaby;
    } catch (error) {
      console.error('Error updating baby:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBaby = async (id: number) => {
    setIsLoading(true);
    try {
      await api.delete(`/babies/${id}`);
      
      setBabies(babies.filter(baby => baby.id !== id));
      
      // Clear currentBaby if it's the one being deleted
      if (currentBaby?.id === id) {
        setCurrentBaby(null);
      }
    } catch (error) {
      console.error('Error deleting baby:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const selectBaby = (baby: Baby) => {
    setCurrentBaby(baby);
  };

  const clearBaby = () => {
    setCurrentBaby(null);
    setBabies([]);
  };

  return (
    <BabyContext.Provider
      value={{
        babies,
        currentBaby,
        isLoading,
        fetchBabies,
        createBaby,
        updateBaby,
        deleteBaby,
        selectBaby,
        clearBaby,
      }}
    >
      {children}
    </BabyContext.Provider>
  );
}

export function useBaby() {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
}

export type { Baby };

