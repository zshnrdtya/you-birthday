"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw, MessageCircle, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface Lantern {
  id: number;
  x: number;
  duration: number;
  delay: number;
  size: number;
  text?: string;
}

export default function GrandFinaleOutro() {
  const [wish, setWish] = useState("");
  const [isLaunched, setIsLaunched] = useState(false);
  const [lanterns, setLanterns] = useState<Lantern[]>([]);

  // Multi-stage fireworks & festive explosion
  const triggerGrandFireworks = useCallback(() => {
    // 1. Initial center golden burst
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#fbbf24", "#f59e0b", "#ec4899", "#a855f7", "#38bdf8"],
    });

    // 2. Left and Right cannon salvos
    const end = Date.now() + 1800;
    const colors = ["#c084fc", "#f472b6", "#fbbf24", "#60a5fa", "#34d399"];

    const interval: NodeJS.Timeout = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });
    }, 250);
  }, []);

  const handleLaunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLaunched(true);

    // Generate 12 glowing sky lanterns floating up
    const newLanterns: Lantern[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80, // percentage across screen
      duration: 5.5 + Math.random() * 3.5, // float speed
      delay: Math.random() * 1.8,
      size: 28 + Math.random() * 18,
      text: i === 0 && wish.trim() ? wish : undefined,
    }));
    setLanterns(newLanterns);

    triggerGrandFireworks();
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSendToWhatsApp = () => {
    const finalWishText = wish.trim()
      ? `"${wish.trim()}"`
      : '"Semoga selalu sehat, bahagia terus, dan segala impian tercapai!"';

    const message = encodeURIComponent(
      `Halo Radit! Aku udah sampai di akhir websitenya dan udah nerbangin lampion harapan nih 🏮✨\n\nHarapanku: ${finalWishText}\n\nMakasih banyak ya buat kejutannya, berkesan dan seru banget websitenya! 🥹💜`
    );

    window.open(`https://wa.me/6281946315326?text=${message}`, "_blank");
  };

  return (
    <>
      {/* ── Sky Lanterns Overlay Animation ── */}
      <AnimatePresence>
        {isLaunched && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {lanterns.map((l) => (
              <motion.div
                key={l.id}
                initial={{
                  y: "110vh",
                  x: `${l.x}vw`,
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  y: "-20vh",
                  x: [
                    `${l.x}vw`,
                    `${l.x + (Math.random() * 8 - 4)}vw`,
                    `${l.x}vw`,
                  ],
                  opacity: [0, 0.95, 1, 0.85, 0],
                  scale: [0.7, 1.05, 1, 0.9],
                }}
                transition={{
                  duration: l.duration,
                  delay: l.delay,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute flex flex-col items-center select-none"
              >
                {/* Glowing Sky Lantern Visual */}
                <div
                  className="relative flex items-center justify-center rounded-2xl shadow-2xl"
                  style={{
                    width: l.size * 1.2,
                    height: l.size * 1.5,
                    background:
                      "linear-gradient(180deg, #ffedd5 0%, #fde047 35%, #f97316 85%, #dc2626 100%)",
                    boxShadow:
                      "0 0 24px rgba(251, 191, 36, 0.8), 0 0 45px rgba(249, 115, 22, 0.5)",
                    borderRadius: "40% 40% 45% 45% / 50% 50% 40% 40%",
                  }}
                >
                  {/* Lantern Fire Glow Core */}
                  <div
                    className="w-3 h-4 bg-amber-100 rounded-full animate-pulse opacity-90 shadow-md -mb-2"
                    style={{ borderRadius: "50% 50% 40% 40%" }}
                  />
                </div>

                {/* Optional wish label on main lantern */}
                {l.text && (
                  <div className="mt-1.5 px-2 py-0.5 rounded-full bg-purple-950/80 text-amber-200 text-[10px] font-medium backdrop-blur-xs border border-amber-300/60 max-w-[140px] truncate shadow-md">
                    ✨ {l.text}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Finale Section Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm rounded-3xl p-6 sm:p-7 text-center glass-card mt-8 flex flex-col items-center select-none relative overflow-hidden"
        style={{
          boxShadow: "0 16px 45px rgba(168, 85, 247, 0.2)",
          background: "rgba(255, 255, 255, 0.78)",
        }}
      >
        <AnimatePresence mode="wait">
          {!isLaunched ? (
            /* ── STAGE 1: Wish Input Form ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center space-y-4"
            >
              {/* Header */}
              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100/90 text-amber-900 border border-amber-300/70 shadow-2xs">
                  🏮 Grand Finale • Pelepasan Harapan
                </span>
                <h3 className="text-xl font-extrabold text-purple-950 tracking-tight">
                  Tulis 1 Harapanmu ke Langit 🌟
                </h3>
                <p className="text-xs text-purple-700/80 leading-relaxed max-w-xs mx-auto">
                  Sebelum perjalanan ini berakhir, tulis 1 doa atau harapan terbaik kamu untuk tahun ini, lalu kita terbangkan bersama lampion ke langit semesta!
                </p>
              </div>

              {/* Input Wish Box */}
              <form onSubmit={handleLaunch} className="w-full space-y-3 pt-1">
                <div className="relative">
                  <textarea
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder="Tulis harapanmu di sini... (contoh: semoga selalu bahagia, lancar segala urusan, & sehat terus! ✨)"
                    rows={3}
                    maxLength={160}
                    className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-purple-200 text-xs text-purple-950 placeholder-purple-400/80 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all shadow-inner resize-none"
                  />
                  <span className="absolute bottom-2.5 right-3 text-[10px] text-purple-400/70 font-mono">
                    {wish.length}/160
                  </span>
                </div>

                {/* Launch Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #a855f7 100%)",
                    boxShadow: "0 8px 24px rgba(236, 72, 153, 0.35)",
                  }}
                >
                  <Send size={15} />
                  <span>Terbangkan Lampion & Kembang Api 🏮🎆</span>
                </motion.button>
              </form>
            </motion.div>
          ) : (
            /* ── STAGE 2: Final Heartfelt Outro Note ── */
            <motion.div
              key="revealed-note"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="w-full flex flex-col items-center space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl select-none"
              >
                🏮✨
              </motion.div>

              {/* Outro Header */}
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
                  ✨ Harapan Terkirim ke Semesta ✨
                </span>
                <h3 className="text-xl font-extrabold text-purple-950 tracking-tight">
                  Happy Birthday, Zalfa! 🎂🤍
                </h3>
              </div>

              {/* Wish summary quote if user typed something */}
              {wish.trim() && (
                <div className="w-full p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-left shadow-2xs">
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                    🏮 Doa yang Kamu Terbangkan:
                  </p>
                  <p className="text-xs text-purple-950 italic leading-relaxed">
                    &ldquo;{wish.trim()}&rdquo;
                  </p>
                </div>
              )}

              {/* Final Heartfelt Letter Note */}
              <div className="w-full p-4 rounded-2xl bg-white/75 border border-purple-100 text-xs text-purple-900/90 leading-relaxed text-justify space-y-2.5 shadow-2xs">
                <p>
                  <i>The website tour ends here, but your best year is just getting started!</i> 🌟
                </p>
                <p>
                  Terima kasih banyak udah menjadi sosok yang luar biasa, berharga, dan selalu mencerahkan suasana. Semoga di umur baru ini setiap harinya selalu diisi sama kabar baik, rezeki yang melimpah, dan alasan buat lu tersenyum.
                </p>
                <p className="text-center font-bold text-purple-900 pt-1">
                  Enjoy your very special day, Zalfa Ramadani! 🎉💜
                </p>
                <div className="pt-2 text-center border-t border-purple-100 flex items-center justify-center gap-1.5 text-purple-700 text-[11px] font-semibold italic">
                  <Heart size={13} className="text-pink-500 fill-pink-500" />
                  <span>from Raditya Rai Zeeshan</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2 pt-1">
                {/* Send to WhatsApp with the Wish */}
                <motion.button
                  onClick={handleSendToWhatsApp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    boxShadow: "0 8px 24px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <MessageCircle size={17} />
                  <span>Kirim Harapan Ini ke WA Raditya 💬</span>
                </motion.button>

                {/* Secondary row */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  <motion.button
                    onClick={triggerGrandFireworks}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-800 bg-white/70 hover:bg-white active:scale-95 transition-all border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Kembang Api 🎆</span>
                  </motion.button>

                  <motion.button
                    onClick={handleScrollToTop}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-800 bg-white/70 hover:bg-white active:scale-95 transition-all border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={14} className="text-purple-600" />
                    <span>Putar Ulang 🔁</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
