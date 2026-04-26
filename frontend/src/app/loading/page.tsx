"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useNavigationFlow } from "@/state/navigation-context";

const loadingMessages = [
  "Sizin için en yakın rotayı çıkarıyoruz..",
  "Katlar arası geçişler hesaplanıyor..",
  "Asansör ve merdiven alternatifleri değerlendiriliyor..",
  "Son hamle yapılıyor..",
];

export default function LoadingScreen() {
  const router = useRouter();
  const { requestRoute, route } = useNavigationFlow();
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function computeRoute() {
      try {
        const result = await requestRoute();
        if (!mounted) return;
        router.replace(result.instructions.length === 0 ? "/arrival" : "/navigation");
      } catch (routeError) {
        if (!mounted) return;
        setError(
          routeError instanceof Error
            ? routeError.message
            : "Rota hesaplanırken beklenmeyen bir hata oluştu.",
        );
      }
    }

    computeRoute();

    return () => {
      mounted = false;
    };
  }, [requestRoute, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Animated route icon */}
        <div className="relative">
          <motion.div
            className="flex size-20 items-center justify-center rounded-full bg-primary/10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="size-14 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Loading text */}
        <div className="h-20">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[17px] font-medium leading-6 text-error"
              >
                {error}
              </motion.p>
            ) : (
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-[17px] font-medium leading-6 text-ink"
              >
                {loadingMessages[messageIndex]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        {!error && (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="size-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}

        {/* Retry button on error */}
        {error && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.back()}
            className="mt-4 rounded-full bg-primary px-6 py-3 text-[15px] font-semibold text-surface shadow-md transition-opacity hover:opacity-85 active:scale-[0.98]"
          >
            Tekrar dene
          </motion.button>
        )}
      </div>
    </div>
  );
}