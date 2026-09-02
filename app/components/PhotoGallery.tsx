"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Heart } from "lucide-react";

interface PhotoItem {
  id: number;
  src: string;
  title: string;
  caption: string;
  rotate: number; // Sudut miring abstrak
  tapeColor?: string;
}

const PHOTOS: PhotoItem[] = [
  {
    id: 1,
    src: "/photos/foto1.jpeg",
    title: "✨ cute vibes",
    caption: "Cantik banget yaaa.. 🌸",
    rotate: -3.5,
    tapeColor: "rgba(192, 132, 252, 0.45)",
  },
  {
    id: 2,
    src: "/photos/foto2.jpeg",
    title: "✨ Candit Moment",
    caption: "senyumnya jangan ilang-ilang yaa 😄",
    rotate: 3,
    tapeColor: "rgba(244, 114, 182, 0.45)",
  },
  {
    id: 3,
    src: "/photos/foto3.jpeg",
    title: "✨ selfie photo",
    caption: "ngga senyum aja cantik yaa😊",
    rotate: -2.5,
    tapeColor: "rgba(251, 191, 36, 0.45)",
  },
  {
    id: 4,
    src: "/photos/foto4.jpeg",
    title: "✨ Mirror Photo",
    caption: "Mirrornya sendiri aja? next sama gua ya WKWK bercanda 💫",
    rotate: 4,
    tapeColor: "rgba(168, 85, 247, 0.45)",
  },
  {
    id: 5,
    src: "/photos/foto5.jpeg",
    title: "✨ Paskibra Moment",
    caption: "Auranya beda gitu yaa kalo paskib.. 💜",
    rotate: -3,
    tapeColor: "rgba(236, 72, 153, 0.45)",
  },
  {
    id: 6,
    src: "/photos/foto6.jpeg",
    title: "✨ Sweet Smile",
    caption: "Satu foto sejuta kecantikan",
    rotate: 2.5,
    tapeColor: "rgba(147, 51, 234, 0.45)",
  },
];

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full mt-8 flex flex-col items-center">
      {/* ── Header Gallery ── */}
      <div className="text-center space-y-1 mb-6 px-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/90 text-purple-700 border border-purple-200/60 shadow-xs">
          📸 Galeri Spesial Zalfa
        </span>
        <h3 className="text-xl font-bold text-purple-900 tracking-tight">
          A Little Snapshot of You ✨
        </h3>
        <p className="text-xs text-purple-700/80 max-w-xs mx-auto">
          beberapa momen favorit yang ga boleh kelewatan 👀 ketuk fotonya buat liat lebih jelas yaa 💜
        </p>
      </div>

      {/* ── 2D Neumorphism Abstract Tilted Grid ── */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full px-2">
        {PHOTOS.map((photo, index) => {
          const isLiked = likedPhotos[photo.id];

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 24, rotate: photo.rotate }}
              animate={{ opacity: 1, y: 0, rotate: photo.rotate }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "backOut" }}
              whileHover={{
                rotate: 0,
                scale: 1.05,
                zIndex: 20,
                transition: { duration: 0.25 },
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedPhoto(photo)}
              className="relative cursor-pointer group select-none flex flex-col items-center"
            >
              {/* ── Washi Tape (Solasi Abstrak 2D) ── */}
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-4.5 rounded-xs z-10 shadow-xs backdrop-blur-xs border border-white/40"
                style={{
                  backgroundColor: photo.tapeColor || "rgba(192, 132, 252, 0.4)",
                  transform: `translateX(-50%) rotate(${photo.rotate > 0 ? -4 : 4}deg)`,
                }}
              />

              {/* ── Neumorphic 2D Frame Card ── */}
              <div
                className="w-full bg-[#faf5ff] rounded-2xl p-2.5 sm:p-3 flex flex-col items-center transition-all duration-300 border border-white/90"
                style={{
                  boxShadow:
                    "6px 6px 16px rgba(168, 85, 247, 0.16), -5px -5px 14px rgba(255, 255, 255, 0.95)",
                }}
              >
                {/* Photo Container */}
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-purple-100/60 relative border border-purple-200/50 shadow-inner flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.parentElement?.querySelector(".img-fallback");
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />

                  {/* Fallback */}
                  <div className="img-fallback hidden flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-2xl">📸</span>
                    <span className="text-[10px] font-mono text-purple-700">{photo.title}</span>
                  </div>

                  {/* Hover Overlay Zoom Icon */}
                  <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-2 rounded-full bg-white/80 text-purple-800 shadow-md">
                      <ZoomIn size={16} />
                    </div>
                  </div>

                  {/* Like Button on Card */}
                  <button
                    type="button"
                    onClick={(e) => toggleLike(photo.id, e)}
                    className={`absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-sm border transition-transform duration-200 active:scale-75 ${
                      isLiked
                        ? "bg-pink-500/90 text-white border-pink-400 scale-110 shadow-sm"
                        : "bg-white/70 text-purple-600 hover:text-pink-500 border-white/80"
                    }`}
                    aria-label="Like foto"
                  >
                    <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* 2D Polaroid Caption Text */}
                <div className="w-full pt-2.5 pb-1 px-1 flex flex-col items-center text-center">
                  <p className="text-[11px] sm:text-xs font-bold text-purple-900 tracking-tight truncate w-full">
                    {photo.caption}
                  </p>
                  <span className="text-[9px] font-mono text-purple-600/70 tracking-widest uppercase mt-0.5">
                    {photo.title}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Modal Lightbox Preview (User Friendly Zoom) ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-purple-950/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative z-10 w-full max-w-sm bg-[#faf5ff] rounded-3xl p-4 sm:p-5 border border-white/80 shadow-2xl flex flex-col items-center"
              style={{
                boxShadow: "0 20px 50px rgba(88, 28, 135, 0.35)",
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-purple-800 hover:bg-white hover:text-purple-950 transition-colors shadow-sm z-20"
                aria-label="Tutup foto"
              >
                <X size={18} />
              </button>

              {/* Full Image */}
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-purple-100 shadow-inner border border-purple-200/60 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Caption & Controls */}
              <div className="w-full mt-4 flex items-center justify-between px-2">
                <div className="text-left">
                  <h4 className="text-sm sm:text-base font-bold text-purple-950">
                    {selectedPhoto.caption}
                  </h4>
                  <p className="text-[11px] font-mono text-purple-700/70">
                    {selectedPhoto.title} • Zalfa Ramadani 💜
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleLike(selectedPhoto.id, e)}
                  className={`p-2.5 rounded-2xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold active:scale-90 ${
                    likedPhotos[selectedPhoto.id]
                      ? "bg-pink-500 text-white shadow-md shadow-pink-500/30"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                  }`}
                >
                  <Heart
                    size={16}
                    fill={likedPhotos[selectedPhoto.id] ? "currentColor" : "none"}
                  />
                  <span>{likedPhotos[selectedPhoto.id] ? "Liked!" : "Love"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
