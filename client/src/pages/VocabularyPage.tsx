import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function VocabularyPage() {
  const { allVocabulary, getVocabularyByDifficulty, updateVocabularyItem } = useApp();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const unknownWords = getVocabularyByDifficulty('unknown');
  const learningWords = getVocabularyByDifficulty('learning');
  const knownWords = getVocabularyByDifficulty('known');

  const tabs = [
    { id: 'unknown', label: '🔴 Unknown', words: unknownWords, color: 'text-red-500' },
    { id: 'learning', label: '🟡 Learning', words: learningWords, color: 'text-amber-500' },
    { id: 'known', label: '🟢 Known', words: knownWords, color: 'text-green-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as any, stiffness: 300, damping: 25 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pb-24 bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border/50 px-4 py-4 z-10">
        <h1 className="text-2xl font-bold brand-font mb-4">Vocabulary</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {tabs.map(({ id, label, words }) => (
            <div key={id} className="bg-card-foreground/5 rounded-lg p-2 text-center">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold">{words.length}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {allVocabulary.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <Brain size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No vocabulary yet. Start learning to build your vocabulary!</p>
          </motion.div>
        ) : (
          <Tabs defaultValue="unknown" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {tabs.map(({ id, label }) => (
                <TabsTrigger key={id} value={id} className="text-xs">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map(({ id, words }) => (
              <TabsContent key={id} value={id}>
                {words.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No words in this category yet</p>
                  </div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    className="space-y-2"
                  >
                    {words.map(word => (
                      <motion.div
                        key={word.id}
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                        transition={{ type: 'tween' as any, duration: 0.2 }}
                        className="bg-card border border-border/50 rounded-lg p-3 cursor-pointer hover:border-border transition-colors group"
                        onClick={() => setSelectedWord(word.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{word.word}</h4>
                            <p className="text-xs text-muted-foreground truncate mt-1">{word.definition}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateVocabularyItem(word.id, { difficulty: 'known' });
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-card-foreground/10 rounded"
                          >
                            <Trash2 size={16} className="text-muted-foreground" />
                          </button>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{word.contexts.length} contexts</span>
                          <span>•</span>
                          <span>Reviewed {word.reviewCount}x</span>
                          {word.audioTimestamps.length > 0 && (
                            <>
                              <span>•</span>
                              <span>In {word.audioTimestamps.length} audios</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Word detail panel */}
      {selectedWord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={() => setSelectedWord(null)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl max-w-sm w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Content will be rendered by VocabularyCard component */}
            <div className="p-6 text-center text-muted-foreground">
              <p>Word detail view</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
