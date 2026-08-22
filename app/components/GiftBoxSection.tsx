"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CandleSection from "./CandleSection";
import PhotoGallery from "./PhotoGallery";
import BirthdayCertificate from "./BirthdayCertificate";
import GrandFinaleOutro from "./GrandFinaleOutro";

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

// Path foto yang akan ditampilkan saat kotak dibuka
const PHOTO_SRC = "/photos/foto4.jpeg";

const FULL_MESSAGE = `eh tapi coba lu inget inget dulu deh... sekarang tanggal berapa? tanggal 5 kan? terus hari apa? sabtu ya? iya betul banget wkwkwk, dan yang lebih penting lagi... tepat banget hari ini lu ulang tahun kannnn 😭🎉 jadi hari ini officially jadi hari spesial buat lu, dan gua mau ngucapin happy birthday buat lu.

semoga di umur lu yang sekarang semua hal baik bisa datang ke kehidupan lu. semoga lu selalu dikasih kesehatan, happiness, rezeki yang lancar, dan dipermudah dalam segala urusan yang lagi lu jalanin.

semoga di umur yang baru ini lu bisa semakin berkembang, semakin dewasa dalam menghadapi berbagai hal, dan bisa terus jadi diri lu sendiri. semoga semua dreams, cita cita, dan hal hal yang selama ini lu usahain bisa perlahan tercapai. maybe ga semuanya bisa langsung terjadi sekarang, tapi semoga selalu ada jalan dan kesempatan yang bikin lu semakin dekat sama apa yang lu mau.

gua juga berharap semoga hari hari lu kedepannya lebih banyak diisi sama hal hal yang bikin lu happy. semoga lu selalu surrounded by good people yang tulus, yang bisa nemenin lu dalam keadaan apa pun. kalau lagi seneng semoga bisa punya banyak orang buat diajak sharing, dan kalau lagi ada masalah semoga selalu ada orang yang bisa bikin lu ngerasa ga sendirian.

kalau nanti ada banyak hal yang ga sesuai sama apa yang lu rencanain, jangan terlalu nyalahin diri sendiri. everyone has their own timing, jadi gua harap lu bisa terus percaya sama proses yang lagi lu jalanin. ga harus selalu perfect, yang penting lu terus berusaha dan ga berhenti buat move forward.

semoga umur baru ini juga brings a lot of new experiences buat lu. semoga ada banyak cerita seru, banyak moments yang bisa dikenang, banyak kesempatan baru, dan tentunya banyak alasan buat lu senyum. semoga hal hal yang selama ini lu doain one by one bisa dikabulin di waktu yang paling tepat.

pokoknya semoga lu selalu sehat, panjang umur, bahagia terus, sukses dalam apa pun yang lu kerjain, dan bisa achieve semua yang lu cita citakan. jangan lupa juga buat enjoy the process, karena nanti pasti bakal ada waktunya lu lihat ke belakang dan sadar kalau ternyata lu udah sejauh itu.

selamat ulang tahun sekali lagi zalfa ramadani. semoga this new chapter of your life jadi chapter yang jauh lebih baik dari sebelumnya. semoga kedepannya semakin banyak good things yang datang ke hidup lu, semakin banyak happy moments, dan tentunya semakin banyak alasan buat lu bangga sama diri lu sendiri.

enjoy your special day ya zalfa, have a great birthday and jangan lupa bahagia terus 🎂🤍`;

/**
 * GiftBoxSection – Kotak hadiah animasi yang dibuka saat diketuk,
 * mengeluarkan sparkle, menampilkan foto spesial Zalfa, lalu kartu ucapan dengan animasi typewriter.
 */
