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
    artist: "Backstreet Boys",
    src: "/audio/shapeofmyheart.mp3",
  },
];

/**
 * BackgroundMusic Component (Dual-Engine Audio Crossfade & Lifecycle Architecture)
 * - Track 1: Nadin Amizah - Semua Aku Dirayakan (plays once with 4s smooth fade-in from 0 volume)
 * - Track 2: Backstreet Boys - Shape of My Heart (preloaded; starts fading in 5.5s before Track 1 ends)
 * - True Overlapping Studio Crossfade (Track 1 fades 1.0 -> 0 while Track 2 fades 0 -> 1.0)
 * - Dual <audio> elements ensure zero delay, zero load gap, and zero volume resets
 * - Robust Page Lifecycle: auto-pause on tab hidden/switch, lock screen sync via MediaSession API
 * - Floating glassmorphism disc controller with live song title and audio state
 */
export default function BackgroundMusic({ autoPlayTrigger }: BackgroundMusicProps) {
  const audio1Ref = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<0 | 1>(0);

  const currentTrackIndexRef = useRef<0 | 1>(0);
  const isManuallyPausedRef = useRef(false);
  const wasPlayingBeforeHiddenRef = useRef(false);
  const isCrossfadingRef = useRef(false);
  const hasCrossfadedRef = useRef(false);

  const fadeCancel1Ref = useRef<(() => void) | null>(null);
  const fadeCancel2Ref = useRef<(() => void) | null>(null);

  // Sync index ref
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  // High precision volume ramping using performance.now + requestAnimationFrame
  const fadeVolume = useCallback(
    (
      audio: HTMLAudioElement,
      targetVol: number,
      durationMs: number,
      onComplete?: () => void
    ): (() => void) => {
      let startVol = 0;
      try {
        startVol = isFinite(audio.volume) ? audio.volume : 0;
      } catch {
        startVol = 0;
      }

      const startTime = performance.now();
      let animId: number | null = null;
      let watchdogInterval: ReturnType<typeof setInterval> | null = null;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        // Gentle sine ease curve for natural acoustic volume perception
        const easeProgress = Math.sin((progress * Math.PI) / 2);
        const current = startVol + (targetVol - startVol) * easeProgress;

        try {
          audio.volume = Number(Math.max(0, Math.min(1, current)).toFixed(3));
        } catch {
          // Ignore volume restrictions on specific mobile browsers
        }

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          try {
            audio.volume = targetVol;
          } catch {}
          if (watchdogInterval) clearInterval(watchdogInterval);
          onComplete?.();
        }
      };

      animId = requestAnimationFrame(step);

      // Fallback watchdog for background/throttled tabs
      watchdogInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        if (elapsed >= durationMs) {
          if (animId) cancelAnimationFrame(animId);
          if (watchdogInterval) clearInterval(watchdogInterval);
          try {
            audio.volume = targetVol;
          } catch {}
          onComplete?.();
        }
      }, 250);

      return () => {
        if (animId) cancelAnimationFrame(animId);
        if (watchdogInterval) clearInterval(watchdogInterval);
      };
    },
    []
  );

  // Trigger studio-grade crossfade from Track 1 (Nadin) to Track 2 (Shape of My Heart)
  const triggerCrossfade = useCallback(() => {
    const a1 = audio1Ref.current;
    const a2 = audio2Ref.current;
    if (!a1 || !a2 || isCrossfadingRef.current || hasCrossfadedRef.current) return;

    isCrossfadingRef.current = true;
    hasCrossfadedRef.current = true;

    // 1. Prepare Track 2 at volume 0 before calling play()
    try {
      a2.volume = 0;
      a2.currentTime = 0;
    } catch {}

    const playPromise = a2.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setCurrentTrackIndex(1);

          // 2. Smoothly fade out Track 1 over 4.5s
          if (fadeCancel1Ref.current) fadeCancel1Ref.current();
          fadeCancel1Ref.current = fadeVolume(a1, 0, 4500, () => {
            a1.pause();
            isCrossfadingRef.current = false;
          });

          // 3. Simultaneously smoothly fade in Track 2 over 4.5s
          if (fadeCancel2Ref.current) fadeCancel2Ref.current();
          fadeCancel2Ref.current = fadeVolume(a2, 1.0, 4500);
        })
        .catch((err) => {
          console.error("Failed to start Track 2 during crossfade:", err);
          isCrossfadingRef.current = false;
        });
    }
  }, [fadeVolume]);

  // Update MediaSession metadata whenever active track changes
  useEffect(() => {
    if ("mediaSession" in navigator && "MediaMetadata" in window) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: PLAYLIST[currentTrackIndex].title,
          artist: PLAYLIST[currentTrackIndex].artist,
          album: "Birthday Special for Zalfa",
        });
      } catch {
        // Ignore unsupported metadata errors
      }
    }
  }, [currentTrackIndex]);

  // Setup Lifecycle, timeupdate listener, and Background listeners
  useEffect(() => {
    const a1 = audio1Ref.current;
    const a2 = audio2Ref.current;
    if (!a1 || !a2) return;

    // Track 1 playback state listeners
    const handleA1Play = () => {
      if (currentTrackIndexRef.current === 0) setIsPlaying(true);
    };
    const handleA2Play = () => {
      if (currentTrackIndexRef.current === 1) setIsPlaying(true);
    };
    const handleA1Pause = () => {
      if (currentTrackIndexRef.current === 0 && !isCrossfadingRef.current) setIsPlaying(false);
    };
    const handleA2Pause = () => {
      if (currentTrackIndexRef.current === 1) setIsPlaying(false);
    };

    // Monitor Track 1 time to trigger crossfade 5.5 seconds before it finishes
    const handleA1TimeUpdate = () => {
      if (
        !hasCrossfadedRef.current &&
        !isCrossfadingRef.current &&
        isFinite(a1.duration) &&
        a1.duration > 8
      ) {
        // Trigger crossfade 5.5s before end, or at 54.5s for 60s track
        if (a1.duration - a1.currentTime <= 5.5) {
          triggerCrossfade();
        }
      }
    };

    // Safety net if Track 1 ends before crossfade completed
    const handleA1Ended = () => {
      if (!hasCrossfadedRef.current) {
        triggerCrossfade();
      }
    };

    a1.addEventListener("play", handleA1Play);
    a1.addEventListener("pause", handleA1Pause);
    a1.addEventListener("timeupdate", handleA1TimeUpdate);
    a1.addEventListener("ended", handleA1Ended);

    a2.addEventListener("play", handleA2Play);
    a2.addEventListener("pause", handleA2Pause);

    // 1. Visibility Change: Pause audio when tab is hidden / minimized / screen locked
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const activeAudio = currentTrackIndexRef.current === 0 ? a1 : a2;
        if (!activeAudio.paused) {
          wasPlayingBeforeHiddenRef.current = true;
          if (fadeCancel1Ref.current) fadeCancel1Ref.current();
          if (fadeCancel2Ref.current) fadeCancel2Ref.current();
          a1.pause();
          a2.pause();
        }
      } else {
        // Returned to tab: resume active song
        if (wasPlayingBeforeHiddenRef.current && !isManuallyPausedRef.current) {
          wasPlayingBeforeHiddenRef.current = false;
          const activeAudio = currentTrackIndexRef.current === 0 ? a1 : a2;
          activeAudio.play().catch(() => {});
        }
      }
    };

    // 2. Page Hide & Unload
    const handlePageHide = () => {
      if (fadeCancel1Ref.current) fadeCancel1Ref.current();
      if (fadeCancel2Ref.current) fadeCancel2Ref.current();
      a1.pause();
      a2.pause();
      wasPlayingBeforeHiddenRef.current = false;
    };

    // 3. MediaSession Controls
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", () => {
          isManuallyPausedRef.current = false;
          const activeAudio = currentTrackIndexRef.current === 0 ? a1 : a2;
          activeAudio.play().catch(console.error);
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          isManuallyPausedRef.current = true;
          a1.pause();
          a2.pause();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          if (currentTrackIndexRef.current === 0) {
            triggerCrossfade();
          } else {
            a2.currentTime = 0;
            a2.play().catch(console.error);
          }
        });
      } catch {}
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);
    window.addEventListener("freeze", handlePageHide);

    return () => {
      if (fadeCancel1Ref.current) fadeCancel1Ref.current();
      if (fadeCancel2Ref.current) fadeCancel2Ref.current();

      a1.removeEventListener("play", handleA1Play);
      a1.removeEventListener("pause", handleA1Pause);
      a1.removeEventListener("timeupdate", handleA1TimeUpdate);
      a1.removeEventListener("ended", handleA1Ended);

      a2.removeEventListener("play", handleA2Play);
      a2.removeEventListener("pause", handleA2Pause);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
      window.removeEventListener("freeze", handlePageHide);

      a1.pause();
      a2.pause();
    };
  }, [triggerCrossfade]);

  // Initial Auto-Play Trigger when Gift Box is opened (Zero volume before play + 4s smooth fade-in)
  useEffect(() => {
    if (autoPlayTrigger && !isManuallyPausedRef.current) {
      const a1 = audio1Ref.current;
      if (!a1) return;

      // Crucial: Set volume to 0 BEFORE calling play() to prevent sudden blast
      try {
        a1.volume = 0;
        a1.currentTime = 0;
      } catch {}

      const playPromise = a1.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setCurrentTrackIndex(0);
            if (fadeCancel1Ref.current) fadeCancel1Ref.current();
            fadeCancel1Ref.current = fadeVolume(a1, 1.0, 4000); // 4 seconds slow, velvet-smooth fade in
          })
          .catch(() => {
            // Autoplay policy prevented playback until user clicks
          });
      }
    }
  }, [autoPlayTrigger, fadeVolume]);

  // Manual Play / Pause Toggle Button
  const toggleMusic = useCallback(() => {
    const a1 = audio1Ref.current;
    const a2 = audio2Ref.current;
    if (!a1 || !a2) return;

    if (isPlaying) {
      isManuallyPausedRef.current = true;
      wasPlayingBeforeHiddenRef.current = false;
      if (fadeCancel1Ref.current) fadeCancel1Ref.current();
      if (fadeCancel2Ref.current) fadeCancel2Ref.current();
      a1.pause();
      a2.pause();
      setIsPlaying(false);
    } else {
      isManuallyPausedRef.current = false;
      const activeAudio = currentTrackIndexRef.current === 0 ? a1 : a2;

      // If starting near the beginning, provide gentle fade-in
      if (activeAudio.currentTime < 3) {
        try {
          activeAudio.volume = 0;
        } catch {}
        activeAudio
          .play()
          .then(() => {
            setIsPlaying(true);
            fadeVolume(activeAudio, 1.0, 3000);
          })
          .catch(console.error);
      } else {
        try {
          activeAudio.volume = 1.0;
        } catch {}
        activeAudio
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }
  }, [isPlaying, fadeVolume]);

  return (
    <>
      {/* Track 1: Nadin Amizah - Semua Aku Dirayakan */}
      <audio
        ref={audio1Ref}
        src="/audio/nadin amizah - semua aku di rayakan.mp3"
        preload="auto"
        loop={false}
      />

      {/* Track 2: Backstreet Boys - Shape of My Heart */}
      <audio
        ref={audio2Ref}
        src="/audio/shapeofmyheart.mp3"
        preload="auto"
        loop={true}
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
          className="flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg transition-all duration-300 cursor-pointer"
          style={{
            background: isPlaying
              ? "rgba(255, 255, 255, 0.6)"
              : "rgba(255, 255, 255, 0.35)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1.5px solid rgba(255, 255, 255, 0.75)",
            boxShadow: isPlaying
              ? "0 4px 20px rgba(168, 85, 247, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
          aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
        >
          {/* Animated Spinning Vinyl Disc */}
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

          <span className="text-xs font-semibold text-purple-900 hidden sm:inline-block max-w-[155px] truncate">
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

