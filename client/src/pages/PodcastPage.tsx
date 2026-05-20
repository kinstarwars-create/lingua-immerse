import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Play, Clock, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function PodcastPage() {
  const { podcasts, setCurrentPodcast, setIsPlayerOpen, updatePodcast } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audioUrl: '',
  });

  const handleAddPodcast = () => {
    if (formData.title && formData.audioUrl) {
      const newPodcast = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        audioUrl: formData.audioUrl,
        duration: 0,
        vocabulary: [],
        progress: 0,
        completed: false,
        addedDate: Date.now(),
      };
      // Note: In real app, would use addPodcast from context
      setFormData({ title: '', description: '', audioUrl: '' });
      setShowAddForm(false);
    }
  };

  const handlePlayPodcast = (podcastId: string) => {
    const podcast = podcasts.find(p => p.id === podcastId);
    if (podcast) {
      setCurrentPodcast(podcast);
      setIsPlayerOpen(true);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pb-24 bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border/50 px-4 py-4 z-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold brand-font">Podcasts</h1>
        <Button
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="h-8 w-8 p-0"
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {podcasts.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <Volume2 size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No podcasts yet. Add one to start learning!</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={18} className="mr-2" />
              Add Podcast
            </Button>
          </motion.div>
        ) : (
          podcasts.map(podcast => (
            <motion.div
              key={podcast.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'tween' as any, duration: 0.2 }}
              className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-border transition-colors"
            >
              {/* Thumbnail */}
              <div
                className="h-32 bg-cover bg-center relative"
                style={{
                  backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663679142156/d75CgPcicsVtCfc3XgLVLJ/podcast-cover-Ub4u9dqXdwxmmi4ov5mvWh.webp)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <Button
                  onClick={() => handlePlayPodcast(podcast.id)}
                  className="absolute bottom-3 right-3 h-10 w-10 p-0 rounded-full bg-gradient-brand hover:shadow-lg hover:shadow-primary/50"
                >
                  <Play size={18} className="ml-0.5" />
                </Button>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-2">{podcast.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{podcast.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDuration(podcast.duration)}
                  </span>
                  <span>{podcast.vocabulary.length} words</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-card-foreground/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${podcast.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{podcast.progress}% complete</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add form modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="w-full bg-card rounded-t-2xl p-6 pb-safe"
          >
            <h2 className="text-xl font-bold mb-4">Add Podcast</h2>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-card-foreground/10 border border-border rounded-lg text-sm"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-card-foreground/10 border border-border rounded-lg text-sm"
                rows={3}
              />
              <input
                type="text"
                placeholder="Audio URL"
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                className="w-full px-3 py-2 bg-card-foreground/10 border border-border rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPodcast}
                className="flex-1 bg-gradient-brand"
              >
                Add
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
