import { useApp, PodcastEpisode } from '@/contexts/AppContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, ChevronDown, RotateCcw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface PodcastPlayerProps {
  episode: PodcastEpisode;
}

export default function PodcastPlayer({ episode }: PodcastPlayerProps) {
  const { isPlayerOpen, setIsPlayerOpen, playerCurrentTime, setPlayerCurrentTime, playerPlaybackRate, setPlayerPlaybackRate } = useApp();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [abRepeatStart, setAbRepeatStart] = useState<number | null>(null);
  const [abRepeatEnd, setAbRepeatEnd] = useState<number | null>(null);
  const [isAbRepeatActive, setIsAbRepeatActive] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPlayerCurrentTime(audio.currentTime);
      
      // A-B repeat logic
      if (isAbRepeatActive && abRepeatStart !== null && abRepeatEnd !== null) {
        if (audio.currentTime > abRepeatEnd) {
          audio.currentTime = abRepeatStart;
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isAbRepeatActive, abRepeatStart, abRepeatEnd, setPlayerCurrentTime]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    setPlayerCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlayerPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const setRepeatPoint = (point: 'A' | 'B') => {
    if (point === 'A') {
      setAbRepeatStart(playerCurrentTime);
    } else {
      setAbRepeatEnd(playerCurrentTime);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playbackRates = [0.75, 1, 1.25, 1.5, 2];

  return (
    <>
      {/* Mini player bar */}
      {isPlayerOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border/50 px-4 py-3 z-40">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{episode.title}</p>
              <p className="text-xs text-muted-foreground">{formatTime(playerCurrentTime)} / {formatTime(duration)}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPlayerOpen(false)}
              className="h-8 w-8 p-0"
            >
              <ChevronDown size={18} />
            </Button>
          </div>

          {/* Progress bar */}
          <Slider
            value={[playerCurrentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="h-1"
          />
        </div>
      )}

      {/* Full player drawer */}
      <AnimatePresence>
        {isPlayerOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring' as any, stiffness: 300, damping: 30 }}
            className="fixed inset-0 bottom-16 bg-card z-50 overflow-y-auto flex flex-col"
          >
            <div className="flex-1 flex flex-col p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold">Now Playing</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPlayerOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDown size={20} />
                </Button>
              </div>

              {/* Album art placeholder */}
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎙️</div>
                  <p className="text-sm text-muted-foreground">{episode.title}</p>
                </div>
              </div>

              {/* Title and description */}
              <h3 className="text-xl font-bold mb-2">{episode.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{episode.description}</p>

              {/* Progress */}
              <div className="mb-6">
                <Slider
                  value={[playerCurrentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{formatTime(playerCurrentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback controls */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.max(0, playerCurrentTime - 15);
                    }
                  }}
                  className="h-10 w-10 p-0"
                >
                  <SkipBack size={18} />
                </Button>

                <Button
                  size="lg"
                  onClick={togglePlayPause}
                  className="h-14 w-14 p-0 rounded-full bg-gradient-brand hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.min(duration, playerCurrentTime + 15);
                    }
                  }}
                  className="h-10 w-10 p-0"
                >
                  <SkipForward size={18} />
                </Button>
              </div>

              {/* A-B Repeat */}
              <div className="mb-6 p-4 bg-card-foreground/5 rounded-lg">
                <p className="text-xs font-semibold mb-3 text-muted-foreground">A-B REPEAT</p>
                <div className="flex gap-2 mb-3">
                  <Button
                    size="sm"
                    variant={abRepeatStart !== null ? 'default' : 'outline'}
                    onClick={() => setRepeatPoint('A')}
                    className="flex-1 text-xs"
                  >
                    Set A {abRepeatStart !== null && `(${formatTime(abRepeatStart)})`}
                  </Button>
                  <Button
                    size="sm"
                    variant={abRepeatEnd !== null ? 'default' : 'outline'}
                    onClick={() => setRepeatPoint('B')}
                    className="flex-1 text-xs"
                  >
                    Set B {abRepeatEnd !== null && `(${formatTime(abRepeatEnd)})`}
                  </Button>
                </div>
                {abRepeatStart !== null && abRepeatEnd !== null && (
                  <Button
                    size="sm"
                    variant={isAbRepeatActive ? 'default' : 'outline'}
                    onClick={() => setIsAbRepeatActive(!isAbRepeatActive)}
                    className="w-full text-xs"
                  >
                    {isAbRepeatActive ? '🔁 Repeating' : 'Enable Repeat'}
                  </Button>
                )}
              </div>

              {/* Playback speed */}
              <div className="mb-6 p-4 bg-card-foreground/5 rounded-lg">
                <p className="text-xs font-semibold mb-3 text-muted-foreground">PLAYBACK SPEED</p>
                <div className="grid grid-cols-5 gap-2">
                  {playbackRates.map(rate => (
                    <Button
                      key={rate}
                      size="sm"
                      variant={playerPlaybackRate === rate ? 'default' : 'outline'}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className="text-xs"
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <Volume2 size={18} className="text-muted-foreground" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.volume = parseInt(e.target.value) / 100;
                    }
                  }}
                  className="flex-1 h-2 bg-card-foreground/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={episode.audioUrl}
              crossOrigin="anonymous"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
