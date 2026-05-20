import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function ReadingPage() {
  const { readingMaterials, setCurrentReading } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    format: 'text' as const,
  });

  const handleAddReading = () => {
    if (formData.title && formData.content) {
      const newMaterial = {
        id: Date.now().toString(),
        title: formData.title,
        author: formData.author,
        content: formData.content,
        format: formData.format,
        vocabulary: [],
        progress: 0,
        completed: false,
        addedDate: Date.now(),
      };
      // Note: In real app, would use addReadingMaterial from context
      setFormData({ title: '', author: '', content: '', format: 'text' });
      setShowAddForm(false);
    }
  };

  const handleOpenReading = (materialId: string) => {
    const material = readingMaterials.find(m => m.id === materialId);
    if (material) {
      setCurrentReading(material);
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pb-24 bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border/50 px-4 py-4 z-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold brand-font">Reading</h1>
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
        {readingMaterials.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No reading materials yet. Add one to start!</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={18} className="mr-2" />
              Add Reading
            </Button>
          </motion.div>
        ) : (
          readingMaterials.map(material => (
            <motion.button
              key={material.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'tween' as any, duration: 0.2 }}
              onClick={() => handleOpenReading(material.id)}
              className="w-full text-left bg-card border border-border/50 rounded-xl p-4 hover:border-border transition-colors"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663679142156/d75CgPcicsVtCfc3XgLVLJ/reading-bg-UAX7M42BEQ6nTeF5yuGT6M.webp)',
                    backgroundSize: 'cover',
                  }}
                >
                  <BookOpen size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{material.title}</h3>
                  {material.author && (
                    <p className="text-xs text-muted-foreground truncate">by {material.author}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{material.format.toUpperCase()} • {Math.ceil(material.content.length / 200)} min</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="h-1.5 bg-card-foreground/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${material.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{material.progress}% complete</span>
                  <span>{material.vocabulary.length} words</span>
                </div>
              </div>
            </motion.button>
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
            className="w-full bg-card rounded-t-2xl p-6 pb-safe max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">Add Reading Material</h2>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-card-foreground/10 border border-border rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Author (optional)"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 bg-card-foreground/10 border border-border rounded-lg text-sm"
              />
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                className="w-full px-3 py-2 bg-card-foreground/10 border border-border rounded-lg text-sm"
              >
                <option value="text">Plain Text</option>
                <option value="epub">EPUB</option>
                <option value="pdf">PDF</option>
              </select>
              <textarea
                placeholder="Paste your content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 bg-card-foreground/10 border border-border rounded-lg text-sm"
                rows={6}
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
                onClick={handleAddReading}
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
