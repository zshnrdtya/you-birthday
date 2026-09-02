"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ZoomIn,
  Heart,
  Download,
  Check,
  Sparkles,
  Camera,
  Palette,
} from "lucide-react";
import confetti from "canvas-confetti";

interface PhotoItem {
  id: number;
  src: string;
  title: string;
  caption: string;
  cutNumber: string;
  timeTag: string;
  strip: 1 | 2;
}

interface FrameTheme {
  id: string;
  name: string;
  bgClass: string;
  textClass: string;
  subTextClass: string;
  borderClass: string;
  accentClass: string;
  photoBorderClass: string;
  canvasBg: string;
  canvasText: string;
  canvasSubText: string;
  canvasBorder: string;
  canvasAccent: string;
  canvasPhotoBorder: string;
}

const FRAME_THEMES: FrameTheme[] = [
  {
    id: "lilac",
    name: "Lilac Pastel",
    bgClass: "bg-purple-100",
    textClass: "text-purple-950",
    subTextClass: "text-purple-700/80",
    borderClass: "border-purple-200/80",
    accentClass: "text-purple-600",
    photoBorderClass: "border-purple-300/60",
    canvasBg: "#f3e8ff",
    canvasText: "#3b0764",
    canvasSubText: "#7e22ce",
    canvasBorder: "#e9d5ff",
    canvasAccent: "#9333ea",
    canvasPhotoBorder: "#d8b4fe",
  },
  {
    id: "white",
    name: "Classic White",
    bgClass: "bg-white",
    textClass: "text-neutral-900",
    subTextClass: "text-neutral-500",
    borderClass: "border-neutral-200",
    accentClass: "text-neutral-800",
    photoBorderClass: "border-neutral-200",
    canvasBg: "#ffffff",
    canvasText: "#18181b",
    canvasSubText: "#71717a",
    canvasBorder: "#e4e4e7",
    canvasAccent: "#27272a",
    canvasPhotoBorder: "#e4e4e7",
  },
  {
    id: "pink",
    name: "Sakura Pink",
    bgClass: "bg-pink-100",
    textClass: "text-pink-950",
    subTextClass: "text-pink-700/80",
    borderClass: "border-pink-200/80",
    accentClass: "text-pink-600",
    photoBorderClass: "border-pink-300/60",
    canvasBg: "#fce7f3",
    canvasText: "#500724",
    canvasSubText: "#9d174d",
    canvasBorder: "#fbcfe8",
    canvasAccent: "#db2777",
    canvasPhotoBorder: "#f472b6",
  },
  {
    id: "noir",
    name: "Retro Noir",
    bgClass: "bg-zinc-900",
    textClass: "text-zinc-100",
    subTextClass: "text-zinc-400",
    borderClass: "border-zinc-700/80",
    accentClass: "text-amber-400",
    photoBorderClass: "border-zinc-700",
    canvasBg: "#18181b",
    canvasText: "#f4f4f5",
    canvasSubText: "#a1a1aa",
    canvasBorder: "#3f3f46",
    canvasAccent: "#fbbf24",
    canvasPhotoBorder: "#3f3f46",
  },
  {
    id: "cream",
    name: "Warm Cream",
    bgClass: "bg-[#fef7ee]",
    textClass: "text-amber-950",
    subTextClass: "text-amber-800/80",
    borderClass: "border-amber-200/80",
    accentClass: "text-amber-700",
    photoBorderClass: "border-amber-200",
    canvasBg: "#fef7ee",
    canvasText: "#451a03",
    canvasSubText: "#92400e",
    canvasBorder: "#fde68a",
    canvasAccent: "#b45309",
    canvasPhotoBorder: "#fde68a",
  },
];

