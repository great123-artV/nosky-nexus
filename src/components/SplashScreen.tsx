import { useEffect, useState } from "react";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2400);
    const t2 = setTimeout(() => onDone(), 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(ellipse at center, oklch(0.22 0.04 260) 0%, oklch(0.14 0.03 260) 70%, oklch(0.10 0.02 260) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(59,130,246,0.18) 0%, transparent 55%)",
        }}
      />

      {/* House icon */}
      <div className="relative">
        <div
          className="absolute inset-0 blur-2xl opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)",
          }}
        />
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          className="relative"
        >
          <defs>
            <linearGradient id="houseGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          {/* House outline */}
          <path
            d="M20 58 L60 22 L100 58 L100 98 L20 98 Z"
            stroke="url(#houseGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{
              strokeDasharray: 360,
              strokeDashoffset: 360,
              animation: "drawPath 1.6s ease-out forwards",
              filter: "drop-shadow(0 0 6px rgba(59,130,246,0.7))",
            }}
          />
          {/* Door */}
          <path
            d="M50 98 L50 74 L70 74 L70 98"
            stroke="url(#houseGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{
              strokeDasharray: 80,
              strokeDashoffset: 80,
              animation: "drawPath 0.8s ease-out 1.2s forwards",
              filter: "drop-shadow(0 0 4px rgba(59,130,246,0.6))",
            }}
          />
          {/* Signal dot */}
          <circle
            cx="60"
            cy="50"
            r="3"
            fill="#22C55E"
            style={{
              opacity: 0,
              animation: "pulseDot 1.5s ease-out 1.6s infinite",
              filter: "drop-shadow(0 0 6px rgba(34,197,94,0.9))",
            }}
          />
        </svg>
      </div>

      {/* Logo & text */}
      <div
        className="mt-8 text-center"
        style={{ animation: "fadeUp 0.8s ease-out 1.2s both" }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          Nosky <span className="text-primary">HomeOS</span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Smart Living. Seamlessly Connected.
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="mt-10 w-48 h-[2px] rounded-full overflow-hidden bg-white/5"
        style={{ animation: "fadeUp 0.6s ease-out 1.4s both" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #3B82F6, #60A5FA, transparent)",
            animation: "progress 1.4s ease-in-out 1.4s forwards",
            width: "0%",
          }}
        />
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-8 text-center"
        style={{ animation: "fadeUp 0.6s ease-out 1.8s both" }}
      >
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground/70">
          Powered by Nosky Tech
        </p>
      </div>

      <style>{`
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.3; transform: scale(0.9); transform-origin: 60px 50px; }
          50% { opacity: 1; transform: scale(1.2); transform-origin: 60px 50px; }
        }
      `}</style>
    </div>
  );
}
