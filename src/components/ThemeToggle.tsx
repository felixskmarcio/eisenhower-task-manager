
import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeToggle = ({ isDarkMode, toggleDarkMode }: ThemeToggleProps) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDarkMode 
          ? "bg-zinc-800 border border-zinc-700" 
          : "bg-blue-100 border border-blue-200"}`}
      role="button"
      aria-pressed={isDarkMode}
      aria-label="Toggle dark mode"
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`absolute left-1 flex h-7 w-7 transform items-center justify-center rounded-full transition-transform duration-300 ease-in-out
          ${isDarkMode 
            ? "translate-x-8 bg-zinc-950 text-blue-400" 
            : "translate-x-0 bg-white text-yellow-500 shadow-md"}`}
      >
        {isDarkMode ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </span>
      <span 
        className={`absolute right-2 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
      >
        <Sun className="h-4 w-4 text-zinc-400" />
      </span>
      <span 
        className={`absolute left-2 transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
      >
        <Moon className="h-4 w-4 text-zinc-400" />
      </span>
    </button>
  );
};

export default ThemeToggle;
