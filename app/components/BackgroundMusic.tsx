"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

interface BackgroundMusicProps {
  autoPlayTrigger?: boolean;
}

/**
 * BackgroundMusic Component (Robust Audio Lifecycle Management)
 * - Plays /audio/shapeofmyheart.mp3 in loop
 * - Automatically pauses when browser/tab is hidden, minimized, switched, or closed
 *   (resolves iOS Safari / Chrome background playback issue)
 * - Syncs with Page Lifecycle, visibilitychange, pagehide, and beforeunload events
 * - Syncs with MediaSession API & native audio events
 * - Floating glassmorphism play/pause toggle button at top-right
 */
export default function BackgroundMusic({ autoPlayTrigger }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isManuallyPausedRef = useRef(false);
  const wasPlayingBeforeHiddenRef = useRef(false);

  // Synchronize state and setup Page Lifecycle / Background listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Native audio event listeners for state integrity
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // 1. Visibility Change: Stop audio when user leaves tab, switches app, or locks phone
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!audio.paused) {
          wasPlayingBeforeHiddenRef.current = true;
          audio.pause();
        }
      } else {
        // User came back to the tab
        if (wasPlayingBeforeHiddenRef.current && !isManuallyPausedRef.current) {
          wasPlayingBeforeHiddenRef.current = false;
          audio.play().catch(() => {
            // Browser autoplay restrictions may block automatic resume
          });
        }
      }
    };

    // 2. Page Hide & Unload: Ensure audio is immediately paused when closing or navigating
    const handlePageHide = () => {
      audio.pause();
      wasPlayingBeforeHiddenRef.current = false;
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    };

    const handleBeforeUnload = () => {
      audio.pause();
    };

    // 3. MediaSession support (sync with OS lock screen controls)
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", () => {
          isManuallyPausedRef.current = false;
          audio.play().catch(console.error);
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          isManuallyPausedRef.current = true;
          audio.pause();
        });
        navigator.mediaSession.setActionHandler("stop", () => {
          isManuallyPausedRef.current = true;
          audio.pause();
        });
      } catch (e) {
        // Ignore unsupported action handler errors
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("freeze", handlePageHide);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("freeze", handlePageHide);

      // Explicit cleanup on unmount
      audio.pause();
    };
  }, []);

  // Auto-play trigger when unlocked (e.g. from Passcode step)
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isManuallyPausedRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy prevented playback until explicit click
        });
    }
  }, [autoPlayTrigger]);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      isManuallyPausedRef.current = true;
      wasPlayingBeforeHiddenRef.current = false;
      audioRef.current.pause();
    } else {
      isManuallyPausedRef.current = false;
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/shapeofmyheart.mp3"
        preload="auto"
        loop
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
