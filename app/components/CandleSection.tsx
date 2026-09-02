"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function CandleSection() {
  const [isBlown, setIsBlown] = useState(false);

  // Trigger high-quality festive confetti explosion
  const triggerConfetti = useCallback(() => {
    try {
      // 1. Initial center burst
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#a855f7", "#ec4899", "#f472b6", "#fbbf24", "#c084fc", "#e879f9"],
        zIndex: 99999,
      });

      // 2. Left and right celebration cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.05, y: 0.65 },
          colors: ["#c084fc", "#f472b6", "#fbbf24", "#a855f7", "#38bdf8"],
          zIndex: 99999,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.95, y: 0.65 },
          colors: ["#c084fc", "#f472b6", "#fbbf24", "#a855f7", "#38bdf8"],
          zIndex: 99999,
        });
      }, 200);
    } catch (err) {
      console.error("Confetti launch failed:", err);
    }
  }, []);

  const handleBlow = () => {
    setIsBlown(true);
    triggerConfetti();
  };

  const handleRelight = () => {
    setIsBlown(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-sm rounded-3xl p-7 text-center glass-card mt-6"
      style={{
        boxShadow: "0 12px 36px rgba(168, 85, 247, 0.16)",
      }}
    >
      {/* Section Subtitle / Instructions */}
      <div className="space-y-1 mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/80 text-purple-700 border border-purple-200/60 shadow-xs">
          {isBlown ? "✨ Wish Berhasil Dikirim! ✨" : "✨ Make a Wish Dulu Yuk ✨"}
        </span>
        <h3 className="text-xl font-bold text-purple-900">
          {isBlown ? "Yeaaay! Happy Birthday! 🎉" : "Tiup Lilin Ulang Tahun 🎂"}
        </h3>
        <p className="text-xs text-purple-700/80 leading-relaxed max-w-xs mx-auto">
          {isBlown
            ? "Semoga semua doa dan harapan Zalfa segera terkabul satu per satu yaa! 🤲💜"
            : "Tutup mata sebentar, ucapin doa dan harapan terbaik lu di dalam hati, terus tiup lilinnya!"}
        </p>
      </div>

      {/* ── Visual Cake & Candle ── */}
      <div className="relative flex flex-col items-center justify-center my-4 select-none">
        {/* Glow behind candle when lit */}
        <AnimatePresence>
          {!isBlown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.15, 1] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute w-28 h-28 rounded-full pointer-events-none -top-6"
              style={{
                background: "radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(244, 114, 182, 0.15) 50%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Candle Flame / Smoke */}
        <div className="relative z-10 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isBlown ? (
              <motion.div
                key="flame"
                initial={{ scale: 0 }}
                animate={{
                  scale: [1, 1.12, 0.96, 1.08, 1],
                  rotate: [-2, 3, -1, 2, 0],
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                className="w-5 h-7 rounded-full relative cursor-pointer"
                onClick={handleBlow}
                title="Klik untuk tiup lilin"
                style={{
                  background: "radial-gradient(ellipse at bottom, #fbbf24 0%, #f97316 65%, rgba(239, 68, 68, 0.8) 100%)",
                  boxShadow: "0 0 16px #fbbf24, 0 0 28px #f43f5e",
                  borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%",
                }}
              >
                {/* Inner white flame core */}
                <div
                  className="w-2 h-3 bg-amber-100 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 opacity-90"
                  style={{ borderRadius: "50% 50% 40% 40%" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="smoke"
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: [0.8, 0.4, 0], y: -24, scale: 1.4 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-base font-bold text-gray-400 select-none pb-1"
              >
                💨
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candle Wick */}
          <div className="w-0.5 h-2.5 bg-gray-700 -mt-0.5" />

          {/* Candle Body */}
          <div
            className="w-3.5 h-10 rounded-t-sm shadow-xs relative overflow-hidden"
            style={{
              background: "repeating-linear-gradient(45deg, #c084fc, #c084fc 4px, #f472b6 4px, #f472b6 8px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            }}
          />
        </div>

        {/* Cake Illustration */}
        <div className="flex flex-col items-center -mt-1 z-0">
          {/* Cake Top Layer (Cream & Strawberries) */}
          <div
            className="w-32 h-10 rounded-t-2xl relative flex items-center justify-around px-2 shadow-xs"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fce7f3 100%)",
              borderTop: "3px solid #f472b6",
            }}
          >
            <span className="text-xs">🍓</span>
            <span className="text-[10px]">✨</span>
            <span className="text-xs">🍓</span>
            <span className="text-[10px]">✨</span>
            <span className="text-xs">🍓</span>
          </div>

          {/* Cake Bottom Layer (Sponge & Frosting) */}
          <div
            className="w-40 h-12 rounded-b-2xl relative flex items-center justify-center shadow-md overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #fbcfe8 0%, #e9d5ff 100%)",
              borderTop: "2px dashed #f472b6",
            }}
          >
            {/* Frosting Drips */}
            <div className="absolute top-0 inset-x-0 flex justify-between px-2 text-[8px] text-pink-300 select-none">
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
            <span className="text-xs font-bold tracking-wider text-purple-900/80">
              HAPPY BIRTHDAY 🎂
            </span>
          </div>

          {/* Cake Plate */}
          <div
            className="w-48 h-3 rounded-full shadow-md -mt-0.5"
            style={{
              background: "linear-gradient(90deg, #e2e8f0 0%, #ffffff 50%, #e2e8f0 100%)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="mt-6 flex flex-col items-center gap-2.5">
        {!isBlown ? (
          <motion.button
            onClick={handleBlow}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-white shadow-lg transition-transform flex items-center justify-center gap-2 text-sm"
            style={{
              background: "linear-gradient(135deg, #c084fc 0%, #ec4899 100%)",
              boxShadow: "0 8px 24px rgba(236, 72, 153, 0.35)",
            }}
          >
            <span>Tiup Lilin Sekarang</span>
            <span className="text-lg">💨</span>
          </motion.button>
        ) : (
          <div className="w-full space-y-2 animate-fade-in">
            <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/70 text-xs text-purple-900 leading-relaxed font-medium">
              ✨ <i>Doa kamu sudah terkirim ke langit semesta! Semoga tahun ini penuh berkah, tawa, dan kebahagiaan ya Zalfa!</i> 💜
            </div>

            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <motion.button
                onClick={triggerConfetti}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200/90 active:scale-95 transition-all border border-purple-300/70 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Konfeti Lagi 🎉</span>
              </motion.button>

              <motion.button
                onClick={handleRelight}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-700 bg-white/70 hover:bg-white active:scale-95 transition-all border border-purple-200/80 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Nyalakan Lilin 🕯️</span>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
