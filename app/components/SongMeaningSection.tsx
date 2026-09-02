"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, ArrowRight, ArrowLeft } from "lucide-react";

/**
 * SongMeaningSection Component
 * - Dedicated aesthetic note explaining the stories & meaning behind both songs:
 *   1. "Semua Aku Dirayakan" - Nadin Amizah (Side A)
 *   2. "Shape of My Heart" - Backstreet Boys (Side B)
 * - Optimized, responsive Side A / Side B switcher without text overflow
 */
export default function SongMeaningSection() {
  const [activeSide, setActiveSide] = useState<"A" | "B">("A");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-sm rounded-3xl p-5 sm:p-7 text-center glass-card mt-6 relative overflow-hidden"
      style={{
        boxShadow: "0 12px 36px rgba(168, 85, 247, 0.16)",
      }}
    >
      {/* Decorative ambient background blur */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-40 blur-2xl"
        style={{
          background:
            activeSide === "A"
              ? "radial-gradient(circle, rgba(236, 72, 153, 0.5), transparent 70%)"
              : "radial-gradient(circle, rgba(168, 85, 247, 0.5), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full pointer-events-none opacity-40 blur-2xl"
        style={{
          background:
            activeSide === "A"
              ? "radial-gradient(circle, rgba(168, 85, 247, 0.5), transparent 70%)"
              : "radial-gradient(circle, rgba(236, 72, 153, 0.5), transparent 70%)",
        }}
      />

      {/* Top Header Badge */}
      <div className="space-y-1 mb-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/90 text-purple-700 border border-purple-200/70 shadow-xs">
          <Sparkles size={13} className="text-purple-500" />
          A Special Playlist For You
          <Sparkles size={13} className="text-purple-500" />
        </span>
        <h3 className="text-xl font-bold text-purple-900 pt-1">
          Cerita di Balik Lagu Ini 🎵
        </h3>
        <p className="text-xs text-purple-700/80">
          Makna dan alasan kenapa 2 lagu ini dipilih khusus untuk Zalfa
        </p>
      </div>

      {/* ── Side Switcher Segmented Control (Compact & Fully Responsive) ── */}
      <div className="relative z-10 grid grid-cols-2 gap-1.5 mb-4 p-1 rounded-2xl bg-purple-100/80 border border-purple-200/60 shadow-inner max-w-[280px] mx-auto">
        <button
          type="button"
          onClick={() => setActiveSide("A")}
          className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSide === "A"
              ? "bg-white text-purple-900 shadow-sm font-bold scale-[1.02]"
              : "text-purple-700/70 hover:text-purple-900 hover:bg-white/40"
          }`}
        >
          <span>🌸</span>
          <span>Side A</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSide("B")}
          className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSide === "B"
              ? "bg-white text-purple-900 shadow-sm font-bold scale-[1.02]"
              : "text-purple-700/70 hover:text-purple-900 hover:bg-white/40"
          }`}
        >
          <span>💫</span>
          <span>Side B</span>
        </button>
      </div>

      {/* ── Aesthetic Vintage Cassette Tape Card with Rotating Spools ── */}
      <div className="relative z-10 my-3 flex justify-center">
        <div className="w-full max-w-[275px] bg-gradient-to-br from-purple-900 via-indigo-950 to-purple-950 rounded-2xl p-3 shadow-md border border-purple-400/30 text-white relative overflow-hidden">
          {/* Subtle tape texture reflection */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none" />

          {/* Cassette Header Bar */}
          <div className="flex items-center justify-between text-[10px] text-purple-200/80 mb-2 px-1 font-mono">
            <span className="flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  activeSide === "A" ? "bg-pink-400" : "bg-purple-400"
                }`}
              />
              SIDE {activeSide}
            </span>
            <span className="tracking-widest uppercase text-[9px]">STEREO</span>
            <span className="text-purple-300">
              {activeSide === "A" ? "01 / 02" : "02 / 02"}
            </span>
          </div>

          {/* Cassette Center Window with Rotating Wheels */}
          <div className="bg-purple-950/90 rounded-xl p-2 border border-purple-500/25 relative flex items-center justify-between px-3">
            {/* Left Spool / Gear */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-dashed border-purple-300/80 bg-purple-900/60 flex items-center justify-center shadow-inner"
            >
              <div className="w-3 h-3 rounded-full bg-purple-950 border border-purple-300/70 flex items-center justify-center">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeSide === "A" ? "bg-pink-400" : "bg-purple-300"
                  }`}
                />
              </div>
            </motion.div>

            {/* Center Transparent Tape Window with Equalizer */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-end gap-1 h-4 px-1.5">
                {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-gradient-to-t from-pink-400 to-purple-300 rounded-full"
                    animate={{
                      scaleY: [height * 0.3, height, height * 0.4],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + (i % 3) * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <span className="text-[8.5px] text-purple-300/80 tracking-tight font-sans uppercase">
                SIDE {activeSide} • PLAYING
              </span>
            </div>

            {/* Right Spool / Gear */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-dashed border-purple-300/80 bg-purple-900/60 flex items-center justify-center shadow-inner"
            >
              <div className="w-3 h-3 rounded-full bg-purple-950 border border-purple-300/70 flex items-center justify-center">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeSide === "A" ? "bg-pink-400" : "bg-purple-300"
                  }`}
                />
              </div>
            </motion.div>
          </div>

          {/* Track Info on Cassette */}
          <div className="mt-2 text-center">
            <p className="text-xs font-semibold text-white tracking-wide truncate">
              {activeSide === "A" ? "Semua Aku Dirayakan" : "Shape of My Heart"}
            </p>
            <p className="text-[11px] text-purple-300/90">
              {activeSide === "A" ? "Nadin Amizah" : "Backstreet Boys"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Meaning & Reflection Content Area ── */}
      <AnimatePresence mode="wait">
        {activeSide === "A" ? (
          <motion.div
            key="side-a"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 text-xs sm:text-sm text-purple-900/85 leading-relaxed text-justify space-y-3 pt-2 select-text font-normal"
          >
            <p>
              aku memilih lagu{" "}
              <strong className="text-purple-900 font-bold">
                “semua aku dirayakan”
              </strong>{" "}
              untuk menemani hari spesialmu, karena rasanya lagu ini cocok dengan
              hari ini. hari ketika kamu lahir, hari ketika kehadiranmu di dunia
              seharusnya dirayakan.
            </p>

            <p>
              mungkin selama ini ngga semua hal berjalan sesuai yang kamu
              inginkan, mungkin ada hari-hari yang berat, ada banyak hal yang
              kamu lewati, dan ada cerita yang ngga semua orang tahu. tapi
              setidaknya, hari ini aku ingin kamu berhenti sejenak dan ingat
              kalau kamu juga pantas untuk dirayakan.
            </p>

            <p>
              bukan hanya karena hari ini kamu bertambah usia, tapi karena sejauh
              ini kamu sudah berhasil melewati banyak hal dan tetap sampai di
              titik ini. dengan semua cerita, proses, tawa, sedih, dan hal-hal
              yang sudah membentuk kamu menjadi diri kamu yang sekarang.
            </p>

            <p>
              jadi, aku memilih lagu ini karena hari ini bukan sekadar tentang
              ulang tahun. hari ini tentang kamu. tentang kehadiranmu, tentang
              semua hal yang sudah kamu lewati, dan tentang alasan kenapa hari
              ini kamu pantas mendapatkan banyak hal baik.
            </p>

            {/* Highlighted Closing Box Side A */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-100/90 via-pink-50/90 to-purple-100/90 border border-purple-200/80 shadow-xs text-center"
            >
              <p className="text-xs sm:text-sm font-semibold text-purple-900 flex items-center justify-center gap-1.5">
                hari ini, kamu sedang dirayakan.
                <Heart size={14} className="text-pink-500 fill-pink-400 inline" />
              </p>
            </motion.div>

            {/* Next Side Action Button */}
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => setActiveSide("B")}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-purple-100/90 hover:bg-purple-200/80 text-purple-900 border border-purple-200/70 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>Lanjut ke Side B (Shape of My Heart)</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="side-b"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 text-xs sm:text-sm text-purple-900/85 leading-relaxed text-justify space-y-3 pt-2 select-text font-normal"
          >
            <p>
              aku memilih lagu{" "}
              <strong className="text-purple-900 font-bold">
                “shape of my heart”
              </strong>{" "}
              untuk menemani hari spesialmu karena entah kenapa, lagu ini terasa
              punya makna yang cukup dekat dengan apa yang ingin aku sampaikan
              tentang kamu.
            </p>

            <p>
              mungkin aku ngga tahu seluruh cerita dalam hidupmu. aku ngga tahu
              semua hal yang pernah kamu lewati, semua hal yang pernah membuatmu
              bahagia, sedih, kecewa, atau bahkan hal-hal kecil yang mungkin
              ngga pernah kamu ceritakan kepada siapa pun. tapi dari semua bagian
              yang aku tahu tentang kamu, sedikit demi sedikit aku jadi sadar
              kalau setiap cerita itu membentuk kamu menjadi diri kamu yang
              sekarang.
            </p>

            <p className="italic font-medium text-purple-950 text-center sm:text-left">
              “dan mungkin, itu juga yang membuat aku suka mengenal kamu.”
            </p>

            <p>
              bukan karena kamu harus selalu sempurna, bukan karena kamu harus
              selalu menjadi seperti apa yang orang lain inginkan. justru karena
              kamu adalah kamu, dengan segala cerita, sifat, kekurangan,
              kelebihan, dan semua hal kecil yang mungkin kamu sendiri ngga
              sadar ternyata punya arti bagi orang lain.
            </p>

            <p>
              mungkin aku belum mengenal seluruh isi hatimu, belum memahami
              setiap bagian dari dirimu. tapi kalau aku diberi kesempatan untuk
              mengenalmu lebih jauh, aku rasa aku ngga akan keberatan untuk
              pelan-pelan memahami setiap cerita yang membentuk{" "}
              <em className="text-purple-950 font-semibold">
                shape of your heart
              </em>
              .
            </p>

            <p>
              jadi, aku memilih lagu ini bukan hanya karena melodinya yang indah.
              tapi karena lagu ini mengingatkan aku bahwa hati seseorang
              terbentuk dari banyak cerita. dan entah kenapa, dari sekian banyak
              cerita yang ada, aku senang karena salah satu cerita yang sedang
              berjalan sekarang mempertemukan aku dengan kamu.
            </p>

            <p>
              di hari ulang tahunmu ini, aku cuma ingin kamu tahu bahwa kamu
              adalah seseorang yang pantas mendapatkan hal-hal baik, pantas
              untuk bahagia, dan pantas untuk dirayakan.
            </p>

            {/* Highlighted Closing Prayer Box Side B */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-100/90 via-pink-50/90 to-purple-100/90 border border-purple-200/80 shadow-xs text-center"
            >
              <p className="text-xs sm:text-sm font-semibold text-purple-900 leading-relaxed">
                dan mungkin, di antara semua doa baik untukmu hari ini, ada satu
                doa kecil dariku: semoga di tahun-tahun berikutnya, aku masih
                punya kesempatan untuk tetap ada dan mengenal lebih banyak tentang
                kamu. 🤍
              </p>
            </motion.div>

            {/* Back to Side A Button */}
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => setActiveSide("A")}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-purple-100/90 hover:bg-purple-200/80 text-purple-900 border border-purple-200/70 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ArrowLeft size={13} />
                <span>Kembali ke Side A (Nadin Amizah)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
