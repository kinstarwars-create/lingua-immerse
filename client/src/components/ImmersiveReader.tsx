import { ReadingMaterial, VocabularyItem } from '@/contexts/AppContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImmersiveReaderProps {
  material: ReadingMaterial;
  onClose: () => void;
  onWordClick: (word: string, context: string) => void;
  vocabularyMap: Map<string, VocabularyItem>;
}

export default function ImmersiveReader({
  material,
  onClose,
  onWordClick,
  vocabularyMap,
}: ImmersiveReaderProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse content and highlight vocabulary
  const renderContent = () => {
    const words = material.content.split(/(\s+)/);
    return words.map((word, idx) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:—]/g, '');
      const vocab = vocabularyMap.get(cleanWord);

      if (!vocab || word.match(/^\s+$/)) {
        return (
          <span key={idx} className="break-words">
            {word}
          </span>
        );
      }

      const difficultyClass = {
        unknown: 'vocab-unknown',
        learning: 'vocab-learning',
        known: 'vocab-known',
      }[vocab.difficulty];

      return (
        <span
          key={idx}
          className={`${difficultyClass} transition-colors hover:opacity-80`}
          onClick={() => {
            setSelectedWord(word);
            onWordClick(word, material.content);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSelectedWord(word);
              onWordClick(word, material.content);
            }
          }}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, type: 'tween' as any }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex-1">
          <h2 className="font-semibold truncate">{material.title}</h2>
          <p className="text-xs text-muted-foreground">{material.author}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFocusMode(!focusMode)}
            className="h-8 w-8 p-0"
          >
            {focusMode ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
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

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <motion.div
          ref={contentRef}
          className={`reading-text max-w-2xl mx-auto transition-all duration-300 ${
            focusMode ? 'opacity-60' : 'opacity-100'
          }`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          <p className="mb-4 text-muted-foreground text-sm">
            {material.format.toUpperCase()} • {Math.ceil(material.content.length / 200)} min read
          </p>
          {renderContent()}
        </motion.div>
      </div>

      {/* Controls footer */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 px-4 py-4 pb-safe"
      >
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Font size control */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-12">Size</span>
            <div className="flex-1 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="h-8 px-2 text-xs"
              >
                A−
              </Button>
              <span className="text-xs w-8 text-center">{fontSize}px</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="h-8 px-2 text-xs"
              >
                A+
              </Button>
            </div>
          </div>

          {/* Line height control */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-12">Space</span>
            <div className="flex-1 flex items-center gap-2">
              <Button
                size="sm"
                variant={lineHeight === 1.5 ? 'default' : 'outline'}
                onClick={() => setLineHeight(1.5)}
                className="h-8 flex-1 text-xs"
              >
                Tight
              </Button>
              <Button
                size="sm"
                variant={lineHeight === 1.8 ? 'default' : 'outline'}
                onClick={() => setLineHeight(1.8)}
                className="h-8 flex-1 text-xs"
              >
                Normal
              </Button>
              <Button
                size="sm"
                variant={lineHeight === 2.2 ? 'default' : 'outline'}
                onClick={() => setLineHeight(2.2)}
                className="h-8 flex-1 text-xs"
              >
                Loose
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="h-1 bg-card-foreground/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-brand"
                initial={{ width: 0 }}
                animate={{ width: `${material.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{material.progress}% complete</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
