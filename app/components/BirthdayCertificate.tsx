"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Check,
  Sparkles,
  CreditCard,
  Plane,
  Receipt,
  Heart,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

type CertTheme = "ktp" | "boarding" | "receipt";

interface ThemeTab {
  id: CertTheme;
  name: string;
  badge: string;
  icon: typeof CreditCard;
}

const THEME_TABS: ThemeTab[] = [
  { id: "ktp", name: "KTP Semesta", badge: "🪪 Resident ID", icon: CreditCard },
  { id: "boarding", name: "Boarding Pass", badge: "🎫 VIP Ticket", icon: Plane },
  { id: "receipt", name: "Struk Semesta", badge: "🧾 Cafe Receipt", icon: Receipt },
];

export default function BirthdayCertificate() {
  const [activeTheme, setActiveTheme] = useState<CertTheme>("ktp");
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const certContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to load photo into canvas
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  // Grand festive celebration confetti
  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#a855f7", "#ec4899", "#fbbf24", "#38bdf8", "#c084fc", "#f472b6"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.7 },
        colors: ["#fbbf24", "#f472b6", "#c084fc"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.7 },
        colors: ["#fbbf24", "#f472b6", "#c084fc"],
      });
    }, 200);
  }, []);

  // ── 1. DRAW KTP SEMESTA ON CANVAS ──
  const drawKTPOnCanvas = (ctx: CanvasRenderingContext2D, photoImg: HTMLImageElement | null) => {
    const width = 1200;
    const height = 760;

    // Card background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#fdf4ff");
    bgGrad.addColorStop(0.5, "#ffffff");
    bgGrad.addColorStop(1, "#f3e8ff");
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 36);
    ctx.fill();

    // Outer and Inner borders
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(16, 16, width - 32, height - 32, 28);
    ctx.stroke();

    ctx.strokeStyle = "#f3e8ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(28, 28, width - 56, height - 56, 22);
    ctx.stroke();

    // Header Badge
    ctx.textAlign = "center";
    ctx.fillStyle = "#9333ea";
    ctx.font = "bold 20px monospace";
    ctx.fillText("★ REPUBLIK SEMESTA RAYA ★", width / 2, 70);

    ctx.fillStyle = "#581c87";
    ctx.font = "900 32px sans-serif";
    ctx.fillText("KARTU TANDA PENDUDUK SPESIAL (KTP-S)", width / 2, 112);

    ctx.fillStyle = "#7e22ce";
    ctx.font = "600 15px sans-serif";
    ctx.fillText("PROVINSI KEBAHAGIAAN • KOTA KECERIAAN", width / 2, 138);

    // Decorative line
    ctx.strokeStyle = "#e9d5ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 155);
    ctx.lineTo(width - 120, 155);
    ctx.stroke();

    // ── Left Side: Photo Frame ──
    const px = 85;
    const py = 190;
    const pw = 280;
    const ph = 360;

    ctx.fillStyle = "#e9d5ff";
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 20);
    ctx.fill();

    if (photoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 20);
      ctx.clip();
      ctx.drawImage(photoImg, px, py, pw, ph);
      ctx.restore();
    }

    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 20);
    ctx.stroke();

    // Pill badge under photo
    ctx.fillStyle = "#7e22ce";
    ctx.beginPath();
    ctx.roundRect(px + 20, py + ph + 24, pw - 40, 42, 21);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "center";
    ctx.fillText("BERLAKU: SEUMUR HIDUP", px + pw / 2, py + ph + 50);

    // ── Metallic Microchip Next to Photo ──
    const chipX = 410;
    const chipY = 195;
    const chipW = 80;
    const chipH = 62;

    const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
    chipGrad.addColorStop(0, "#fde68a");
    chipGrad.addColorStop(0.5, "#d97706");
    chipGrad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = chipGrad;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, chipW, chipH, 12);
    ctx.fill();
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Chip circuit lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(chipX + 24, chipY);
    ctx.lineTo(chipX + 24, chipY + chipH);
    ctx.moveTo(chipX + chipW - 24, chipY);
    ctx.lineTo(chipX + chipW - 24, chipY + chipH);
    ctx.moveTo(chipX, chipY + chipH / 2);
    ctx.lineTo(chipX + chipW, chipY + chipH / 2);
    ctx.stroke();

    // ── Right Side: Details Information ──
    // NIK
    ctx.textAlign = "left";
    ctx.fillStyle = "#6b21a8";
    ctx.font = "bold 20px monospace";
    ctx.fillText("NIK :", 515, 222);

    ctx.fillStyle = "#581c87";
    ctx.font = "900 28px monospace";
    ctx.fillText("0509 • 2009 • 2026 • 0001", 585, 222);

    // Rows of info
    const dataRows = [
      { label: "Nama Lengkap", value: "ZALFA RAMADANI 🌸" },
      { label: "Tempat/Tgl Lahir", value: "Bumi, 05 September 2009" },
      { label: "Golongan Vibes", value: "A+ (100% Manis, 0% Ngeselin)" },
      { label: "Status Kedewasaan", value: "Level Up (+1 Tahun Lebih Keren)" },
      { label: "Pekerjaan Utama", value: "Penebar Senyum & Duta Mood Booster" },
      { label: "Masa Berlaku", value: "SEUMUR HIDUP (Anti Expired)" },
    ];

    dataRows.forEach((row, i) => {
      const rowY = 295 + i * 54;

      ctx.fillStyle = "#7c3aed";
      ctx.font = "600 18px sans-serif";
      ctx.fillText(row.label, 415, rowY);

      ctx.fillStyle = "#9333ea";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(":", 625, rowY);

      ctx.fillStyle = "#3b0764";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(row.value, 645, rowY);
    });

    // ── Bottom Right: Gold Seal Stamp ──
    const sealX = 1040;
    const sealY = 620;
    const sealR = 64;

    ctx.fillStyle = "#fef3c7";
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#b45309";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("★ RESMI ★", sealX, sealY - 26);

    ctx.fillStyle = "#d97706";
    ctx.font = "900 26px serif";
    ctx.fillText("100%", sealX, sealY + 2);

    ctx.fillStyle = "#92400e";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("VERIFIED CUTE", sealX, sealY + 24);
  };

  // ── 2. DRAW BOARDING PASS ON CANVAS ──
  const drawBoardingPassOnCanvas = (ctx: CanvasRenderingContext2D, photoImg: HTMLImageElement | null) => {
    const width = 1400;
    const height = 680;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#fdf4ff");
    bgGrad.addColorStop(0.5, "#ffffff");
    bgGrad.addColorStop(1, "#f3e8ff");
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 32);
    ctx.fill();

    ctx.strokeStyle = "#e9d5ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(14, 14, width - 28, height - 28, 26);
    ctx.stroke();

    // Dotted vertical perforation cut line separating Main Ticket and Stub
    const stubX = 1000;
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(stubX, 20);
    ctx.lineTo(stubX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]); // reset line dash

    // Circular notches for perforation
    ctx.fillStyle = "#f3e8ff";
    ctx.beginPath();
    ctx.arc(stubX, 14, 24, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(stubX, height - 14, 24, Math.PI, 0);
    ctx.fill();

    // ── Main Ticket Header ──
    ctx.textAlign = "left";
    ctx.fillStyle = "#9333ea";
    ctx.font = "bold 20px monospace";
    ctx.fillText("✦ ZALFA AIRWAYS • FIRST CLASS ✦", 60, 68);

    ctx.fillStyle = "#3b0764";
    ctx.font = "900 34px sans-serif";
    ctx.fillText("BOARDING PASS • NEW AGE FLIGHT", 60, 114);

    // Route Graphic Banner
    const routeY = 185;
    ctx.fillStyle = "#f5f3ff";
    ctx.beginPath();
    ctx.roundRect(60, routeY - 35, 880, 80, 20);
    ctx.fill();
    ctx.strokeStyle = "#e0e7ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 15px monospace";
    ctx.fillText("ORIGIN", 85, routeY - 10);
    ctx.fillStyle = "#1e1b4b";
    ctx.font = "900 24px sans-serif";
    ctx.fillText("UMUR KEMARIN (2025)", 85, routeY + 24);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ec4899";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("✈️ ➔", 490, routeY + 12);

    ctx.textAlign = "right";
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 15px monospace";
    ctx.fillText("DESTINATION", 915, routeY - 10);
    ctx.fillStyle = "#701a75";
    ctx.font = "900 24px sans-serif";
    ctx.fillText("BABAK BARU PALING BAHAGIA (2026+)", 915, routeY + 24);

    // Passenger & Flight Info Columns
    const gridY = 320;
    const fields = [
      { label: "PASSENGER NAME", value: "ZALFA RAMADANI 🌸" },
      { label: "FLIGHT NO", value: "HBD-0509" },
      { label: "GATE", value: "05" },
      { label: "SEAT NUMBER", value: "05A (VIP SUITE)" },
      { label: "DATE", value: "05 SEP 2026" },
      { label: "BAGGAGE ALLOWANCE", value: "UNLIMITED HAPPINESS & DREAMS" },
    ];

    ctx.textAlign = "left";
    fields.forEach((f, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const fx = 60 + col * 440;
      const fy = gridY + row * 85;

      ctx.fillStyle = "#7c3aed";
      ctx.font = "bold 15px monospace";
      ctx.fillText(f.label, fx, fy);

      ctx.fillStyle = "#18181b";
      ctx.font = "900 24px sans-serif";
      ctx.fillText(f.value, fx, fy + 32);
    });

    // Barcode on Main Ticket Bottom
    const barStartX = 60;
    const barY = 580;
    const barcodeBars = [4, 2, 2, 4, 1, 3, 2, 4, 1, 2, 4, 2, 1, 3, 4, 2, 1, 2, 4, 1, 3, 2, 4, 2, 1, 4, 2, 3];
    let curX = barStartX;
    ctx.fillStyle = "#18181b";
    barcodeBars.forEach((w, i) => {
      if (i % 2 === 0) ctx.fillRect(curX, barY, w * 2.5, 42);
      curX += w * 2.5 + 4;
    });

    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("0509 • 2009 • 2026 • VIP PASS", 60, barY + 62);

    // ── Right Ticket Stub ──
    const stubCenterX = stubX + (width - stubX) / 2;

    ctx.textAlign = "center";
    ctx.fillStyle = "#9333ea";
    ctx.font = "bold 18px monospace";
    ctx.fillText("ZALFA AIRWAYS", stubCenterX, 68);

    ctx.fillStyle = "#3b0764";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("BOARDING STUB", stubCenterX, 95);

    // Photo inside stub
    if (photoImg) {
      const spx = stubCenterX - 90;
      const spy = 130;
      const spw = 180;
      const sph = 200;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(spx, spy, spw, sph, 18);
      ctx.clip();
      ctx.drawImage(photoImg, spx, spy, spw, sph);
      ctx.restore();

      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(spx, spy, spw, sph, 18);
      ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 14px monospace";
    ctx.fillText("PASSENGER", stubCenterX, 370);

    ctx.fillStyle = "#18181b";
    ctx.font = "900 20px sans-serif";
    ctx.fillText("ZALFA RAMADANI", stubCenterX, 395);

    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 14px monospace";
    ctx.fillText("SEAT: 05A  •  GATE: 05", stubCenterX, 430);

    // Retro Red Stamp on Stub
    ctx.save();
    ctx.translate(stubCenterX, 530);
    ctx.rotate(-0.12);
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-120, -36, 240, 72, 14);
    ctx.stroke();

    ctx.fillStyle = "#e11d48";
    ctx.font = "900 20px monospace";
    ctx.fillText("★ BOARDED ★", 0, -4);
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("OFFICIALLY APPROVED", 0, 18);
    ctx.restore();
  };

  // ── 3. DRAW AESTHETIC RECEIPT ON CANVAS ──
  const drawReceiptOnCanvas = (ctx: CanvasRenderingContext2D) => {
    const width = 800;
    const height = 1380;

    // Receipt paper background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, width, height);

    // Subtle paper texture border
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Header
    ctx.textAlign = "center";
    ctx.fillStyle = "#18181b";
    ctx.font = "bold 26px monospace";
    ctx.fillText("☕ KEDAI KEBAHAGIAAN SEMESTA", width / 2, 70);

    ctx.font = "14px monospace";
    ctx.fillStyle = "#52525b";
    ctx.fillText("CABANG BUMI • SPECIAL EDITION FOR ZALFA", width / 2, 100);
    ctx.fillText("Jl. Menuju Masa Depan No. 0509", width / 2, 124);

    // Dashed divider line
    const drawDashedDivider = (y: number) => {
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 50, y);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawDashedDivider(150);

    // Transaction info
    ctx.textAlign = "left";
    ctx.font = "15px monospace";
    ctx.fillStyle = "#3f3f46";
    ctx.fillText("TANGGAL : 05/09/2026", 50, 180);
    ctx.fillText("JAM     : 12:00:00 WIB", 50, 205);
    ctx.fillText("NO. STRUK: #HBD-ZALFA-2026", 50, 230);
    ctx.fillText("KASIR   : Raditya", 50, 255);

    drawDashedDivider(280);

    // Items table header
    ctx.font = "bold 16px monospace";
    ctx.fillStyle = "#18181b";
    ctx.fillText("MENU PESANAN", 50, 312);
    ctx.textAlign = "right";
    ctx.fillText("HARGA", width - 50, 312);

    drawDashedDivider(330);

    // Items list
    const items = [
      { name: "1x Paket Sehat & Panjang Umur", price: "Rp 0" },
      { name: "1x Kebahagiaan Tanpa Batas", price: "Rp 0" },
      { name: "1x Bebas Overthinking 365 Hari", price: "Rp 0" },
      { name: "1x Rezeki Melimpah & Lancar Urusan", price: "Rp 0" },
      { name: "1x Senyuman Manis Anti Luntur", price: "Rp 0" },
      { name: "1x Dikelilingi Orang-Orang Tulus", price: "Rp 0" },
      { name: "1x Semua Doa Dikabulkan Tepat Waktu", price: "Rp 0" },
      { name: "1x Kebaikan & Sukses Selalu", price: "Rp 0" },
    ];

    items.forEach((item, idx) => {
      const iy = 370 + idx * 58;

      ctx.textAlign = "left";
      ctx.font = "16px monospace";
      ctx.fillStyle = "#27272a";
      ctx.fillText(item.name, 50, iy);

      ctx.textAlign = "right";
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = "#18181b";
      ctx.fillText(item.price, width - 50, iy);
    });

    const totalY = 370 + items.length * 58 + 20;
    drawDashedDivider(totalY);

    // Total Calculation Section
    const totals = [
      { label: "SUBTOTAL", val: "Rp 0" },
      { label: "DISKON ULTAH (100%)", val: "-Rp 0" },
      { label: "TOTAL TAGIHAN", val: "Rp 0", bold: true },
      { label: "METODE PEMBAYARAN", val: "DITANGGUNG SEMESTA" },
      { label: "STATUS", val: "LUNAS (PAID IN FULL)", bold: true },
    ];

    totals.forEach((t, idx) => {
      const ty = totalY + 40 + idx * 42;

      ctx.textAlign = "left";
      ctx.font = t.bold ? "bold 18px monospace" : "16px monospace";
      ctx.fillStyle = t.bold ? "#9333ea" : "#3f3f46";
      ctx.fillText(t.label, 50, ty);

      ctx.textAlign = "right";
      ctx.font = t.bold ? "bold 18px monospace" : "16px monospace";
      ctx.fillStyle = t.bold ? "#9333ea" : "#18181b";
      ctx.fillText(t.val, width - 50, ty);
    });

    const barcodeSectionY = totalY + 280;
    drawDashedDivider(barcodeSectionY);

    // Centered Barcode
    const barcodeBars = [
      3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 4, 2, 3,
    ];
    const totalBarcodeW = barcodeBars.reduce((a, b) => a + b * 2.8, 0);
    const startBX = (width - totalBarcodeW) / 2;
    const barH = 46;
    let cbX = startBX;

    ctx.fillStyle = "#18181b";
    barcodeBars.forEach((w, i) => {
      if (i % 2 === 0) ctx.fillRect(cbX, barcodeSectionY + 25, w * 2.8, barH);
      cbX += w * 2.8;
    });

    ctx.textAlign = "center";
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#52525b";
    ctx.fillText("0509  •  2009  •  2026", width / 2, barcodeSectionY + 25 + barH + 22);

    // Sweet Thank You message
    ctx.font = "bold 18px monospace";
    ctx.fillStyle = "#9333ea";
    ctx.fillText("♡ TERIMA KASIH TELAH LAHIR KE DUNIA ♡", width / 2, barcodeSectionY + 124);

    ctx.font = "14px monospace";
    ctx.fillStyle = "#71717a";
    ctx.fillText("Barang yang sudah diterima tidak dapat ditukar", width / 2, barcodeSectionY + 152);
    ctx.fillText("karena kamu sudah sempurna apa adanya ✨", width / 2, barcodeSectionY + 174);
  };

  // ── GENERAL CANVAS DOWNLOAD HANDLER ──
  const handleDownload = async () => {
    setDownloading(true);

    try {
      // Preload Zalfa's photo for KTP / Boarding pass
      const photoImg = await loadImage("/photos/foto1.jpeg").catch(() => null);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      let fileName = "Sertifikat_Spesial_Zalfa.png";

      if (activeTheme === "ktp") {
        canvas.width = 1200;
        canvas.height = 760;
        drawKTPOnCanvas(ctx, photoImg);
        fileName = "KTP_Semesta_Zalfa_Ramadani.png";
      } else if (activeTheme === "boarding") {
        canvas.width = 1400;
        canvas.height = 680;
        drawBoardingPassOnCanvas(ctx, photoImg);
        fileName = "Boarding_Pass_Zalfa_Ramadani.png";
      } else {
        canvas.width = 800;
        canvas.height = 1380;
        drawReceiptOnCanvas(ctx);
        fileName = "Struk_Belanja_Semesta_Zalfa.png";
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloading(false);
        setDownloadSuccess(true);
        triggerCelebration();

        setTimeout(() => setDownloadSuccess(false), 3500);
      }, "image/png");
    } catch (err) {
      console.error("Gagal mendownload sertifikat:", err);
      setDownloading(false);
    }
  };

  const handleShareWA = () => {
    let msg = "";
    if (activeTheme === "ktp") {
      msg =
        "Halo Radit! Aku udah klaim KTP Penduduk Semesta resmiku di website nih 🪪✨ Lucu dan gemes banget makasih banyak yaaa! 🥹💜";
    } else if (activeTheme === "boarding") {
      msg =
        "Halo Radit! Tiket penerbangan first-class ke umur baruku udah di-boarded nih 🎫✈️ Keren banget konsep tiketnya makasih banyak yaaa! 🥹💜";
    } else {
      msg =
        "Halo Radit! Struk belanja kebahagiaan dari kedai semesta udah aku terima nih 🧾 Lucu banget totalnya gratis lunas makasih yaaa! 🥹💜";
    }
    window.open(`https://wa.me/6281946315326?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCopyTitle = () => {
    let text = "";
    if (activeTheme === "ktp") text = "🪪 KTP Penduduk Resmi Semesta — Zalfa Ramadani 🌸";
    else if (activeTheme === "boarding") text = "🎫 Boarding Pass VIP Flight to New Age — Zalfa Ramadani ✈️";
    else text = "🧾 Struk Belanja Kebahagiaan Semesta — Zalfa Ramadani ☕";

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md rounded-3xl p-5 sm:p-6 text-center glass-card mt-10 flex flex-col items-center select-none"
      style={{
        boxShadow: "0 16px 40px rgba(168, 85, 247, 0.18)",
      }}
    >
      {/* ── Section Header ── */}
      <div className="space-y-1.5 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100/90 text-amber-800 border border-amber-300/70 shadow-xs">
          <Sparkles size={13} className="text-amber-600" />
          Dokumen Spesial Semesta
          <Sparkles size={13} className="text-amber-600" />
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
          Exclusive Recognition Award 🏆✨
        </h3>
        <p className="text-xs text-purple-700/80 leading-relaxed max-w-sm mx-auto">
          Pilih tema sertifikat gemes favorit kamu! Bisa ganti mode KTP, Boarding Pass, atau Struk Belanja dan langsung diunduh ke HP 💜
        </p>
      </div>

      {/* ── Theme Switcher Bar (Like Photostrip) ── */}
      <div className="inline-flex p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-purple-200/70 shadow-xs mb-6 max-w-full overflow-x-auto">
        {THEME_TABS.map((tab) => {
          const isSelected = activeTheme === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTheme(tab.id)}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-purple-900/75 hover:text-purple-950 hover:bg-purple-100/50"
              }`}
            >
              <Icon size={14} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── Interactive Preview Card Display ── */}
      <div ref={certContainerRef} className="w-full flex justify-center py-1">
        <AnimatePresence mode="wait">
          {/* ── 1. TEMA KTP SEMESTA ── */}
          {activeTheme === "ktp" && (
            <motion.div
              key="ktp-card"
              initial={{ opacity: 0, scale: 0.95, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateY: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-2xl p-4 sm:p-5 relative overflow-hidden text-left shadow-xl border-2 border-purple-300 bg-gradient-to-br from-white via-purple-50 to-pink-50"
              style={{
                boxShadow: "0 18px 45px -8px rgba(168, 85, 247, 0.25)",
              }}
            >
              {/* Header */}
              <div className="text-center pb-2 border-b border-purple-200/80">
                <p className="text-[9px] font-mono font-bold tracking-widest text-purple-600 uppercase">
                  ★ REPUBLIK SEMESTA RAYA ★
                </p>
                <h4 className="text-sm sm:text-base font-black text-purple-950 tracking-tight">
                  KARTU TANDA PENDUDUK SPESIAL
                </h4>
                <p className="text-[9px] font-medium text-purple-700/80">
                  PROVINSI KEBAHAGIAAN • KOTA KECERIAAN
                </p>
              </div>

              {/* Body */}
              <div className="flex gap-3.5 pt-3 items-start">
                {/* Photo & Microchip */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  {/* Microchip */}
                  <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 border border-amber-600 shadow-xs flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-x-0 h-0.5 bg-amber-700/40 top-1/2 -translate-y-1/2" />
                    <div className="absolute inset-y-0 w-0.5 bg-amber-700/40 left-1/3" />
                    <div className="absolute inset-y-0 w-0.5 bg-amber-700/40 right-1/3" />
                  </div>

                  {/* Photo Frame */}
                  <div className="w-20 h-26 rounded-xl overflow-hidden bg-purple-200 border-2 border-purple-400 shadow-sm relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/photos/foto1.jpeg"
                      alt="Zalfa KTP"
                      className="w-full h-full object-cover select-none"
                    />
                  </div>

                  <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-purple-700 text-white text-center">
                    SEUMUR HIDUP
                  </span>
                </div>

                {/* Details list */}
                <div className="flex-1 space-y-1 text-[10px] sm:text-[11px]">
                  <div className="pb-1 border-b border-purple-200/60">
                    <span className="font-mono text-[9px] text-purple-600 font-bold block">
                      NIK :
                    </span>
                    <span className="font-black font-mono text-purple-950 tracking-wider text-xs">
                      0509 • 2009 • 2026
                    </span>
                  </div>

                  <div className="grid grid-cols-[85px_1fr] gap-x-1 pt-0.5">
                    <span className="text-purple-700/80 font-medium">Nama</span>
                    <span className="font-bold text-purple-950">: ZALFA RAMADANI 🌸</span>

                    <span className="text-purple-700/80 font-medium">Tgl Lahir</span>
                    <span className="font-semibold text-purple-950">: 05-09-2009</span>

                    <span className="text-purple-700/80 font-medium">Gol. Vibes</span>
                    <span className="font-bold text-pink-600">: 100% Manis (0% Ngeselin)</span>

                    <span className="text-purple-700/80 font-medium">Status</span>
                    <span className="font-bold text-purple-900">: Level Up (+1 Tahun)</span>

                    <span className="text-purple-700/80 font-medium">Pekerjaan</span>
                    <span className="font-semibold text-purple-950">: Duta Mood Booster</span>
                  </div>
                </div>
              </div>

              {/* Footer Seal */}
              <div className="w-full pt-2 mt-2 border-t border-purple-200/60 flex items-center justify-between text-[9px]">
                <span className="text-purple-600 font-mono italic">
                  Dikeluarkan oleh: Raditya Rai Zeeshan
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[8px]">
                  <span>★ VERIFIED CUTE</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 2. TEMA BOARDING PASS ── */}
          {activeTheme === "boarding" && (
            <motion.div
              key="boarding-card"
              initial={{ opacity: 0, scale: 0.95, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateY: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-2xl p-4 sm:p-5 relative overflow-hidden text-left shadow-xl border-2 border-purple-300 bg-gradient-to-r from-[#faf5ff] via-white to-[#fdf4ff]"
              style={{
                boxShadow: "0 18px 45px -8px rgba(168, 85, 247, 0.25)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-purple-200/80">
                <div>
                  <p className="text-[9px] font-mono font-bold tracking-widest text-purple-600 uppercase">
                    ✦ ZALFA AIRWAYS • FIRST CLASS ✦
                  </p>
                  <h4 className="text-sm sm:text-base font-black text-purple-950">
                    VIP BOARDING PASS
                  </h4>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-700 font-bold text-[9px]">
                  FLIGHT #HBD-0509
                </div>
              </div>

              {/* Route banner */}
              <div className="my-2.5 p-2 rounded-xl bg-purple-100/70 border border-purple-200/70 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[8px] font-mono text-purple-600 font-bold block">
                    FROM
                  </span>
                  <span className="font-bold text-purple-950">Umur Kemarin</span>
                </div>
                <span className="text-pink-500 font-bold">✈️ ➔</span>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-purple-600 font-bold block">
                    DESTINATION
                  </span>
                  <span className="font-extrabold text-purple-950">Babak Baru 2026+</span>
                </div>
              </div>

              {/* Flight details grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-[11px] pt-1 pb-2 border-b border-dashed border-purple-200">
                <div>
                  <span className="text-purple-600 text-[9px] block">PASSENGER</span>
                  <span className="font-black text-purple-950">ZALFA R.</span>
                </div>
                <div>
                  <span className="text-purple-600 text-[9px] block">SEAT</span>
                  <span className="font-black text-purple-950">05A (VIP)</span>
                </div>
                <div>
                  <span className="text-purple-600 text-[9px] block">GATE</span>
                  <span className="font-black text-purple-950">05</span>
                </div>
              </div>

              {/* Ticket footer with barcode */}
              <div className="pt-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-purple-900">
                    BAGGAGE: UNLIMITED HAPPINESS & DREAMS
                  </p>
                  <p className="text-[8px] text-purple-600 font-mono">
                    0509 • 2009 • 2026
                  </p>
                </div>

                <div className="px-2 py-1 rounded-lg bg-rose-100 border border-rose-400 text-rose-800 text-[9px] font-mono font-black rotate-[-3deg] shadow-2xs">
                  ★ BOARDED ★
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 3. TEMA STRUK SEMESTA ── */}
          {activeTheme === "receipt" && (
            <motion.div
              key="receipt-card"
              initial={{ opacity: 0, scale: 0.95, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateY: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-2xl p-4 sm:p-5 relative text-left shadow-xl border border-neutral-300 bg-neutral-50 font-mono"
              style={{
                boxShadow: "0 18px 45px -8px rgba(0, 0, 0, 0.12)",
              }}
            >
              {/* Header */}
              <div className="text-center pb-2 border-b border-dashed border-neutral-400">
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                  ☕ KEDAI KEBAHAGIAAN SEMESTA
                </h4>
                <p className="text-[9px] text-neutral-600">
                  Jl. Menuju Masa Depan No. 0509
                </p>
                <p className="text-[9px] text-neutral-500">
                  Tgl: 05/09/2026 • Kasir: Raditya
                </p>
              </div>

              {/* Order Items */}
              <div className="py-2.5 space-y-1 text-[10px] sm:text-[11px] border-b border-dashed border-neutral-400">
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>1x Paket Sehat & Panjang Umur</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>1x Kebahagiaan Tanpa Batas</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>1x Bebas Overthinking 365 Hari</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>1x Senyuman Manis Anti Luntur</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>1x Dikelilingi Orang Tulus</span>
                  <span>Rp 0</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="py-2 text-[10px] sm:text-[11px] space-y-0.5 border-b border-dashed border-neutral-400">
                <div className="flex justify-between text-neutral-600">
                  <span>SUBTOTAL</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between text-pink-600 font-semibold">
                  <span>DISKON ULTAN (100%)</span>
                  <span>-Rp 0</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-purple-950 pt-0.5">
                  <span>TOTAL TAGIHAN</span>
                  <span>Rp 0 (LUNAS)</span>
                </div>
                <div className="flex justify-between text-[9px] text-neutral-500 pt-0.5">
                  <span>METODE BAYAR</span>
                  <span>DITANGGUNG SEMESTA</span>
                </div>
              </div>

              {/* Footer barcode and thank you */}
              <div className="pt-2 text-center space-y-1">
                <p className="text-[9px] font-bold text-purple-900">
                  ♡ TERIMA KASIH TELAH LAHIR KE DUNIA ♡
                </p>
                <span className="text-[8px] text-neutral-500 block">
                  Barang tidak dapat ditukar karena kamu sudah sempurna ✨
                </span>
                <span className="text-[8px] tracking-widest text-neutral-400 block pt-0.5">
                  ||| | |||| | || | |||| |||
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Action Buttons ── */}
      <div className="w-full mt-6 space-y-2.5">
        {/* Main Download HD PNG Button */}
        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
          style={{
            background: downloadSuccess
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
            boxShadow: downloadSuccess
              ? "0 8px 24px rgba(16, 185, 129, 0.4)"
              : "0 8px 24px rgba(147, 51, 234, 0.35)",
          }}
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Membuat Dokumen HD...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check size={18} className="animate-bounce" />
              <span>Dokumen Tersimpan di Galeri! 🎉</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>
                Download{" "}
                {activeTheme === "ktp"
                  ? "KTP Semesta"
                  : activeTheme === "boarding"
                  ? "Boarding Pass"
                  : "Struk Semesta"}{" "}
                (HD PNG)
              </span>
            </>
          )}
        </motion.button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <motion.button
            onClick={triggerCelebration}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-800 bg-white/70 hover:bg-white active:scale-95 transition-all border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Rayakan 🎉</span>
          </motion.button>

          <motion.button
            onClick={handleCopyTitle}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-800 bg-white/70 hover:bg-white active:scale-95 transition-all border border-purple-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
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

        {/* Share to WhatsApp Button tailored to active theme */}
        <motion.button
          onClick={handleShareWA}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-green-800 bg-green-50 hover:bg-green-100 active:scale-95 transition-all border border-green-200/80 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>
            💬 Pamerkan{" "}
            {activeTheme === "ktp"
              ? "KTP Semesta"
              : activeTheme === "boarding"
              ? "Boarding Pass"
              : "Struk Belanja"}{" "}
            ke WhatsApp
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

