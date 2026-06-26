
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2800);
    const t2 = setTimeout(() => onDone(), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "oklch(0.10 0.02 260)", // Deepest black-blue
          }}
        >
          {/* Dynamic Ambient Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0.4, scale: 1 }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.66 0.18 255 / 0.08) 0%, transparent 70%)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.4)_100%)]" />
          </div>

          {/* Main Logo Container */}
          <div className="relative flex flex-col items-center">
            {/* Animated Logo Image */}
            <div className="relative w-40 h-40 mb-8">
              {/* Back Glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                animate={{ opacity: 0.4, scale: 1.5, filter: "blur(40px)" }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle, oklch(0.66 0.18 255) 0%, transparent 70%)",
                }}
              />

              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: "brightness(0) saturate(100%) invert(100%)" }}
                animate={{ scale: 1, opacity: 1, filter: "brightness(1) saturate(100%) invert(0%)" }}
                transition={{
                  duration: 1.5,
                  ease: [0.16, 1, 0.3, 1], // Custom elegant ease
                }}
                className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src="/logo-raw.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />

                {/* Shimmer Effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </motion.div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-3 px-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="text-lg md:text-xl text-white/50 font-light tracking-wide"
              >
                Smart Living. Seamlessly Connected.
              </motion.p>
            </div>

            {/* Progress Bar Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 w-64 h-[1.5px] bg-white/5 rounded-full overflow-hidden relative"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, delay: 0.5, ease: [0.1, 0, 0.2, 1] }}
                className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_oklch(0.66_0.18_255)]"
              />
            </motion.div>
          </div>

          {/* Premium Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="absolute bottom-12"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-medium">
              Powered by Nosky Tech
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
