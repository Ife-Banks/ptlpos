"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative rounded-lg flex items-center justify-center transition-all duration-200",
        "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
        sizeClasses[size],
        className
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun className={cn(iconSizes[size], "absolute transition-all duration-300", theme === "light" ? "opacity-100" : "opacity-0 rotate-90 scale-0")} />
      <Moon className={cn(iconSizes[size], "absolute transition-all duration-300", theme === "dark" ? "opacity-100" : "opacity-0 -rotate-90 scale-0")} />
    </button>
  );
}