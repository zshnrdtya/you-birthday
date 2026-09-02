"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export interface ToastData {
  show: boolean;
  title: string;
  message: string;
  icon?: React.ReactNode;
}

interface ToastNotificationProps {
  toast: ToastData;
  onClose: () => void;
  duration?: number;
}

/**
 * Glassmorphic Toast Notification Component
 * - Displays an aesthetic floating alert badge at top-center
 * - Smooth spring entrance and slide-up exit animation
 * - Animated countdown timer progress bar
 * - Multi-device responsive design with manual close button
 */
export default function ToastNotification({
  toast,
  onClose,
  duration = 4000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.show, onClose, duration]);

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -45, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="fixed top-5 inset-x-0 mx-auto z-[9999] w-[92%] max-w-sm pointer-events-auto"
        >
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl shadow-2xl relative overflow-hidden select-none border border-white/85"
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 20px 48px -10px rgba(168, 85, 247, 0.32), 0 6px 18px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Left glowing icon circle */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
              {toast.icon || <CheckCircle2 size={22} className="text-white" />}
            </div>

            {/* Content text */}
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-xs sm:text-sm font-bold text-purple-950 truncate">
                {toast.title}
              </h5>
              <p className="text-[11px] sm:text-xs text-purple-800/80 leading-snug line-clamp-2">
                {toast.message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center text-purple-400 hover:text-purple-700 hover:bg-purple-100/60 transition-colors shrink-0 cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X size={15} />
            </button>

            {/* Animated Bottom Timer Progress Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
