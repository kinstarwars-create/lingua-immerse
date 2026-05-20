import { VocabularyItem } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, BookMarked, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface VocabularyCardProps {
  item: VocabularyItem | null;
  onClose: () => void;
  onUpdateDifficulty: (difficulty: 'unknown' | 'learning' | 'known') => void;
  position?: { x: number; y: number };
}

export default function VocabularyCard({
  item,
  onClose,
  onUpdateDifficulty,
  position,
}: VocabularyCardProps) {
  const [showContexts, setShowContexts] = useState(false);

  if (!item) return null;

  const difficultyColors = {
    unknown: 'from-red-500/20 to-red-600/10',
    learning: 'from-amber-500/20 to-amber-600/10',
    known: 'from-green-500/20 to-green-600/10',
  };

  const difficultyLabels = {
    unknown: '🔴 Unknown',
    learning: '🟡 Learning',
    known: '🟢 Known',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring' as any, stiffness: 300, damping: 25 }}
        className={`fixed z-50 w-80 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden ${
          position ? 'pointer-events-auto' : 'bottom-20 left-4 right-4 mx-auto'
        }`}
        style={position ? { left: position.x, top: position.y } : undefined}
      >
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${difficultyColors[item.difficulty]} p-4 border-b border-border/50`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-2xl font-bold brand-font">{item.word}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Reviewed {item.reviewCount} times
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Definition */}
          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Lightbulb size={16} />
              Definition
            </p>
            <p className="text-base leading-relaxed">{item.definition}</p>
          </div>

          {/* Contexts */}
          {item.contexts.length > 0 && (
            <div>
              <button
                onClick={() => setShowContexts(!showContexts)}
                className="text-sm text-muted-foreground mb-2 flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <BookMarked size={16} />
                Contexts ({item.contexts.length})
              </button>
              <AnimatePresence>
                {showContexts && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 mt-2"
                  >
                    {item.contexts.slice(0, 3).map((context, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-card-foreground/5 rounded text-xs leading-relaxed text-muted-foreground italic"
                      >
                        "{context}"
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Audio timestamps */}
          {item.audioTimestamps.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <Volume2 size={14} />
                Found in {item.audioTimestamps.length} audio(s)
              </p>
              <div className="flex flex-wrap gap-2">
                {item.audioTimestamps.slice(0, 4).map((timestamp, idx) => (
                  <button
                    key={idx}
                    className="px-2 py-1 text-xs bg-primary/20 hover:bg-primary/30 rounded transition-colors mono-font"
                  >
                    {Math.floor(timestamp / 60)}:{String(Math.floor(timestamp % 60)).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty selector */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Mark as:</p>
            <div className="grid grid-cols-3 gap-2">
              {(['unknown', 'learning', 'known'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => onUpdateDifficulty(difficulty)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    item.difficulty === difficulty
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card-foreground/10 hover:bg-card-foreground/20'
                  }`}
                >
                  {difficultyLabels[difficulty]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer stats */}
        <div className="border-t border-border/50 px-4 py-3 bg-card-foreground/5 flex justify-between text-xs text-muted-foreground">
          <span>Last reviewed: {item.lastReviewed ? new Date(item.lastReviewed).toLocaleDateString() : 'Never'}</span>
          <span className="font-mono">{item.contexts.length} contexts</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
