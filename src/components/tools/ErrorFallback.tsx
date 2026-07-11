import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const floatingOrbs = [
  {
    size: 320,
    x: "-10%",
    y: "-15%",
    delay: 0,
    duration: 8,
    color: "rgba(52,189,187,0.12)",
  },
  {
    size: 200,
    x: "75%",
    y: "60%",
    delay: 1.5,
    duration: 10,
    color: "rgba(116,202,209,0.10)",
  },
  {
    size: 140,
    x: "85%",
    y: "-10%",
    delay: 3,
    duration: 7,
    color: "rgba(193,235,235,0.15)",
  },
  {
    size: 100,
    x: "20%",
    y: "80%",
    delay: 0.8,
    duration: 9,
    color: "rgba(52,189,187,0.08)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  let navigate: ReturnType<typeof useNavigate> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch {
    navigate = null;
  }

  const goHome = () => {
    if (navigate) navigate("/");
    else window.location.href = "/";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary-50 dark:bg-secondary-950 px-4">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#34bdbb 1px, transparent 1px), linear-gradient(to right, #34bdbb 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0, 18, 0],
            x: [0, 10, -8, 5, 0],
            scale: [1, 1.04, 0.97, 1.02, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            left: orb.x,
            top: orb.y,
            background: orb.color,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Main card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-white dark:bg-secondary-900 rounded-3xl shadow-2xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
          {/* Top accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ transformOrigin: "left" }}
            className="h-1 w-full bg-gradient-to-r from-primary-500 via-primary-300 to-primary-100"
          />

          <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center gap-6">
            {/* Animated icon cluster */}
            <motion.div
              variants={itemVariants}
              className="relative flex items-center justify-center"
            >
              {/* Outer pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-28 h-28 rounded-full bg-primary-500/10 dark:bg-primary-500/20"
              />
              {/* Middle ring */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                className="absolute w-20 h-20 rounded-full bg-primary-500/15 dark:bg-primary-500/25"
              />
              {/* Icon container */}
              <motion.div
                animate={{ rotate: [0, -3, 3, -2, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30"
              >
                {/* Warning / broken circuit SVG */}
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                >
                  <path
                    d="M16 6L28 26H4L16 6Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="rgba(255,255,255,0.15)"
                  />
                  <motion.path
                    d="M16 13V18"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <circle cx="16" cy="22" r="1.25" fill="white" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white tracking-tight">
                Something went wrong
              </h1>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm leading-relaxed max-w-sm">
                An unexpected error occurred. Our team has been notified and is
                working to resolve it.
              </p>
            </motion.div>

            {/* Error detail pill */}
            {error?.message && (
              <motion.div
                variants={itemVariants}
                className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-700 rounded-xl"
              >
                <div className="flex items-start gap-2.5 text-left">
                  <span className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-secondary-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </span>
                  <p className="text-xs font-mono text-secondary-500 dark:text-secondary-400 break-all leading-relaxed">
                    {error.message}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Divider with status dots */}
            <motion.div
              variants={itemVariants}
              className="w-full flex items-center gap-3"
            >
              <div className="flex-1 h-px bg-secondary-200 dark:bg-secondary-700" />
              <div className="flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay,
                    }}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === 0
                        ? "bg-primary-500"
                        : i === 1
                          ? "bg-primary-400"
                          : "bg-primary-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex-1 h-px bg-secondary-200 dark:bg-secondary-700" />
            </motion.div>

            {/* Action buttons */}
            <motion.div
              variants={itemVariants}
              className="w-full grid grid-cols-2 gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={goHome}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 text-sm font-medium hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go Home
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-white text-sm font-medium shadow-md shadow-primary-500/25 hover:from-primary-600 hover:to-primary-500 transition-all"
              >
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.4 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </motion.svg>
                Try Again
              </motion.button>
            </motion.div>

            {/* Footer note */}
            <motion.p
              variants={itemVariants}
              className="text-xs text-secondary-400 dark:text-secondary-600"
            >
              CampusPal Admin · Error reference logged automatically
            </motion.p>
          </div>
        </div>

        {/* Subtle bottom glow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary-500/20 blur-2xl rounded-full pointer-events-none" />
      </motion.div>
    </div>
  );
}
