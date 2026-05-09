"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-[3.25rem] shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 w-[3.25rem] shrink-0 items-center rounded-full bg-neutral-200 p-0.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)] transition-colors dark:bg-neutral-900"
      aria-label={
        isDark ? "Passer en mode clair" : "Passer en mode sombre"
      }
      aria-pressed={isDark}
    >
      <Sun
        className={`pointer-events-none absolute left-1.5 z-0 h-4 w-4 transition-opacity ${
          isDark
            ? "text-neutral-500 opacity-35"
            : "text-neutral-900 opacity-100"
        }`}
        strokeWidth={2}
      />
      <Moon
        className={`pointer-events-none absolute right-1.5 z-0 h-4 w-4 transition-opacity ${
          isDark
            ? "text-neutral-100 opacity-100"
            : "text-neutral-400 opacity-35"
        }`}
        strokeWidth={2}
      />
      <span
        className={`pointer-events-none absolute top-0.5 z-10 h-7 w-7 rounded-full shadow-md transition-transform duration-200 ease-out ${
          isDark
            ? "left-0.5 translate-x-0 bg-white"
            : "left-0.5 translate-x-[1.15rem] bg-neutral-800"
        }`}
      />
    </button>
  );
}
