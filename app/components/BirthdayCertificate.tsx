"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Award, Download, Check, Sparkles, Share2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function BirthdayCertificate() {
  const [downloading, setDownloading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);
  const certCardRef = useRef<HTMLDivElement>(null);

  // Trigger grand celebration confetti
  const triggerCelebration = useCallback(() => {
    setClaimed(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#ec4899", "#8b5cf6", "#fbbf24", "#a855f7", "#38bdf8"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: ["#fbbf24", "#f472b6", "#c084fc"],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors: ["#fbbf24", "#f472b6", "#c084fc"],
      });
    }, 200);
  }, []);

  // Generate crisp HD Certificate PNG image via HTML5 Canvas
  const handleDownload = async () => {
    setDownloading(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1200;
      const height = 1550;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Gradient (Soft warm pastel cream to gentle lavender)
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "#fdf4ff");
      bgGradient.addColorStop(0.5, "#ffffff");
      bgGradient.addColorStop(1, "#f3e8ff");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Outer Ornate Border
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Inner Gold Border
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, width - 120, height - 120);

      // 3. Decorative Corner Accents
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = "#a855f7";
        ctx.font = "bold 32px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✦", x, y);
      };
      drawCorner(78, 78);
      drawCorner(width - 78, 78);
      drawCorner(78, height - 78);
      drawCorner(width - 78, height - 78);

      // 4. Header Badge / Crown
      ctx.textAlign = "center";
      ctx.fillStyle = "#9333ea";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("★ PIAGAM PENGHARGAAN RESMI SEMESTA ★", width / 2, 140);

      // Main Title
      ctx.fillStyle = "#581c87";
      ctx.font = "900 52px sans-serif";
      ctx.fillText("CERTIFICATE OF AWESOMENESS", width / 2, 210);

      ctx.fillStyle = "#ec4899";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("Special Birthday Edition • Officially Certified", width / 2, 260);

      // Decorative divider
      ctx.strokeStyle = "#e9d5ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 295);
      ctx.lineTo(width - 250, 295);
      ctx.stroke();

      // Given to section
      ctx.fillStyle = "#6b21a8";
      ctx.font = "italic 24px sans-serif";
      ctx.fillText("DIBERIKAN DENGAN BANGGA KEPADA:", width / 2, 350);

      // Recipient Name
      ctx.fillStyle = "#7e22ce";
      ctx.font = "bold 64px sans-serif";
      ctx.fillText("ZALFA RAMADANI", width / 2, 435);

      // Small underline for name
      const nameGrad = ctx.createLinearGradient(350, 0, width - 350, 0);
      nameGrad.addColorStop(0, "#c084fc");
      nameGrad.addColorStop(0.5, "#ec4899");
      nameGrad.addColorStop(1, "#c084fc");
      ctx.fillStyle = nameGrad;
      ctx.fillRect(360, 465, width - 720, 6);

      // Achievement Title
      ctx.fillStyle = "#be185d";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("✨ Duta Manusia Ter-Cute & Paling Keren ✨", width / 2, 530);

      ctx.fillStyle = "#7c3aed";
      ctx.font = "600 24px sans-serif";
      ctx.fillText("Predikat: Summa Cum Laude of Good Vibes & Kindness", width / 2, 575);

      // Achievement Box Background
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.roundRect(140, 620, width - 280, 480, 24);
      ctx.fill();
      ctx.strokeStyle = "#f3e8ff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Description text points
      const points = [
        "1. Berhasil bertahan hidup, bertumbuh, dan bertambah dewasa dengan semakin mempesona.",
        "2. Memiliki senyuman yang terbukti ampuh mencerahkan hari orang-orang di sekitarnya.",
        "3. Berhasil menjadi sosok yang tangguh, baik hati, dan selalu menjadi inspirasi.",
        "4. Resmi diwajibkan untuk bahagia terus, ga boleh overthinking, dan nikmatin setiap prosesnya.",
        "5. Berhak atas segala doa terbaik, kelancaran rezeki, kesehatan, dan impian yang terkabul.",
      ];

      ctx.textAlign = "left";
      ctx.font = "500 23px sans-serif";
      ctx.fillStyle = "#4c1d95";

      points.forEach((point, i) => {
        const y = 675 + i * 85;
        // Checkmark circle
        ctx.fillStyle = "#ec4899";
        ctx.beginPath();
        ctx.arc(185, y - 8, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✓", 185, y - 3);

        ctx.textAlign = "left";
        ctx.fillStyle = "#3b0764";
        ctx.font = "500 22px sans-serif";

        // Word wrap each point nicely if needed
        const words = point.split(" ");
        let line = "";
        let lineY = y - 1;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > width - 460 && n > 0) {
            ctx.fillText(line, 215, lineY);
            line = words[n] + " ";
            lineY += 28;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 215, lineY);
      });

      // 5. Official Golden Seal Stamp
      const sealX = 260;
      const sealY = 1260;

      // Outer Gold Glow / Ring
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.arc(sealX, sealY, 95, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 82, 0, Math.PI * 2);
      ctx.stroke();

      // Seal Inner Text
      ctx.textAlign = "center";
      ctx.fillStyle = "#b45309";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("★ OFFICIAL SEAL ★", sealX, sealY - 38);

      ctx.font = "bold 32px serif";
      ctx.fillStyle = "#d97706";
      ctx.fillText("100%", sealX, sealY);

      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#92400e";
      ctx.fillText("VERIFIED AWESOME", sealX, sealY + 28);
      ctx.font = "14px sans-serif";
      ctx.fillText("5 SEPTEMBER", sealX, sealY + 50);

      // 6. Signature Section
      const sigX = width - 330;
      const sigY = 1260;

      ctx.textAlign = "center";
      ctx.fillStyle = "#4c1d95";
      ctx.font = "italic 36px 'Brush Script MT', cursive, sans-serif";
      ctx.fillText("Raditya Rai Zeeshan", sigX, sigY - 15);

      // Signature line
      ctx.strokeStyle = "#9333ea";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sigX - 140, sigY + 8);
      ctx.lineTo(sigX + 140, sigY + 8);
      ctx.stroke();

      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = "#6b21a8";
      ctx.fillText("Raditya Rai Zeeshan", sigX, sigY + 34);

      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#7c3aed";
      ctx.fillText("Ketua Pelaksana Hari Spesial Zalfa", sigX, sigY + 56);

      // Trigger download
      const imageURL = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imageURL;
      downloadLink.download = "Sertifikat_Spesial_Zalfa_Ramadani.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      triggerCelebration();
    } catch (err) {
      console.error("Gagal mendownload sertifikat:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(
      "Halo Radit! Aku udah liat websitenya dan udah klaim Sertifikat Penghargaan Spesialnya nih 🏆 Lucu dan gemes banget makasih banyak yaaa! 🥹💜"
    );
    window.open(`https://wa.me/6281946315326?text=${text}`, "_blank");
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText("👑 Sertifikat Manusia Ter-Cute & Paling Keren — Zalfa Ramadani ✨");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-sm rounded-3xl p-5 sm:p-6 text-center glass-card mt-8 flex flex-col items-center select-none"
      style={{
        boxShadow: "0 16px 40px rgba(168, 85, 247, 0.18)",
      }}
    >
      {/* ── Section Header ── */}
      <div className="space-y-1 mb-5">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100/90 text-amber-800 border border-amber-300/70 shadow-xs">
          🏆 Piagam Penghargaan Resmi
        </span>
        <h3 className="text-xl font-extrabold text-purple-950 tracking-tight">
          Certificate of Awesomeness ✨
        </h3>
        <p className="text-xs text-purple-700/80 leading-relaxed max-w-xs mx-auto">
          Penghargaan khusus dan sah yang cuma dimiliki oleh satu orang di dunia: <b>Zalfa Ramadani</b> 💜
        </p>
      </div>

      {/* ── Certificate Preview Card ── */}
      <div
        ref={certCardRef}
        className="w-full rounded-2xl p-5 relative overflow-hidden flex flex-col items-center text-center shadow-lg border-2 border-amber-300/80"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #faf5ff 50%, #fdf4ff 100%)",
        }}
      >
        {/* Subtle Watermark BG */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center font-black text-8xl text-purple-900">
          ZALFA
        </div>

        {/* Ornate Corner Stars */}
        <span className="absolute top-2 left-2 text-amber-500 text-xs">✦</span>
        <span className="absolute top-2 right-2 text-amber-500 text-xs">✦</span>
        <span className="absolute bottom-2 left-2 text-amber-500 text-xs">✦</span>
        <span className="absolute bottom-2 right-2 text-amber-500 text-xs">✦</span>

        {/* Certificate Badge Ribbon */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-500 shadow-md flex items-center justify-center text-amber-900 mb-2">
          <Award size={24} className="drop-shadow-xs" />
        </div>

        <p className="text-[10px] font-bold tracking-widest text-purple-600 uppercase">
          Piagam Penghargaan Ulang Tahun
        </p>

        {/* Name */}
        <h4 className="text-xl font-black text-purple-950 tracking-tight mt-1 mb-0.5">
          ZALFA RAMADANI
        </h4>
        <div className="w-28 h-0.5 bg-gradient-to-r from-purple-300 via-pink-400 to-purple-300 rounded-full mb-3" />

        {/* Title Award */}
        <div className="bg-purple-100/70 border border-purple-200/80 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-900 mb-3 shadow-xs">
          ✨ Duta Manusia Ter-Cute & Paling Keren ✨
        </div>

        {/* Achievements checklist */}
        <div className="w-full text-left space-y-2 text-[11px] text-purple-900/90 font-medium bg-white/70 p-3.5 rounded-xl border border-purple-100 mb-4 shadow-2xs">
          <div className="flex items-start gap-2">
            <span className="text-pink-500 font-bold">✓</span>
            <span>Berhasil bertumbuh dan semakin dewasa dengan luar biasa.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-pink-500 font-bold">✓</span>
            <span>Senyumannya terbukti mencerahkan hari banyak orang.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-pink-500 font-bold">✓</span>
            <span>Diwajibkan selalu bahagia dan dilarang overthinking!</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-pink-500 font-bold">✓</span>
            <span>Berhak atas segala hal baik dan impian yang tercapai.</span>
          </div>
        </div>

        {/* Seal and Signatures */}
        <div className="w-full flex items-center justify-between pt-2 border-t border-purple-200/60 px-1">
          {/* Gold Stamp Seal */}
          <div className="flex items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-400 flex flex-col items-center justify-center text-[8px] font-bold text-amber-800 shadow-2xs">
              <span>★ 100% ★</span>
              <span className="text-[7px]">VERIFIED</span>
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-amber-900">Official Seal</p>
              <p className="text-[8px] text-purple-600 font-mono">05.09.2009</p>
            </div>
          </div>

          {/* Signature */}
          <div className="text-right">
            <p className="text-xs font-serif italic text-purple-900 font-bold">
              Raditya Rai Zeeshan
            </p>
            <p className="text-[9px] text-purple-600 font-medium -mt-0.5">
              Ketua Panitia Spesial
            </p>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="w-full mt-5 space-y-2.5">
        {/* Download Button */}
        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
            boxShadow: "0 8px 24px rgba(217, 119, 6, 0.35)",
          }}
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Membuat Sertifikat HD...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Download Piagam HD (.png) 📸</span>
            </>
          )}
        </motion.button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <motion.button
            onClick={triggerCelebration}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-800 bg-white/70 hover:bg-white active:scale-95 transition-all border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>{claimed ? "Rayakan Lagi 🎉" : "Klaim Piagam 👑"}</span>
          </motion.button>

          <motion.button
            onClick={handleCopyTitle}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-800 bg-white/70 hover:bg-white active:scale-95 transition-all border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-600" />
                <span className="text-green-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 size={14} className="text-purple-600" />
                <span>Salin Judul</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Share to WA Option */}
        <motion.button
          onClick={handleShareWA}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="w-full py-2 px-3 rounded-xl text-[11px] font-semibold text-green-800 bg-green-50 hover:bg-green-100/80 active:scale-95 transition-all border border-green-200/80 shadow-2xs flex items-center justify-center gap-1.5"
        >
          <span>💬 Pamerkan Sertifikat ke Raditya di WhatsApp</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
