import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeftStartOnRectangleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const LOGOUT_PHASES = [
  {
    icon: ShieldCheckIcon,
    label: "Clearing session keys",
    description: "Removing local authentication tokens securely.",
  },
  {
    icon: ArrowLeftStartOnRectangleIcon,
    label: "Revoking active tokens",
    description: "Disconnecting secure portal authorizations.",
  },
  {
    icon: CheckCircleSolid,
    label: "Safe exit confirmed",
    description: "Redirecting you back to login portal safely.",
  },
];

function LogoutPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isAborted, setIsAborted] = useState(false);

  const firstName = user?.first_name || "there";

  useEffect(() => {
    if (isAborted) return;

    // Simulate clean sequential execution steps of a secure logout pipeline
    const timer1 = setTimeout(() => setCurrentPhase(1), 1000);
    const timer2 = setTimeout(() => setCurrentPhase(2), 2000);
    const timer3 = setTimeout(() => {
      logout();
      navigate("/login");
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [logout, navigate, isAborted]);

  const handleCancelLogout = () => {
    setIsAborted(true);
    navigate(-1); // Bounce user back to their previous active page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-primary-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Logo header */}
          <div className="px-8 pt-8 pb-0 flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="GreenPower Logo"
              className="w-14 aspect-square object-contain"
            />
          </div>

          <div className="px-8 pt-6 pb-2 text-center">
            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.45,
                delay: 0.15,
                type: "spring",
                stiffness: 200,
              }}
              className="flex justify-center mb-5"
            >
              <div className="relative">
                {/* Outer pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-primary-400 dark:bg-primary-500"
                />
                {/* Inner circle */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  className="relative w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/40 border-2 border-primary-300 dark:border-primary-700 flex items-center justify-center"
                >
                  <ArrowLeftStartOnRectangleIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 mb-4"
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400"
              />
              <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 tracking-wide uppercase">
                Signing Out
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.35 }}
              className="text-2xl font-bold text-secondary-900 dark:text-white mb-2"
            >
              See you soon, {firstName}!
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.35 }}
              className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed max-w-sm mx-auto mb-6"
            >
              We are securely packaging up your workspace data and closing your
              account session channels.
            </motion.p>
          </div>

          {/* Timeline steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="px-8 pb-6"
          >
            <div className="bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-4">
                Security Checklist Actions
              </p>
              <ol className="space-y-4">
                {LOGOUT_PHASES.map((phase, i) => {
                  const Icon = phase.icon;
                  const isDone = currentPhase > i;
                  const isActive = currentPhase === i;

                  return (
                    <motion.li
                      key={phase.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      {/* Icon column */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isDone
                              ? "bg-success-100 dark:bg-success-900/30 border-success-400 dark:border-success-600"
                              : isActive
                                ? "bg-primary-100 dark:bg-primary-900/30 border-primary-400 dark:border-primary-600"
                                : "bg-secondary-100 dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircleSolid className="w-4 h-4 text-success-500 dark:text-success-400" />
                          ) : isActive ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <ArrowPathIcon className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                            </motion.div>
                          ) : (
                            <Icon className="w-4 h-4 text-secondary-400 dark:text-secondary-500" />
                          )}
                        </div>
                        {i < LOGOUT_PHASES.length - 1 && (
                          <div
                            className={`w-0.5 h-5 mt-1 ${
                              isDone
                                ? "bg-success-300 dark:bg-success-700"
                                : "bg-secondary-200 dark:bg-secondary-700"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content column */}
                      <div className="flex-1 pt-0.5">
                        <p
                          className={`text-sm font-semibold transition-colors duration-200 ${
                            isDone
                              ? "text-secondary-400 dark:text-secondary-500 line-through decoration-secondary-300 dark:decoration-secondary-700"
                              : isActive
                                ? "text-primary-600 dark:text-primary-400"
                                : "text-secondary-700 dark:text-secondary-300"
                          }`}
                        >
                          {phase.label}
                        </p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                          {phase.description}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </motion.div>
          {/* ABORT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center pt-2"
            onClick={handleCancelLogout}
          >
            Oops, stay logged in
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
export default LogoutPage