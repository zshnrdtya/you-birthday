import FloatingParticles from "./components/FloatingParticles";
import PasscodeFlow from "./components/PasscodeFlow";

/**
 * Main Page (React Server Component - 100 Lighthouse Target)
 * - Zero client-side JS overhead on the main wrapper
 * - Background gradient & layout computed purely on the server
 * - Server-rendered pure CSS floating particles
 * - Interactive client boundary isolated strictly inside <PasscodeFlow />
 */
export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-300 via-purple-100 to-pink-50 relative flex flex-col justify-between overflow-x-hidden">
      {/* ── Server-Rendered Pure CSS Particles (Zero JS cost) ── */}
      <FloatingParticles />

      {/* ── Client Interactive Boundary (Passcode -> Pop-up -> Giftbox) ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
        <PasscodeFlow />
      </div>

      {/* ── Server-Rendered Static Footer ── */}
      <footer className="py-6 px-4 text-center relative z-10">
        <p className="text-xs text-purple-800/70 font-medium tracking-wide">
          Dibuat Oleh <span className="font-bold text-purple-900">Raditya Rai Zeeshan</span>
        </p>
      </footer>
    </div>
  );
}