export default function GiftBoxSection() {
  const [opened, setOpened] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [displayedLength, setDisplayedLength] = useState(0);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    // Buat sparkle di posisi acak
    const newSparkles = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * -160 - 20,
    }));
    setSparkles(newSparkles);
  };

  // Typewriter effect triggered when gift box is opened
  useEffect(() => {
    if (!opened) return;

    let intervalId: NodeJS.Timeout | null = null;

    // Small delay after modal appears before typing starts
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayedLength((prev) => {
          if (prev >= FULL_MESSAGE.length) {
            if (intervalId) clearInterval(intervalId);
            return FULL_MESSAGE.length;
          }
          // Increment by 2 characters per 18ms for smooth, responsive typing
          return Math.min(prev + 2, FULL_MESSAGE.length);
        });
      }, 18);
    }, 450);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [opened]);

  // Handler to instantly reveal all text if user clicks/taps
  const handleSkipTyping = () => {
    if (displayedLength < FULL_MESSAGE.length) {
      setDisplayedLength(FULL_MESSAGE.length);
    }
  };

  const isTyping = opened && displayedLength < FULL_MESSAGE.length;
  const currentText = FULL_MESSAGE.slice(0, displayedLength);
  const paragraphs = currentText.split("\n\n");

  return (
    <section className="flex flex-col items-center justify-center py-12 px-4 gap-6">
      {/* Area Kotak Hadiah / Foto Spesial */}
      <div className="relative flex flex-col items-center">
        {/* Sparkles */}
        <AnimatePresence>
          {opened &&
            sparkles.map((s) => (
              <motion.span
                key={s.id}
                className="absolute text-xl pointer-events-none select-none"
                style={{ top: "50%", left: "50%" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{ x: s.x, y: s.y, opacity: 0, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                {["✨", "💖", "🌸", "⭐", "💫"][s.id % 5]}
              </motion.span>
            ))}
        </AnimatePresence>

        {/* Kotak Hadiah / Frame Foto setelah dibuka */}
        <div className="flex flex-col items-center">
          {opened ? (
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative p-2.5 rounded-3xl shadow-xl flex flex-col items-center"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                boxShadow: "0 12px 35px -8px rgba(88, 28, 135, 0.15)",
              }}
            >
              {/* Frame Foto */}
              <div
                className="w-56 h-64 sm:w-64 sm:h-72 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-inner"
                style={{
                  background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PHOTO_SRC}
                  alt="Foto Spesial Zalfa"
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    // Fallback jika file foto belum ada di folder
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector(".photo-fallback");
                    if (fallback) fallback.classList.remove("hidden");
                  }}
                />

                {/* Fallback Placeholder jika belum ada foto di folder */}
                <div className="photo-fallback hidden flex flex-col items-center justify-center text-center p-4">
                  <span className="text-5xl mb-2">📸</span>
                  <p className="text-xs text-purple-800 font-semibold leading-relaxed">
                    Taruh foto di: <br />
                    <code className="bg-white/80 px-2 py-0.5 rounded text-[11px] mt-1.5 inline-block text-purple-900 font-mono shadow-sm">
                      public/photos/foto_kado.jpg
                    </code>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleOpen}
              whileTap={{ scale: 0.92 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="text-8xl cursor-pointer select-none focus:outline-none"
              aria-label="Buka kotak hadiah"
            >
              🎁
            </motion.button>
          )}
        </div>

        {/* Teks petunjuk sebelum dibuka */}
        <AnimatePresence>
          {!opened && (
            <motion.p
              className="mt-3 text-sm text-purple-600/80 font-medium text-center"
              exit={{ opacity: 0, y: -8 }}
            >
              Ketuk kotak hadiah ini yukkkk, buat liat ada apa isinya HAHAH
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Kartu ucapan yang muncul setelah dibuka */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key="reveal"
            className="w-full max-w-sm rounded-3xl p-7 text-center glass-card"
            style={{
              boxShadow: "0 8px 32px rgba(147, 51, 234, 0.12)",
            }}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            <motion.div
              className="text-5xl mb-3"
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              🎉🎂
            </motion.div>
            <h2 className="text-xl font-bold text-purple-800 leading-tight">
              Selamat Ulang Tahun,
            </h2>
            <h2 className="text-xl font-bold text-purple-600 leading-tight mb-4">
              Zalfa Ramadani! 🎉🎂
            </h2>

            {/* Isi ucapan dengan typewriter animation */}
            <div
              onClick={handleSkipTyping}
              className="text-sm text-purple-700/85 leading-relaxed text-justify space-y-3 cursor-pointer select-text"
              title={isTyping ? "Ketuk untuk langsung menampilkan semua teks" : ""}
            >
              {paragraphs.map((paragraph, index) => {
                const isLastParagraph = index === paragraphs.length - 1;
                return (
                  <p key={index}>
                    {paragraph}
                    {isLastParagraph && isTyping && (
                      <span className="inline-block font-mono text-purple-500 font-bold animate-pulse ml-0.5">
                        |
                      </span>
                    )}
                  </p>
                );
              })}

              {/* Signature di bagian bawah */}
              {displayedLength >= FULL_MESSAGE.length && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center font-semibold text-purple-700 pt-2 italic"
                >
                  from Raditya
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Tiup Lilin, Galeri Foto, Piagam Penghargaan & Grand Finale Outro */}
      <AnimatePresence>
        {opened && displayedLength >= FULL_MESSAGE.length && (
          <>
            <CandleSection />
            <PhotoGallery />
            <BirthdayCertificate />
            <GrandFinaleOutro />
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
