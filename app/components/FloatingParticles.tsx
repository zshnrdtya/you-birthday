import React from "react";

/**
 * FloatingParticles Component (Optimized for Lighthouse 90+ Mobile Performance)
 * - Uses 100% pure CSS keyframe animations (zero JS ticker / zero Framer Motion overhead)
 * - Uses hardware acceleration (translate3d + will-change)
 * - Reduces rendered particles on mobile by 50% (only 4 lightweight particles on mobile, 8 on desktop)
 */
export default function FloatingParticles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* ── Mobile & Desktop Particles (4 items) ── */}
      <span
        className="floating-petal-1 absolute text-lg sm:text-xl"
        style={{ left: "10%", top: "-40px", animationDelay: "0s" }}
      >
        🌸
      </span>
      <span
        className="floating-petal-2 absolute text-base sm:text-lg"
        style={{ left: "38%", top: "-40px", animationDelay: "4s" }}
      >
        ✨
      </span>
      <span
        className="floating-petal-3 absolute text-lg sm:text-xl"
        style={{ left: "68%", top: "-40px", animationDelay: "2s" }}
      >
        🌺
      </span>
      <span
        className="floating-petal-4 absolute text-sm sm:text-base"
        style={{ left: "88%", top: "-40px", animationDelay: "7s" }}
      >
        💫
      </span>

      {/* ── Desktop Only Particles (4 extra items, hidden on mobile for 50%+ reduction) ── */}
      <span
        className="floating-petal-2 absolute text-xl hidden sm:block"
        style={{ left: "24%", top: "-40px", animationDelay: "6s" }}
      >
        🌸
      </span>
      <span
        className="floating-petal-1 absolute text-lg hidden sm:block"
        style={{ left: "52%", top: "-40px", animationDelay: "9s" }}
      >
        🌼
      </span>
      <span
        className="floating-petal-4 absolute text-base hidden sm:block"
        style={{ left: "78%", top: "-40px", animationDelay: "1s" }}
      >
        ✨
      </span>
      <span
        className="floating-petal-3 absolute text-xl hidden sm:block"
        style={{ left: "94%", top: "-40px", animationDelay: "11s" }}
      >
        💮
      </span>
    </div>
  );
}
