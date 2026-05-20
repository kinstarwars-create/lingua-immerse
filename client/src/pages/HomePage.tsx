import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Zap, BookOpen, Headphones, Brain } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const { podcasts, readingMaterials, allVocabulary, setCurrentTab } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const unknownCount = allVocabulary.filter(v => v.difficulty === 'unknown').length;
  const learningCount = allVocabulary.filter(v => v.difficulty === 'learning').length;
  const knownCount = allVocabulary.filter(v => v.difficulty === 'known').length;

  const stats = [
    { icon: Headphones, label: 'Podcasts', value: podcasts.length, color: 'from-blue-500/20 to-blue-600/10' },
    { icon: BookOpen, label: 'Reading', value: readingMaterials.length, color: 'from-purple-500/20 to-purple-600/10' },
    { icon: Brain, label: 'Vocabulary', value: allVocabulary.length, color: 'from-green-500/20 to-green-600/10' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pb-24 bg-background"
    >
      {/* Hero section */}
      <div
        className="relative h-64 bg-cover bg-center flex items-end overflow-hidden"
        style={{
          backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663679142156/d75CgPcicsVtCfc3XgLVLJ/hero-bg-hopY6T4f7CwaTGwPj5b3Pf.webp)',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Content */}
        <motion.div
          variants={itemVariants}
          className="relative z-10 px-4 py-6 w-full"
        >
          <h1 className="text-3xl font-bold brand-font mb-2">LinguaImmerse</h1>
          <p className="text-sm text-muted-foreground">Immerse yourself in authentic English</p>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-8">
        {/* Quick stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <motion.button
              key={label}
              onClick={() => {
                if (label === 'Podcasts') setCurrentTab('podcast');
                if (label === 'Reading') setCurrentTab('reading');
                if (label === 'Vocabulary') setCurrentTab('vocabulary');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'tween' as any, duration: 0.2 }}
              className={`bg-gradient-to-br ${color} border border-border/50 rounded-xl p-4 text-center hover:border-border transition-colors`}
            >
              <Icon size={24} className="mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Vocabulary progress */}
        <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Brain size={18} />
              Vocabulary Progress
            </h3>
            <TrendingUp size={18} className="text-primary" />
          </div>

          {/* Progress bars */}
          <div className="space-y-3">
            {[
              { label: 'Unknown', count: unknownCount, color: 'bg-red-500/50', total: unknownCount + learningCount + knownCount },
              { label: 'Learning', count: learningCount, color: 'bg-amber-500/50', total: unknownCount + learningCount + knownCount },
              { label: 'Known', count: knownCount, color: 'bg-green-500/50', total: unknownCount + learningCount + knownCount },
            ].map(({ label, count, color, total }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="h-2 bg-card-foreground/10 rounded-full overflow-hidden">
                  <motion.div
                    className={color}
                    initial={{ width: 0 }}
                    animate={{ width: total > 0 ? `${(count / total) * 100}%` : 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-xl p-4">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          
          {podcasts.length === 0 && readingMaterials.length === 0 ? (
            <div className="text-center py-8">
              <Zap size={32} className="mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-4">No content yet. Start learning!</p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="w-full"
              >
                <Plus size={18} className="mr-2" />
                Add Content
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {podcasts.slice(0, 2).map(podcast => (
                <motion.div
                  key={podcast.id}
                  whileHover={{ x: 4 }}
                  className="p-3 bg-card-foreground/5 rounded-lg cursor-pointer hover:bg-card-foreground/10 transition-colors"
                >
                  <p className="text-sm font-medium truncate">{podcast.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Podcast</span>
                    <div className="h-1 w-16 bg-card-foreground/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${podcast.progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              {readingMaterials.slice(0, 2).map(material => (
                <motion.div
                  key={material.id}
                  whileHover={{ x: 4 }}
                  className="p-3 bg-card-foreground/5 rounded-lg cursor-pointer hover:bg-card-foreground/10 transition-colors"
                >
                  <p className="text-sm font-medium truncate">{material.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Reading</span>
                    <div className="h-1 w-16 bg-card-foreground/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${material.progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to action */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-xl p-6 text-center"
        >
          <h3 className="font-semibold mb-2">Ready to immerse yourself?</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first podcast or reading material to start learning</p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-gradient-brand hover:shadow-lg hover:shadow-primary/50"
          >
            <Plus size={18} className="mr-2" />
            Get Started
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
