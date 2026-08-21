"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

interface BackgroundMusicProps {
  autoPlayTrigger?: boolean;
}

/**
 * BackgroundMusic Component
 * - Plays /audio/shapeofmyheart.mp3 in loop
 * - Automatically triggers playback on first valid user interaction / unlock
 * - Provides a floating glassmorphism play/pause toggle button at top-right
 */
export default function BackgroundMusic({ autoPlayTrigger }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play when trigger is enabled (e.g. after entering PIN)
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy prevented playback until explicit click
        });
    }
  }, [autoPlayTrigger]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/shapeofmyheart.mp3"
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Glassmorphism Music Toggle Button */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.button
          onClick={toggleMusic}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg transition-all duration-300"
          style={{
            background: isPlaying
              ? "rgba(255, 255, 255, 0.5)"
              : "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: isPlaying
              ? "0 4px 20px rgba(168, 85, 247, 0.25)"
              : "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
          aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
        >
          {/* Animated Music Note / Disc */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{
              repeat: isPlaying ? Infinity : 0,
              duration: 4,
              ease: "linear",
            }}
            className="text-purple-600 flex items-center justify-center"
          >
            <Music size={15} />
          </motion.div>

          <span className="text-xs font-semibold text-purple-900 hidden sm:inline-block">
            {isPlaying ? "Shape of My Heart" : "Putar Musik"}
          </span>

          <div className="text-purple-700">
            {isPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </div>
        </motion.button>
      </motion.div>
    </>
  );
}
