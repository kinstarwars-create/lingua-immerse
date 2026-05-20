import React, { createContext, useContext, useState } from 'react';

export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  difficulty: 'unknown' | 'learning' | 'known';
  contexts: string[]; // Sentences where word appeared
  audioTimestamps: number[]; // Timestamps in audio files
  lastReviewed?: number;
  reviewCount: number;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  transcript?: string;
  vocabulary: VocabularyItem[];
  progress: number; // 0-100
  completed: boolean;
  addedDate: number;
}

export interface ReadingMaterial {
  id: string;
  title: string;
  author?: string;
  content: string;
  format: 'epub' | 'pdf' | 'text';
  vocabulary: VocabularyItem[];
  progress: number; // 0-100
  completed: boolean;
  addedDate: number;
}

export interface BlindListeningTest {
  id: string;
  episodeId: string;
  questions: Array<{
    id: string;
    audioClip: string;
    options: string[];
    correctAnswer: number;
    userAnswer?: number;
  }>;
  score?: number;
  completedAt?: number;
}

interface AppContextType {
  // Podcasts
  podcasts: PodcastEpisode[];
  currentPodcast: PodcastEpisode | null;
  addPodcast: (podcast: PodcastEpisode) => void;
  updatePodcast: (id: string, updates: Partial<PodcastEpisode>) => void;
  setCurrentPodcast: (podcast: PodcastEpisode | null) => void;

  // Reading
  readingMaterials: ReadingMaterial[];
  currentReading: ReadingMaterial | null;
  addReadingMaterial: (material: ReadingMaterial) => void;
  updateReadingMaterial: (id: string, updates: Partial<ReadingMaterial>) => void;
  setCurrentReading: (material: ReadingMaterial | null) => void;

  // Vocabulary
  allVocabulary: VocabularyItem[];
  addVocabularyItem: (item: VocabularyItem) => void;
  updateVocabularyItem: (id: string, updates: Partial<VocabularyItem>) => void;
  getVocabularyByDifficulty: (difficulty: 'unknown' | 'learning' | 'known') => VocabularyItem[];

  // Blind Listening Tests
  blindTests: BlindListeningTest[];
  addBlindTest: (test: BlindListeningTest) => void;
  updateBlindTest: (id: string, updates: Partial<BlindListeningTest>) => void;

  // Navigation
  currentTab: 'home' | 'podcast' | 'reading' | 'vocabulary' | 'review';
  setCurrentTab: (tab: 'home' | 'podcast' | 'reading' | 'vocabulary' | 'review') => void;

  // Player state
  isPlayerOpen: boolean;
  setIsPlayerOpen: (open: boolean) => void;
  playerCurrentTime: number;
  setPlayerCurrentTime: (time: number) => void;
  playerPlaybackRate: number;
  setPlayerPlaybackRate: (rate: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [currentPodcast, setCurrentPodcast] = useState<PodcastEpisode | null>(null);
  const [readingMaterials, setReadingMaterials] = useState<ReadingMaterial[]>([]);
  const [currentReading, setCurrentReading] = useState<ReadingMaterial | null>(null);
  const [allVocabulary, setAllVocabulary] = useState<VocabularyItem[]>([]);
  const [blindTests, setBlindTests] = useState<BlindListeningTest[]>([]);
  const [currentTab, setCurrentTab] = useState<'home' | 'podcast' | 'reading' | 'vocabulary' | 'review'>('home');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [playerPlaybackRate, setPlayerPlaybackRate] = useState(1);

  const addPodcast = (podcast: PodcastEpisode) => {
    setPodcasts(prev => [...prev, podcast]);
  };

  const updatePodcast = (id: string, updates: Partial<PodcastEpisode>) => {
    setPodcasts(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const addReadingMaterial = (material: ReadingMaterial) => {
    setReadingMaterials(prev => [...prev, material]);
  };

  const updateReadingMaterial = (id: string, updates: Partial<ReadingMaterial>) => {
    setReadingMaterials(prev =>
      prev.map(m => m.id === id ? { ...m, ...updates } : m)
    );
  };

  const addVocabularyItem = (item: VocabularyItem) => {
    setAllVocabulary(prev => {
      const existing = prev.find(v => v.id === item.id);
      if (existing) {
        return prev.map(v => v.id === item.id ? { ...v, ...item } : v);
      }
      return [...prev, item];
    });
  };

  const updateVocabularyItem = (id: string, updates: Partial<VocabularyItem>) => {
    setAllVocabulary(prev =>
      prev.map(v => v.id === id ? { ...v, ...updates } : v)
    );
  };

  const getVocabularyByDifficulty = (difficulty: 'unknown' | 'learning' | 'known') => {
    return allVocabulary.filter(v => v.difficulty === difficulty);
  };

  const addBlindTest = (test: BlindListeningTest) => {
    setBlindTests(prev => [...prev, test]);
  };

  const updateBlindTest = (id: string, updates: Partial<BlindListeningTest>) => {
    setBlindTests(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const value: AppContextType = {
    podcasts,
    currentPodcast,
    addPodcast,
    updatePodcast,
    setCurrentPodcast,
    readingMaterials,
    currentReading,
    addReadingMaterial,
    updateReadingMaterial,
    setCurrentReading,
    allVocabulary,
    addVocabularyItem,
    updateVocabularyItem,
    getVocabularyByDifficulty,
    blindTests,
    addBlindTest,
    updateBlindTest,
    currentTab,
    setCurrentTab,
    isPlayerOpen,
    setIsPlayerOpen,
    playerCurrentTime,
    setPlayerCurrentTime,
    playerPlaybackRate,
    setPlayerPlaybackRate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
