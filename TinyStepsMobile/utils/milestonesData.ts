import { Smile, Footprints, Utensils, Baby, Heart, Eye, Hand, Speech, Activity, BookOpen, Music, Camera } from 'lucide-react-native';

export interface Milestone {
  id: number;
  title: string;
  description: string;
  expectedMonth: number;
  icon: string; // Icon name from lucide-react-native
  category: 'social' | 'motor' | 'cognitive' | 'language';
}

export const STANDARD_MILESTONES: Milestone[] = [
  {
    id: 1,
    title: 'First Smile',
    description: 'Baby\'s first social smile',
    expectedMonth: 2,
    icon: 'Smile',
    category: 'social',
  },
  {
    id: 2,
    title: 'Head Control',
    description: 'Holds head up steadily',
    expectedMonth: 3,
    icon: 'Baby',
    category: 'motor',
  },
  {
    id: 3,
    title: 'Rolling Over',
    description: 'Rolls from tummy to back',
    expectedMonth: 4,
    icon: 'Activity',
    category: 'motor',
  },
  {
    id: 4,
    title: 'First Laugh',
    description: 'Baby\'s first real laugh',
    expectedMonth: 4,
    icon: 'Heart',
    category: 'social',
  },
  {
    id: 5,
    title: 'Sitting Up',
    description: 'Sits without support',
    expectedMonth: 6,
    icon: 'Baby',
    category: 'motor',
  },
  {
    id: 6,
    title: 'First Words',
    description: 'Says "mama" or "dada"',
    expectedMonth: 6,
    icon: 'Speech',
    category: 'language',
  },
  {
    id: 7,
    title: 'Crawling',
    description: 'Starts to crawl',
    expectedMonth: 8,
    icon: 'Footprints',
    category: 'motor',
  },
  {
    id: 8,
    title: 'Pincer Grasp',
    description: 'Picks up objects with thumb and finger',
    expectedMonth: 9,
    icon: 'Hand',
    category: 'motor',
  },
  {
    id: 9,
    title: 'Standing',
    description: 'Pulls up to standing position',
    expectedMonth: 10,
    icon: 'Footprints',
    category: 'motor',
  },
  {
    id: 10,
    title: 'First Steps',
    description: 'Takes first independent steps',
    expectedMonth: 12,
    icon: 'Footprints',
    category: 'motor',
  },
  {
    id: 11,
    title: 'Self-Feeding',
    description: 'Eats finger foods independently',
    expectedMonth: 9,
    icon: 'Utensils',
    category: 'motor',
  },
  {
    id: 12,
    title: 'Waving Bye-Bye',
    description: 'Waves hello and goodbye',
    expectedMonth: 9,
    icon: 'Hand',
    category: 'social',
  },
];

// Icon mapping
export const MILESTONE_ICONS: Record<string, any> = {
  Smile,
  Footprints,
  Utensils,
  Baby,
  Heart,
  Eye,
  Hand,
  Speech,
  Activity,
  BookOpen,
  Music,
  Camera,
};

