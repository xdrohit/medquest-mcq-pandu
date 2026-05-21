"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting until mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border transition-colors duration-300
                 bg-white border-slate-200 hover:bg-slate-50 text-slate-700
                 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-300"
      aria-label="Toggle Theme"
    >
      <div className="relative w-4 h-4 overflow-hidden">
        <div 
          className="absolute inset-0 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: `translateY(${isDark ? '-100%' : '0'})` }}
        >
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <Sun className="w-full h-full text-amber-500" />
          </div>
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <Moon className="w-full h-full text-primary-400" />
          </div>
        </div>
      </div>
      
      {/* Glow effect in dark mode */}
      {isDark && (
        <div className="absolute inset-0 rounded-xl bg-primary-500/20 blur-sm -z-10" />
      )}
    </motion.button>
  );
}
