
"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Delete } from "lucide-react";

// Aggressive Lazy Loading for Steps 2, 3 and Music (Loaded ONLY when unlocked)
const GiftBoxSection = dynamic(() => import("./GiftBoxSection"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-10 h-10 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
    </div>
  ),
});

const BackgroundMusic = dynamic(() => import("./BackgroundMusic"), {
  ssr: false,
});

const BACKGROUND_PHOTOS = [
  { src: "/photos/foto1.jpeg", alt: "Foto Zalfa 1" },
  { src: "/photos/foto2.jpeg", alt: "Foto Zalfa 2" },
  { src: "/photos/foto3.jpeg", alt: "Foto Zalfa 3" },
  { src: "/photos/foto4.jpeg", alt: "Foto Zalfa 4" },
  { src: "/photos/foto5.jpeg", alt: "Foto Zalfa 5" },
  { src: "/photos/foto6.jpeg", alt: "Foto Zalfa 6" },
];

const CORRECT_PIN = "050909";
const PIN_LENGTH = 6;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

/**
 * PasscodeFlow (Heavily Optimized Client Component)
 * - Step 1: Passcode Screen with Dreamy 6-Photo Slideshow Background
 * - Step 2: Pop-up overlay
 * - Step 3: Lazy-loaded GiftBoxSection
 */
