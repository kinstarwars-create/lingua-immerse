import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import PodcastPage from "./pages/PodcastPage";
import ReadingPage from "./pages/ReadingPage";
import VocabularyPage from "./pages/VocabularyPage";
import BlindListeningPage from "./pages/BlindListeningPage";
import PodcastPlayer from "./components/PodcastPlayer";
import ImmersiveReader from "./components/ImmersiveReader";
import VocabularyCard from "./components/VocabularyCard";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

/**
 * Design System: Deep Ocean Immersion
 * - Dark navy/purple gradient backgrounds (#0A0E1A → #1C1040)
 * - Electric blue accent (#4F8EF7) + violet (#7C3AED)
 * - Typography: Syne (brand) + Plus Jakarta Sans (UI) + Georgia (reading)
 * - Fluid animations, organic curves, immersive focus
 */

function AppContent() {
  const {
    currentTab,
    currentPodcast,
    currentReading,
    isPlayerOpen,
    updateVocabularyItem,
  } = useApp();

  const [selectedVocab, setSelectedVocab] = useState<any>(null);
  const [vocabPosition, setVocabPosition] = useState<{ x: number; y: number } | undefined>(undefined);

  // Create vocabulary map for quick lookup
  const vocabMap = new Map();
  // This would be populated with actual vocabulary data

  const handleWordClick = (word: string, context: string) => {
    // In a real app, this would fetch word definition from an API
    const mockVocab = {
      id: word.toLowerCase(),
      word,
      definition: `Definition of ${word}`,
      difficulty: 'unknown' as const,
      contexts: [context],
      audioTimestamps: [],
      reviewCount: 0,
    };
    setSelectedVocab(mockVocab);
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Main content area */}
      <div className="w-full h-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && <HomePage key="home" />}
          {currentTab === 'podcast' && <PodcastPage key="podcast" />}
          {currentTab === 'reading' && <ReadingPage key="reading" />}
          {currentTab === 'vocabulary' && <VocabularyPage key="vocabulary" />}
          {currentTab === 'review' && <BlindListeningPage key="review" />}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <BottomNav />

      {/* Podcast player */}
      {currentPodcast && (
        <PodcastPlayer episode={currentPodcast} />
      )}

      {/* Immersive reader */}
      <AnimatePresence>
        {currentReading && (
          <ImmersiveReader
            material={currentReading}
            onClose={() => {
              // Update reading progress
              updateVocabularyItem(currentReading.id, {});
            }}
            onWordClick={handleWordClick}
            vocabularyMap={vocabMap}
          />
        )}
      </AnimatePresence>

      {/* Vocabulary card */}
      <AnimatePresence>
        {selectedVocab && (
          <VocabularyCard
            item={selectedVocab}
            onClose={() => setSelectedVocab(null)}
            onUpdateDifficulty={(difficulty) => {
              updateVocabularyItem(selectedVocab.id, { difficulty });
              setSelectedVocab(null);
            }}
            position={vocabPosition}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-4">Please refresh the page</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundaryWrapper onError={() => setHasError(true)}>
      {children}
    </ErrorBoundaryWrapper>
  );
}

function ErrorBoundaryWrapper({
  children,
  onError,
}: {
  children: React.ReactNode;
  onError: () => void;
}) {
  try {
    return <>{children}</>;
  } catch (error) {
    onError();
    return null;
  }
}

export default App;
