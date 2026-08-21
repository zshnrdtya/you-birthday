
"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Delete } from "lucide-react";

// Aggressive Lazy Loading for Steps 2, 3 and Music (Loaded ONLY when unlocked)
const GiftBoxSection = dynamic(() => import("./GiftBoxSection"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-10 h-10 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
    </div>
  ),
});

const BackgroundMusic = dynamic(() => import("./BackgroundMusic"), {
  ssr: false,
});

const CORRECT_PIN = "050909";
const PIN_LENGTH = 6;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

/**
 * PasscodeFlow (Heavily Optimized Client Component)
 * - Step 1: Lightweight Passcode Screen (CSS-driven, ultra-fast TBT)
 * - Step 2: Pop-up overlay
 * - Step 3: Lazy-loaded GiftBoxSection
 */
export default function PasscodeFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

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

      {/* ── STEP 1: Passcode Screen (Lightweight & Instant LCP/FCP) ── */}
      {step === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300">
          <div
            className={`w-full max-w-sm rounded-3xl p-7 sm:p-8 flex flex-col items-center gap-6 glass-card shadow-lg ${
              shake ? "animate-shake" : ""
            }`}
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-sky-900 tracking-tight">
                Untuk Kamu, Zalfa Ramadani 💙
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-sky-700/80">
                Masukkan kode rahasianya
              </p>
            </div>

            {/* PIN Dots */}
            <div className="flex gap-3">
              {Array.from({ length: PIN_LENGTH }, (_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-150 ${
                    i < entered.length
                      ? error
                        ? "bg-red-400 border-red-400 scale-110"
                        : "bg-sky-500 border-sky-500 scale-105"
                      : "bg-transparent border-sky-400/60"
                  }`}
                />
              ))}
            </div>

            {/* Error message */}
            {error ? (
              <p className="text-xs sm:text-sm text-red-500 font-medium -mt-2 animate-pulse">
                Kode salah, coba lagi ✗
              </p>
            ) : (
              <div className="h-4 -mt-2" />
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {KEYS.map((key, idx) => {
                if (key === "") return <div key={idx} />;
                if (key === "⌫") {
                  return (
                    <button
                      key={idx}
                      onClick={handleDelete}
                      type="button"
                      className="flex items-center justify-center h-13 sm:h-14 rounded-2xl text-sky-700 bg-white/30 hover:bg-white/50 active:scale-95 transition-all border border-white/50"
                      aria-label="Hapus"
                    >
                      <Delete size={20} />
                    </button>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleKey(key)}
                    type="button"
                    className="flex items-center justify-center h-13 sm:h-14 rounded-2xl text-xl font-semibold text-sky-900 bg-white/40 hover:bg-white/60 active:scale-95 transition-all border border-white/60 shadow-sm"
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            <p className="text-xs text-sky-600/70 text-center italic">
              Petunjuk: 050909 🗓
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Birthday Pop-up Overlay ── */}
      {step === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300">
          <div
            className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center gap-6 glass-popup shadow-2xl animate-fade-in"
            style={{ boxShadow: "0 12px 40px rgba(56, 132, 255, 0.18)" }}
          >
            <div className="text-5xl animate-bounce select-none">
              ✨🎂✨
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-900 tracking-tight leading-tight">
                HAPPY BIRTHDAY ZALFAAAA 🎉✨
              </h2>
              <p className="text-xs sm:text-sm text-sky-700/85 leading-relaxed">
                Cieee yang umurnya nambah! Gua udah nyiapin kejutan kecil nih khusus buat lu hari ini, dibuka dan semoga suka yaa 💙
              </p>
            </div>

            <button
              onClick={() => setStep(3)}
              type="button"
              className="w-full py-3.5 px-6 rounded-2xl font-semibold text-white shadow-lg active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                boxShadow: "0 8px 24px rgba(56, 189, 248, 0.35)",
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