const PHOTOS: PhotoItem[] = [
  {
    id: 1,
    src: "/photos/foto1.jpeg",
    title: "cute vibes",
    caption: "Cantik banget yaaa.. 🌸",
    cutNumber: "01",
    timeTag: "05:09",
    strip: 1,
  },
  {
    id: 2,
    src: "/photos/foto2.jpeg",
    title: "Candit Moment",
    caption: "senyumnya jangan ilang-ilang yaa 😄",
    cutNumber: "02",
    timeTag: "09:09",
    strip: 1,
  },
  {
    id: 3,
    src: "/photos/foto3.jpeg",
    title: "selfie photo",
    caption: "ngga senyum aja cantik yaa😊",
    cutNumber: "03",
    timeTag: "12:05",
    strip: 1,
  },
  {
    id: 4,
    src: "/photos/foto4.jpeg",
    title: "Mirror Photo",
    caption: "Mirrornya sendiri aja? next sama gua ya WKWK bercanda 💫",
    cutNumber: "04",
    timeTag: "15:30",
    strip: 2,
  },
  {
    id: 5,
    src: "/photos/foto5.jpeg",
    title: "Paskibra Moment",
    caption: "Auranya beda gitu yaa kalo paskib.. 💜",
    cutNumber: "05",
    timeTag: "17:45",
    strip: 2,
  },
  {
    id: 6,
    src: "/photos/foto6.jpeg",
    title: "Sweet Smile",
    caption: "Satu foto sejuta kecantikan",
    cutNumber: "06",
    timeTag: "20:09",
    strip: 2,
  },
];

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<"strip1" | "strip2" | "duo">("duo");
  const [selectedTheme, setSelectedTheme] = useState<FrameTheme>(FRAME_THEMES[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const strip1Photos = PHOTOS.filter((p) => p.strip === 1);
  const strip2Photos = PHOTOS.filter((p) => p.strip === 2);

  // Helper function to load an image onto canvas
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  // Draw a single photostrip on an HTML5 canvas context
  const drawStripOnCanvas = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    photos: PhotoItem[],
    images: HTMLImageElement[],
    theme: FrameTheme,
    stripLabel: string
  ) => {
    // 1. Soft Realistic Drop Shadow Under Strip Paper
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = theme.canvasBg;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 26);
    ctx.fill();
    ctx.restore();

    // 2. Draw Strip Paper Background
    ctx.save();
    ctx.fillStyle = theme.canvasBg;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 26);
    ctx.fill();

    // Subtle border around strip
    ctx.strokeStyle = theme.canvasBorder;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 3. Photobooth Top Header
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = theme.canvasAccent;
    ctx.font = "bold 14px monospace";
    ctx.fillText("✦ LIFE 3 CUTS • PHOTOBOOTH ✦", x + width / 2, y + 42);

    ctx.fillStyle = theme.canvasText;
    ctx.font = "900 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("ZALFA RAMADANI", x + width / 2, y + 74);

    ctx.fillStyle = theme.canvasSubText;
    ctx.font = "bold 12px monospace";
    ctx.fillText(`${stripLabel} • 05.09.2009`, x + width / 2, y + 98);

    // Decorative line under header
    ctx.strokeStyle = theme.canvasBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 115);
    ctx.lineTo(x + width - 30, y + 115);
    ctx.stroke();

    // 4. Render 3 Photos
    const photoMarginX = 26;
    const photoWidth = width - photoMarginX * 2;
    const photoHeight = 352; // Crisp balanced height
    const startY = y + 130;
    const gap = 22;

    photos.forEach((photo, idx) => {
      const py = startY + idx * (photoHeight + gap);
      const px = x + photoMarginX;
      const img = images[idx];

      // Draw Photo background placeholder
      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.roundRect(px, py, photoWidth, photoHeight, 16);
      ctx.fill();

      // Draw Cropped Image (Cover fit)
      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(px, py, photoWidth, photoHeight, 16);
        ctx.clip();

        // Calculate aspect cover
        const imgRatio = img.width / img.height;
        const targetRatio = photoWidth / photoHeight;
        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0;
        let sy = 0;

        if (imgRatio > targetRatio) {
          sWidth = img.height * targetRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / targetRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, px, py, photoWidth, photoHeight);
        ctx.restore();

        // Draw photo border
        ctx.strokeStyle = theme.canvasPhotoBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(px, py, photoWidth, photoHeight, 16);
        ctx.stroke();
      }

      // Draw Timestamp & Cut Number Overlay tags
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.beginPath();
      ctx.roundRect(px + 12, py + photoHeight - 34, 76, 22, 8);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`CUT #${photo.cutNumber}`, px + 12 + 38, py + photoHeight - 23);

      // Time tag on bottom right
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.beginPath();
      ctx.roundRect(px + photoWidth - 68, py + photoHeight - 34, 56, 22, 8);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(photo.timeTag, px + photoWidth - 40, py + photoHeight - 23);
    });

    // 5. Footer Area (Divider, Centered Barcode, Date, & Heart note)
    const footerY = startY + 3 * photoHeight + 2 * gap + 18;

    // Dashed divider line above footer
    ctx.strokeStyle = theme.canvasBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 30, footerY);
    ctx.lineTo(x + width - 30, footerY);
    ctx.stroke();

    // ── Mathematically 100% Centered Realistic Barcode ──
    const barcodeBars = [
      3, 2, 1, 2, 4, 2, 1, 3, 2, 1, 3, 2, 4, 2, 1, 3, 2, 2, 4, 2, 1, 3, 2, 1, 3, 2, 4, 2, 2, 2, 3, 2, 1, 2, 4, 2, 3,
    ];
    const totalBarcodeWidth = barcodeBars.reduce((acc, val) => acc + val, 0);
    const barStartX = x + (width - totalBarcodeWidth) / 2;
    const barY = footerY + 14;
    const barHeight = 34;

    let curX = barStartX;
    ctx.fillStyle = theme.canvasText;
    for (let i = 0; i < barcodeBars.length; i++) {
      const w = barcodeBars[i];
      if (i % 2 === 0) {
        ctx.fillRect(curX, barY, w, barHeight);
      }
      curX += w;
    }

    // Barcode numbers (Perfect center under barcode)
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = theme.canvasSubText;
    ctx.fillText("0509  •  2009  •  2026", x + width / 2, barY + barHeight + 14);

    // Sweet footer message (Perfect center)
    ctx.fillStyle = theme.canvasAccent;
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("♡ stay happy, you deserve the world ♡", x + width / 2, barY + barHeight + 35);

    // Subtitle tagline (Perfect center)
    ctx.fillStyle = theme.canvasSubText;
    ctx.font = "italic 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("Zalfa's Special Memory Cut", x + width / 2, barY + barHeight + 52);

    ctx.restore();
  };

  // High Quality HD Canvas Download Engine
  const handleDownloadPhotostrip = async () => {
    setIsDownloading(true);

    try {
      // 1. Determine which photos to download based on activeTab
      const isDuo = activeTab === "duo";
      const photosToLoad = isDuo
        ? PHOTOS
        : activeTab === "strip1"
        ? strip1Photos
        : strip2Photos;

      // 2. Preload images
      const loadedImages = await Promise.all(
        photosToLoad.map((p) =>
          loadImage(p.src).catch(() => new Image())
        )
      );

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      // Dimensioning for crisp HD photostrip (300 DPI look)
      const stripWidth = 460;
      const stripHeight = 1400;
      const margin = 45;

      if (isDuo) {
        // Dual side-by-side canvas
        canvas.width = stripWidth * 2 + margin * 3;
        canvas.height = stripHeight + margin * 2;

        // Elegant gentle backdrop
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, "#fdf4ff");
        bgGrad.addColorStop(0.5, "#ffffff");
        bgGrad.addColorStop(1, "#f3e8ff");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Strip 1 (Left)
        drawStripOnCanvas(
          ctx,
          margin,
          margin,
          stripWidth,
          stripHeight,
          strip1Photos,
          loadedImages.slice(0, 3),
          selectedTheme,
          "EDITION 01 • SWEET VIBES"
        );

        // Draw Strip 2 (Right)
        drawStripOnCanvas(
          ctx,
          margin * 2 + stripWidth,
          margin,
          stripWidth,
          stripHeight,
          strip2Photos,
          loadedImages.slice(3, 6),
          selectedTheme,
          "EDITION 02 • MEMORABLE CUT"
        );
      } else {
        // Single Strip canvas
        canvas.width = stripWidth + margin * 2;
        canvas.height = stripHeight + margin * 2;

        // Elegant gentle backdrop
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, "#fdf4ff");
        bgGrad.addColorStop(0.5, "#ffffff");
        bgGrad.addColorStop(1, "#f3e8ff");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const label =
          activeTab === "strip1"
            ? "EDITION 01 • SWEET VIBES"
            : "EDITION 02 • MEMORABLE CUT";

        drawStripOnCanvas(
          ctx,
          margin,
          margin,
          stripWidth,
          stripHeight,
          photosToLoad,
          loadedImages,
          selectedTheme,
          label
        );
      }

      // Convert to Blob and Download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `photostrip-zalfa-${activeTab}-${selectedTheme.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
        setDownloadSuccess(true);

        // Festive celebration confetti!
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#a855f7", "#ec4899", "#f59e0b", "#38bdf8"],
        });

        setTimeout(() => setDownloadSuccess(false), 3500);
      }, "image/png");
    } catch (err) {
      console.error("Failed to generate photostrip:", err);
      setIsDownloading(false);
    }
  };

  // Reusable Photostrip Visual UI
  const renderSingleStripUI = (
    photos: PhotoItem[],
    label: string,
    rotateDeg: number
  ) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          boxShadow:
            selectedTheme.id === "noir"
              ? "0 22px 50px -10px rgba(0, 0, 0, 0.75)"
              : "0 20px 45px -10px rgba(147, 51, 234, 0.2), 0 8px 18px rgba(0, 0, 0, 0.06)",
        }}
        className={`relative w-full max-w-[290px] sm:max-w-[310px] rounded-[1.8rem] p-4 sm:p-4.5 flex flex-col items-center border transition-all duration-300 select-none ${selectedTheme.bgClass} ${selectedTheme.borderClass}`}
      >
        {/* Top Washi Tape Decoration */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-xs z-20 backdrop-blur-md shadow-xs border border-white/50"
          style={{
            backgroundColor:
              selectedTheme.id === "noir"
                ? "rgba(251, 191, 36, 0.55)"
                : "rgba(192, 132, 252, 0.6)",
            transform: `translateX(-50%) rotate(${rotateDeg}deg)`,
          }}
        />

        {/* ── Header ── */}
        <div className="w-full text-center pt-2 pb-3.5 space-y-0.5 border-b border-dashed border-current/25">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-widest uppercase font-bold opacity-80">
            <Camera size={12} className={selectedTheme.accentClass} />
            <span>LIFE 3 CUTS • PHOTOBOOTH</span>
          </div>
          <h4 className={`text-base sm:text-lg font-black tracking-tight ${selectedTheme.textClass}`}>
            ZALFA RAMADANI
          </h4>
          <p className={`text-[10px] font-semibold tracking-wider font-mono ${selectedTheme.subTextClass}`}>
            {label} • 05.09.2009
          </p>
        </div>

        {/* ── 3 Stacked Photos ── */}
        <div className="w-full py-3.5 space-y-3">
          {photos.map((photo) => {
            const isLiked = likedPhotos[photo.id];

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative cursor-pointer flex flex-col items-center"
              >
                {/* Photo Container */}
                <div
                  className={`w-full aspect-[4/3.5] rounded-xl overflow-hidden relative shadow-inner border transition-transform duration-300 group-hover:scale-[1.02] ${selectedTheme.photoBorderClass} bg-black/5`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />

                  {/* Cut Stamp badge */}
                  <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-[9px] font-mono font-bold text-white shadow-xs">
                    CUT #{photo.cutNumber}
                  </div>

                  {/* Hover Zoom Prompt */}
                  <div className="absolute inset-0 bg-purple-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-2 rounded-full bg-white/90 text-purple-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn size={15} />
                    </div>
                  </div>

                  {/* Like Button on Photo */}
                  <button
                    type="button"
                    onClick={(e) => toggleLike(photo.id, e)}
                    className={`absolute bottom-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-sm border transition-all duration-200 active:scale-75 ${
                      isLiked
                        ? "bg-pink-500 text-white border-pink-400 scale-110 shadow-sm"
                        : "bg-white/80 text-purple-700 hover:text-pink-500 border-white/90"
                    }`}
                    aria-label="Love foto ini"
                  >
                    <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer Strip (Barcode & Sweet Stamp) ── */}
        <div className="w-full pt-3 pb-1 border-t border-dashed border-current/25 flex flex-col items-center text-center space-y-1.5">
          {/* Barcode Graphic representation */}
          <div className="w-full flex items-center justify-center gap-[2px] h-6 px-4 py-1 opacity-85">
            {[3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3].map(
              (w, i) => (
                <div
                  key={i}
                  className={selectedTheme.id === "noir" ? "bg-white" : "bg-neutral-900"}
                  style={{ width: `${w}px`, height: "100%" }}
                />
              )
            )}
          </div>
          <span className="text-[9px] font-mono tracking-widest opacity-70">
            0509  •  2009  •  2026
          </span>

          {/* Sweet tagline */}
          <p className={`text-[10px] font-bold ${selectedTheme.accentClass} pt-0.5`}>
            ♡ stay happy, you deserve the world ♡
          </p>
          <span className={`text-[9px] font-medium italic opacity-75 ${selectedTheme.subTextClass}`}>
            Zalfa&apos;s Special Cut
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div ref={componentRef} className="w-full mt-10 flex flex-col items-center">
      {/* ── Header Gallery ── */}
      <div className="text-center space-y-1.5 mb-6 px-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/90 text-purple-700 border border-purple-200/70 shadow-xs">
          <Camera size={13} className="text-purple-600" />
          Korean Photobooth Edition
          <Sparkles size={13} className="text-purple-600" />
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
          Zalfa&apos;s Life 3 Cuts 🎞️✨
        </h3>
        <p className="text-xs text-purple-700/85 max-w-sm mx-auto leading-relaxed">
          Foto-foto kamu disulap jadi strip photobooth ala di mall! Bisa ganti warna frame dan download langsung ke galeri HP kamu 💜
        </p>
      </div>

      {/* ── Control Bar: View Tabs & Frame Theme Picker ── */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3.5 mb-6 px-3">
        {/* 1. View Mode Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-purple-200/70 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("duo")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "duo"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-purple-900/80 hover:text-purple-950"
            }`}
          >
            Duo Strip (2 in 1)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("strip1")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "strip1"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-purple-900/80 hover:text-purple-950"
            }`}
          >
            Strip #1
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("strip2")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "strip2"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-purple-900/80 hover:text-purple-950"
            }`}
          >
            Strip #2
          </button>
        </div>

        {/* 2. Frame Theme Color Selector (Like choosing paper color in photobooth) */}
        <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-purple-200/60 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-900/80 mr-1">
            <Palette size={13} className="text-purple-600" />
            <span>Frame:</span>
          </div>

          <div className="flex items-center gap-2">
            {FRAME_THEMES.map((theme) => {
              const isSelected = selectedTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  title={theme.name}
                  type="button"
                  className={`relative w-6 h-6 rounded-full transition-transform duration-200 shadow-2xs active:scale-90 ${
                    isSelected ? "scale-120 ring-2 ring-purple-600 ring-offset-2 ring-offset-white" : "hover:scale-110"
                  }`}
                  style={{
                    backgroundColor:
                      theme.id === "noir"
                        ? "#18181b"
                        : theme.id === "white"
                        ? "#ffffff"
                        : theme.id === "pink"
                        ? "#fbcfe8"
                        : theme.id === "cream"
                        ? "#fef08a"
                        : "#e9d5ff",
                    border: theme.id === "white" ? "1px solid #d4d4d8" : "none",
                  }}
                  aria-label={`Pilih warna frame ${theme.name}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Photostrip Display Area ── */}
      <div className="w-full flex justify-center items-start px-3 py-2">
        <AnimatePresence mode="wait">
          {activeTab === "duo" && (
            <motion.div
              key="duo-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4 w-full max-w-2xl"
            >
              {/* Left Strip (Strip 1) */}
              <div className="transform sm:-rotate-1 hover:rotate-0 transition-transform duration-300 w-full flex justify-center">
                {renderSingleStripUI(
                  strip1Photos,
                  "EDITION 01 • SWEET VIBES",
                  -2.5
                )}
              </div>

              {/* Right Strip (Strip 2) */}
              <div className="transform sm:rotate-1 hover:rotate-0 transition-transform duration-300 w-full flex justify-center">
                {renderSingleStripUI(
                  strip2Photos,
                  "EDITION 02 • MEMORABLE CUT",
                  2.5
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "strip1" && (
            <motion.div
              key="strip1-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="flex justify-center w-full"
            >
              {renderSingleStripUI(
                strip1Photos,
                "EDITION 01 • SWEET VIBES",
                -2
              )}
            </motion.div>
          )}

          {activeTab === "strip2" && (
            <motion.div
              key="strip2-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="flex justify-center w-full"
            >
              {renderSingleStripUI(
                strip2Photos,
                "EDITION 02 • MEMORABLE CUT",
                2
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Download Action Button ── */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          onClick={handleDownloadPhotostrip}
          disabled={isDownloading}
          type="button"
          className="relative inline-flex items-center justify-center gap-2.5 py-3 px-6 sm:px-8 rounded-2xl font-bold text-sm text-white shadow-lg active:scale-95 transition-all overflow-hidden cursor-pointer"
          style={{
            background: downloadSuccess
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : "linear-gradient(135deg, #c084fc 0%, #9333ea 100%)",
            boxShadow: downloadSuccess
              ? "0 8px 25px rgba(16, 185, 129, 0.4)"
              : "0 8px 25px rgba(147, 51, 234, 0.35)",
          }}
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Menyiapkan HD Photostrip...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check size={18} className="animate-bounce" />
              <span>Photostrip Tersimpan di Galeri! 🎉</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>
                Download {activeTab === "duo" ? "Duo Photostrip" : "Photostrip"} (HD PNG)
              </span>
            </>
          )}
        </button>

        <p className="text-[11px] text-purple-700/80 text-center font-medium">
          💡 Ketuk foto di dalam strip buat zoom & baca ceritanya yaa!
        </p>
      </div>

      {/* ── Modal Lightbox Preview (Photo Zoom & Caption) ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-purple-950/70 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative z-10 w-full max-w-sm bg-[#faf5ff] rounded-3xl p-4 sm:p-5 border border-white/80 shadow-2xl flex flex-col items-center"
              style={{
                boxShadow: "0 25px 60px rgba(88, 28, 135, 0.4)",
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-purple-800 hover:bg-white hover:text-purple-950 transition-colors shadow-sm z-20 cursor-pointer"
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

                {/* Film Cut Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white font-bold">
                  CUT #{selectedPhoto.cutNumber} • {selectedPhoto.timeTag}
                </div>
              </div>

              {/* Caption & Controls */}
              <div className="w-full mt-4 flex items-center justify-between px-2">
                <div className="text-left pr-2">
                  <h4 className="text-sm sm:text-base font-bold text-purple-950">
                    {selectedPhoto.caption}
                  </h4>
                  <p className="text-[11px] font-mono text-purple-700/70">
                    ✨ {selectedPhoto.title} • Zalfa Ramadani 💜
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleLike(selectedPhoto.id, e)}
                  className={`p-2.5 rounded-2xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold active:scale-90 cursor-pointer ${
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