export default function PasscodeFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // Slow dreamy slideshow timer (changes photo every 4 seconds)
  useEffect(() => {
    if (step !== 1) return;
    const interval = setInterval(() => {
      setCurrentPhotoIdx((prev) => (prev + 1) % BACKGROUND_PHOTOS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [step]);

  const handleKey = useCallback(
    (digit: string) => {
      if (entered.length >= PIN_LENGTH) return;
      const next = entered + digit;
      setEntered(next);
      setError(false);

      if (next.length === PIN_LENGTH) {
        setTimeout(() => {
          if (next === CORRECT_PIN) {
            setStep(2);
          } else {
            setError(true);
            setShake(true);
            setTimeout(() => {
              setShake(false);
              setEntered("");
            }, 500);
          }
        }, 150);
      }
    },
    [entered]
  );

  const handleDelete = useCallback(() => {
    setEntered((prev) => prev.slice(0, -1));
    setError(false);
  }, []);

  return (
    <>
      {/* Background Music loaded ONLY after Step 1 is cleared */}
      {step >= 2 && <BackgroundMusic autoPlayTrigger={true} />}

      {/* ── STEP 1: Passcode Screen with 9:16 Photo Frame & Purple Ambient BG ── */}
      {step === 1 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 pb-12 overflow-hidden bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950">
          {/* ── Ambient Blurred Backlight (Matches Active Photo Colors) ── */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`ambient-${currentPhotoIdx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 w-full h-full scale-125 blur-3xl filter brightness-75"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BACKGROUND_PHOTOS[currentPhotoIdx].src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
            {/* Dark/Purple Overlay gradient */}
            <div className="absolute inset-0 bg-purple-950/50 backdrop-blur-xl" />
          </div>

          {/* ── Floating 9:16 Portrait Photo Frame Container ── */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [-0.6, 0.6, -0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
            className="relative z-10 w-full max-w-[370px] aspect-[9/16] max-h-[86vh] rounded-[2.2rem] p-2 shadow-2xl flex flex-col items-center justify-between overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(192, 132, 252, 0.25) 50%, rgba(244, 114, 182, 0.3) 100%)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(168, 85, 247, 0.25)",
              border: "1.5px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            {/* The 9:16 Photo Slideshow Inside Frame */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem]">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`photo-${currentPhotoIdx}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 1.2, ease: "easeInOut" },
                    scale: { duration: 4, ease: "easeOut" },
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={BACKGROUND_PHOTOS[currentPhotoIdx].src}
                    alt={BACKGROUND_PHOTOS[currentPhotoIdx].alt}
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient Vignette over photo for card readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-transparent to-purple-950/75 pointer-events-none" />
            </div>

            {/* Top Indicator & Label inside Frame */}
            <div className="relative z-20 w-full pt-3 px-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white/90 bg-black/35 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25 shadow-xs">
                📸 {currentPhotoIdx + 1}/6 • Zalfa ✨
              </span>

              {/* Progress Dots */}
              <div className="flex items-center gap-1 bg-black/35 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
                {BACKGROUND_PHOTOS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-400 ${
                      i === currentPhotoIdx
                        ? "w-4 bg-amber-300 shadow-xs"
                        : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ── Keypad Ultra-Transparent Glass Card (Black Text & Numbers) ── */}
            <div
              className={`relative z-20 w-full p-4 sm:p-5 rounded-3xl flex flex-col items-center gap-3.5 transition-all duration-300 ${
                shake ? "animate-shake" : ""
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                border: "1.5px solid rgba(255, 255, 255, 0.75)",
                boxShadow: "0 14px 40px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.3)",
              }}
            >
              {/* Header */}
              <div className="text-center w-full">
                <h1 className="text-base sm:text-lg font-black text-black tracking-tight whitespace-nowrap">
                  Untuk Kamu, Zalfa Ramadani 💜
                </h1>
                <p className="mt-0.5 text-[11px] text-neutral-900 font-semibold">
                  Masukkan kode rahasianya
                </p>
              </div>

              {/* PIN Dots */}
              <div className="flex gap-2.5">
                {Array.from({ length: PIN_LENGTH }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 transition-all duration-150 ${
                      i < entered.length
                        ? error
                          ? "bg-red-500 border-red-500 scale-110 shadow-[0_0_8px_#f87171]"
                          : "bg-black border-black scale-105"
                        : "bg-black/10 border-neutral-900/60"
                    }`}
                  />
                ))}
              </div>

              {/* Error message */}
              {error ? (
                <p className="text-[11px] text-red-600 font-bold -mt-2 animate-pulse">
                  Kode salah, coba lagi ✗
                </p>
              ) : (
                <div className="h-2.5 -mt-2" />
              )}

              {/* Keypad (All Black Numbers) */}
              <div className="grid grid-cols-3 gap-2 w-full">
                {KEYS.map((key, idx) => {
                  if (key === "") return <div key={idx} />;
                  if (key === "⌫") {
                    return (
                      <button
                        key={idx}
                        onClick={handleDelete}
                        type="button"
                        className="flex items-center justify-center h-10 sm:h-11 rounded-xl text-black bg-white/50 hover:bg-white/80 active:scale-92 transition-all border border-white/70 shadow-2xs backdrop-blur-md"
                        aria-label="Hapus"
                      >
                        <Delete size={18} strokeWidth={2.5} />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleKey(key)}
                      type="button"
                      className="flex items-center justify-center h-10 sm:h-11 rounded-xl text-base sm:text-lg font-black text-black bg-white/50 hover:bg-white/80 active:scale-92 transition-all border border-white/70 shadow-2xs backdrop-blur-md"
                    >
                      {key}
                    </button>
                  );
                })}
              </div>

              {/* Hint */}
              <p className="text-[11px] text-black font-bold text-center italic -mt-1">
                Petunjuk: 050909 🗓
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── STEP 2: Birthday Pop-up Overlay ── */}
      {step === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300">
          <div
            className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center gap-6 glass-popup shadow-2xl animate-fade-in"
            style={{ boxShadow: "0 12px 40px rgba(168, 85, 247, 0.18)" }}
          >
            <div className="text-5xl animate-bounce select-none">
              ✨🎂✨
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-900 tracking-tight leading-tight">
                HAPPY BIRTHDAY ZALFAAAA 🎉✨
              </h2>
              <p className="text-xs sm:text-sm text-purple-700/85 leading-relaxed">
                Cieee yang umurnya nambah! Gua udah nyiapin kejutan kecil nih khusus buat lu hari ini, dibuka dan semoga suka yaa 💜
              </p>
            </div>

            <button
              onClick={() => setStep(3)}
              type="button"
              className="w-full py-3.5 px-6 rounded-2xl font-semibold text-white shadow-lg active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
                boxShadow: "0 8px 24px rgba(168, 85, 247, 0.35)",
              }}
            >
              Ada kado buat kamu 🎁
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Gift Box Section (Lazy Loaded) ── */}
      {step === 3 && (
        <main className="w-full max-w-[480px] flex flex-col items-center my-auto py-8 transition-opacity duration-500">
          <GiftBoxSection />
        </main>
      )}
    </>
  );
}
