import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function BlindListeningPage() {
  const { blindTests, podcasts, addBlindTest, updateBlindTest } = useApp();
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [testStarted, setTestStarted] = useState(false);

  const handleStartTest = (podcastId: string) => {
    const testId = `test-${Date.now()}`;
    const podcast = podcasts.find(p => p.id === podcastId);
    
    if (podcast) {
      // Create mock test questions
      const mockTest = {
        id: testId,
        episodeId: podcastId,
        questions: [
          {
            id: '1',
            audioClip: podcast.audioUrl,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
          },
          {
            id: '2',
            audioClip: podcast.audioUrl,
            options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 2,
          },
          {
            id: '3',
            audioClip: podcast.audioUrl,
            options: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
            correctAnswer: 1,
          },
        ],
      };
      
      addBlindTest(mockTest);
      setActiveTest(testId);
      setTestStarted(true);
      setCurrentQuestion(0);
      setScore(0);
    }
  };

  const handleAnswerQuestion = (selectedOption: number) => {
    const test = blindTests.find(t => t.id === activeTest);
    if (test) {
      const question = test.questions[currentQuestion];
      if (selectedOption === question.correctAnswer) {
        setScore(score + 1);
      }

      if (currentQuestion < test.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Test finished
        const finalScore = selectedOption === question.correctAnswer ? score + 1 : score;
        updateBlindTest(activeTest!, {
          score: Math.round((finalScore / test.questions.length) * 100),
          completedAt: Date.now(),
        });
        setTestStarted(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as any, stiffness: 300, damping: 25 },
    },
  };

  if (testStarted && activeTest) {
    const test = blindTests.find(t => t.id === activeTest);
    if (test) {
      const question = test.questions[currentQuestion];
      return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'tween' as any }}
        className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pb-24"
        >
          {/* Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663679142156/d75CgPcicsVtCfc3XgLVLJ/blind-test-bg-kwYtJfh7gUymVwEeptM4aq.png)',
              backgroundSize: 'cover',
            }}
          />

          <div className="relative z-10 w-full max-w-md">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Question {currentQuestion + 1} of {test.questions.length}</span>
                <span className="text-sm text-muted-foreground">Score: {score}</span>
              </div>
              <div className="h-2 bg-card-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-brand"
                  animate={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Audio player */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'tween' as any, duration: 0.3 }}
              className="bg-card border border-border/50 rounded-2xl p-6 mb-8 text-center"
            >
              <Volume2 size={48} className="mx-auto mb-4 text-primary" />
              <p className="text-sm text-muted-foreground mb-4">Listen to the audio and select the correct answer</p>
              <Button className="w-full bg-gradient-brand">
                <Play size={18} className="mr-2" />
                Play Audio
              </Button>
            </motion.div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'tween' as any, duration: 0.2 }}
                  onClick={() => handleAnswerQuestion(idx)}
                  className="w-full p-4 bg-card border border-border/50 rounded-lg hover:border-border transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                      <span className="text-xs font-semibold">{String.fromCharCode(65 + idx)}</span>
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pb-24 bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border/50 px-4 py-4 z-10">
        <h1 className="text-2xl font-bold brand-font">Blind Listening</h1>
        <p className="text-sm text-muted-foreground mt-1">Test your listening comprehension without text</p>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {podcasts.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <RotateCcw size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No podcasts available. Add podcasts to create listening tests!</p>
          </motion.div>
        ) : (
          podcasts.map(podcast => {
            const testResult = blindTests.find(t => t.episodeId === podcast.id);
            return (
              <motion.div
                key={podcast.id}
              variants={itemVariants}
              transition={{ type: 'tween' as any, duration: 0.2 }}
              className="bg-card border border-border/50 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{podcast.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{podcast.description}</p>
                  </div>
                </div>

                {testResult ? (
                  <div className="bg-card-foreground/5 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Last Score</span>
                      <span className="text-lg font-bold text-primary">{testResult.score}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(testResult.completedAt || 0).toLocaleDateString()}
                    </p>
                  </div>
                ) : null}

                <Button
                  onClick={() => handleStartTest(podcast.id)}
                  className="w-full bg-gradient-brand"
                >
                  <RotateCcw size={16} className="mr-2" />
                  {testResult ? 'Retake Test' : 'Start Test'}
                </Button>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
