
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
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isDarkMode 
          ? "bg-gray-800 text-blue-400 hover:bg-gray-700" 
          : "bg-white text-yellow-500 hover:bg-gray-100 shadow-md"}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 transition-all duration-300 transform 
            ${isDarkMode 
              ? "opacity-0 rotate-90 scale-0" 
              : "opacity-100 rotate-0 scale-100"}`}
        />
        <Moon 
          className={`absolute inset-0 transition-all duration-300 transform 
            ${isDarkMode 
              ? "opacity-100 rotate-0 scale-100" 
              : "opacity-0 -rotate-90 scale-0"}`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
