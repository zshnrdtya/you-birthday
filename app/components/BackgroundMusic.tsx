"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

interface BackgroundMusicProps {
  autoPlayTrigger?: boolean;
}

const PLAYLIST = [
  {
    title: "Semua Aku Dirayakan",
    artist: "Nadin Amizah",
    src: "/audio/nadin amizah - semua aku di rayakan.mp3",
  },
  {
    title: "Shape of My Heart",
    artist: "Sting",
    src: "/audio/shapeofmyheart.mp3",
  },
];

/**
 * BackgroundMusic Component (Robust Audio Lifecycle Management & Playlist Queue)
 * - Step 1: Plays /audio/nadin amizah - semua aku di rayakan.mp3 once
 * - Step 2: Automatically switches to /audio/shapeofmyheart.mp3 and loops it
 * - Automatically pauses when browser/tab is hidden, minimized, switched, or closed
 *   (resolves iOS Safari / Chrome background playback issue)
 * - Syncs with Page Lifecycle, visibilitychange, pagehide, and beforeunload events
 * - Syncs with MediaSession API & native audio events
 * - Floating glassmorphism play/pause toggle button at top-right
 */
export default function BackgroundMusic({ autoPlayTrigger }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrackIndexRef = useRef(0);
  const isManuallyPausedRef = useRef(false);
  const wasPlayingBeforeHiddenRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Smooth Audio Fade-In Helper
  const fadeInAudio = useCallback((audio: HTMLAudioElement, durationMs = 4000, targetVolume = 1.0) => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    try {
      audio.volume = 0;
    } catch {
      // iOS Safari ignores volume assignment safely
    }

    const intervalMs = 50;
    const steps = durationMs / intervalMs;
    const volumeStep = targetVolume / steps;
    let currentVol = 0;

    fadeTimerRef.current = setInterval(() => {
      currentVol = Math.min(targetVolume, currentVol + volumeStep);
      try {
        audio.volume = Number(currentVol.toFixed(3));
      } catch {
        // Fallback for restricted platforms
      }
      if (currentVol >= targetVolume) {
        if (fadeTimerRef.current) {
          clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
      }
    }, intervalMs);
  }, []);

  // Smooth Fade-Out & Transition to Shape of My Heart Helper
  const fadeOutAndSwitch = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    const startVolume = isFinite(audio.volume) && audio.volume > 0 ? audio.volume : 1.0;
    const durationMs = 3500; // 3.5s smooth fade out
    const intervalMs = 50;
    const steps = durationMs / intervalMs;
    const volumeStep = startVolume / steps;
    let currentVol = startVolume;

    fadeTimerRef.current = setInterval(() => {
      currentVol = Math.max(0, currentVol - volumeStep);
      try {
        audio.volume = Number(currentVol.toFixed(3));
      } catch {
        // Safe ignore on restricted devices
      }

      if (currentVol <= 0.02) {
        if (fadeTimerRef.current) {
          clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }

        // Switch to Next Track (Shape of My Heart)
        const nextIndex = currentTrackIndexRef.current + 1;
        if (nextIndex < PLAYLIST.length) {
          currentTrackIndexRef.current = nextIndex;
          setCurrentTrackIndex(nextIndex);
          audio.src = PLAYLIST[nextIndex].src;
          audio.loop = nextIndex === PLAYLIST.length - 1;
          try {
            audio.volume = 0;
          } catch {}
          audio.load();
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              isTransitioningRef.current = false;
              fadeInAudio(audio, 4000, 1.0); // 4s smooth fade in for Shape of My Heart
            })
            .catch((err) => {
              console.error("Error transitioning to next track:", err);
              isTransitioningRef.current = false;
            });
        }
      }
    }, intervalMs);
  }, [fadeInAudio]);

  // Keep track index ref in sync with state
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  // Update MediaSession metadata whenever current track changes
  useEffect(() => {
    if ("mediaSession" in navigator && "MediaMetadata" in window) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: PLAYLIST[currentTrackIndex].title,
          artist: PLAYLIST[currentTrackIndex].artist,
          album: "Birthday Special",
        });
      } catch (e) {
        // Ignore MediaMetadata error if unsupported
      }
    }
  }, [currentTrackIndex]);

  // Synchronize state and setup Page Lifecycle / Background listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Native audio event listeners for state integrity
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Monitor playback time to trigger early fade-out before Track 1 ends
    const handleTimeUpdate = () => {
      if (
        currentTrackIndexRef.current === 0 &&
        !isTransitioningRef.current &&
        isFinite(audio.duration) &&
        audio.duration > 8 &&
        audio.duration - audio.currentTime <= 4.8
      ) {
        fadeOutAndSwitch();
      }
    };

    // Auto-advance playlist safety net if song naturally ends
    const handleEnded = () => {
      if (isTransitioningRef.current) return;
      const nextIndex = currentTrackIndexRef.current + 1;
      if (nextIndex < PLAYLIST.length) {
        currentTrackIndexRef.current = nextIndex;
        setCurrentTrackIndex(nextIndex);
        audio.src = PLAYLIST[nextIndex].src;
        audio.loop = nextIndex === PLAYLIST.length - 1;
        try {
          audio.volume = 0;
        } catch {}
        audio.load();
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            fadeInAudio(audio, 3500, 1.0);
          })
          .catch((err) => {
            console.error("Error auto-playing next track:", err);
          });
      } else {
        // If at the end of playlist, repeat the last track
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // 1. Visibility Change: Stop audio when user leaves tab, switches app, or locks phone
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!audio.paused) {
          wasPlayingBeforeHiddenRef.current = true;
          if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
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
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      audio.pause();
      wasPlayingBeforeHiddenRef.current = false;
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    };

    const handleBeforeUnload = () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
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
          if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
          audio.pause();
        });
        navigator.mediaSession.setActionHandler("stop", () => {
          isManuallyPausedRef.current = true;
          if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
          audio.pause();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          const nextIndex = (currentTrackIndexRef.current + 1) % PLAYLIST.length;
          currentTrackIndexRef.current = nextIndex;
          setCurrentTrackIndex(nextIndex);
          audio.src = PLAYLIST[nextIndex].src;
          audio.loop = nextIndex === PLAYLIST.length - 1;
          try {
            audio.volume = 0;
          } catch {}
          audio.load();
          audio.play().then(() => {
            fadeInAudio(audio, 2500, 1.0);
          }).catch(console.error);
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          const prevIndex =
            (currentTrackIndexRef.current - 1 + PLAYLIST.length) % PLAYLIST.length;
          currentTrackIndexRef.current = prevIndex;
          setCurrentTrackIndex(prevIndex);
          audio.src = PLAYLIST[prevIndex].src;
          audio.loop = prevIndex === PLAYLIST.length - 1;
          try {
            audio.volume = 0;
          } catch {}
          audio.load();
          audio.play().then(() => {
            fadeInAudio(audio, 2500, 1.0);
          }).catch(console.error);
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
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("freeze", handlePageHide);

      // Explicit cleanup on unmount
      audio.pause();
    };
  }, [fadeInAudio, fadeOutAndSwitch]);

  // Auto-play trigger when unlocked (e.g. from Passcode step) with smooth fade-in
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isManuallyPausedRef.current) {
      const audio = audioRef.current;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fadeInAudio(audio, 4000, 1.0); // 4 seconds slow, smooth fade-in
        })
        .catch(() => {
          // Autoplay policy prevented playback until explicit click
        });
    }
  }, [autoPlayTrigger, fadeInAudio]);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (isPlaying) {
      isManuallyPausedRef.current = true;
      wasPlayingBeforeHiddenRef.current = false;
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      audio.pause();
    } else {
      isManuallyPausedRef.current = false;
      if (currentTrackIndexRef.current === 0 && audio.currentTime < 4) {
        audio.play().then(() => {
          fadeInAudio(audio, 3000, 1.0);
        }).catch(console.error);
      } else {
        try {
          audio.volume = 1.0;
        } catch {
          // safe ignore
        }
        audio.play().catch(console.error);
      }
    }
  }, [isPlaying, fadeInAudio]);

  return (
    <>
      <audio
        ref={audioRef}
        src={PLAYLIST[0].src}
        preload="auto"
        loop={false}
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

          <span className="text-xs font-semibold text-purple-900 hidden sm:inline-block max-w-[150px] truncate">
            {isPlaying ? PLAYLIST[currentTrackIndex].title : "Putar Musik"}
          </span>

          <div className="text-purple-700">
            {isPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </div>
        </motion.button>
      </motion.div>
    </>
  );
}
