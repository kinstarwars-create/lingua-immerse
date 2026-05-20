import { useApp } from '@/contexts/AppContext';
import { Home, Headphones, BookOpen, Brain, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const { currentTab, setCurrentTab } = useApp();

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'podcast' as const, label: 'Podcast', icon: Headphones },
    { id: 'reading' as const, label: 'Reading', icon: BookOpen },
    { id: 'vocabulary' as const, label: 'Vocab', icon: Brain },
    { id: 'review' as const, label: 'Review', icon: RotateCcw },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = currentTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => setCurrentTab(id)}
              className="flex flex-col items-center justify-center w-16 h-16 relative group"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, type: 'tween' as any }}
            >
              {/* Active indicator background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  color: isActive ? 'rgb(79, 142, 247)' : 'rgb(148, 163, 184)',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={24} />
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{
                  opacity: isActive ? 1 : 0.6,
                  fontSize: isActive ? '11px' : '10px',
                }}
                transition={{ duration: 0.2 }}
                className="text-xs mt-1 font-medium"
              >
                {label}
              </motion.span>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/5" />
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
