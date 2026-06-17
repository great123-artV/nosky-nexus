import { useEffect, useState } from "react";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Total duration ~3.2s for a premium, lingering feel
    // Starts fading out at 2.5s, finishes at 3.2s
    const t1 = setTimeout(() => setExiting(true), 2500);
    const t2 = setTimeout(() => onDone(), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "oklch(0.10 0.02 260)", // Deepest black-blue
      }}
    >
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.66 0.18 255 / 0.08) 0%, transparent 70%)",
            animation: "pulseGlow 4s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Main Logo Container */}
      <div className="relative flex flex-col items-center">
        {/* Animated House Logo */}
        <div className="relative w-32 h-32 mb-8">
          {/* Back Glow */}
          <div
            className="absolute inset-0 blur-3xl opacity-40 scale-150"
            style={{
              background: "radial-gradient(circle, oklch(0.66 0.18 255) 0%, transparent 70%)",
              animation: "fadeBlur 2s ease-out forwards",
            }}
          />

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.75 0.12 255)" />
                <stop offset="100%" stopColor="oklch(0.55 0.20 255)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Architectural House Outline */}
            <path
              d="M50 15 L85 40 V85 H15 V40 L50 15Z"
              stroke="url(#logoGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="draw-path"
              style={{
                strokeDasharray: 300,
                strokeDashoffset: 300,
                filter: "url(#glow)",
              }}
            />

            {/* Smart Core / Connectivity Node */}
            <circle
              cx="50"
              cy="55"
              r="4"
              fill="url(#logoGrad)"
              className="fade-in-node"
              style={{ opacity: 0 }}
            />

            {/* Connectivity Rays */}
            <g className="fade-in-rays" style={{ opacity: 0 }}>
              <path
                d="M50 35 V45"
                stroke="url(#logoGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M35 55 H42"
                stroke="url(#logoGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M58 55 H65"
                stroke="url(#logoGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M50 65 V75"
                stroke="url(#logoGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3 px-6">
          <div className="overflow-hidden">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white animate-reveal-up">
              Nosky <span className="text-primary">HomeOS</span>
            </h1>
          </div>
          <p
            className="text-lg md:text-xl text-white/50 font-light tracking-wide animate-fade-in"
            style={{ animationDelay: "1.2s", animationFillMode: "both" }}
          >
            Smart Living. Seamlessly Connected.
          </p>
        </div>

        {/* Progress Bar Container */}
        <div
          className="mt-12 w-64 h-[1.5px] bg-white/5 rounded-full overflow-hidden relative animate-fade-in"
          style={{ animationDelay: "0.8s", animationFillMode: "both" }}
        >
          <div
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_oklch(0.66_0.18_255)] animate-progress"
            style={{ width: "0%" }}
          />
        </div>
      </div>

      {/* Premium Footer */}
      <div
        className="absolute bottom-12 animate-fade-in"
        style={{ animationDelay: "1.6s", animationFillMode: "both" }}
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-medium">
          Powered by Nosky Tech
        </p>
      </div>

      <style>{`
        .draw-path {
          animation: drawPath 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .fade-in-node {
          animation: fadeIn 0.8s ease-out 1.2s forwards;
        }

        .fade-in-rays {
          animation: fadeIn 1s ease-out 1.4s forwards;
        }

        .animate-reveal-up {
          animation: revealUp 1s cubic-bezier(0.2, 1, 0.3, 1) 0.8s both;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-progress {
          animation: progress 2.2s cubic-bezier(0.1, 0, 0.2, 1) 0.5s forwards;
        }

        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes revealUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes progress {
          0% { width: 0%; opacity: 0.5; }
          10% { width: 10%; opacity: 1; }
          100% { width: 100%; opacity: 1; }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes fadeBlur {
          from { opacity: 0; transform: scale(1); }
          to { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
