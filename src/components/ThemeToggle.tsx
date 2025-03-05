
import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeToggle = ({ isDarkMode, toggleDarkMode }: ThemeToggleProps) => {
  return (
    <div
      className={`flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300
        ${isDarkMode 
          ? "bg-zinc-950 border border-zinc-800" 
          : "bg-white border border-zinc-200"}`}
      onClick={toggleDarkMode}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={`flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300
            ${isDarkMode 
              ? "transform translate-x-0 bg-zinc-800" 
              : "transform translate-x-8 bg-gray-200"}`}
        >
          {isDarkMode ? (
            <Moon 
              className="w-4 h-4 text-white" 
              size={16}
            />
          ) : (
            <Sun 
              className="w-4 h-4 text-gray-700" 
              size={16}
            />
          )}
        </div>
        <div
          className={`flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300
            ${isDarkMode 
              ? "bg-transparent" 
              : "transform -translate-x-8"}`}
        >
          {isDarkMode ? (
            <Sun 
              className="w-4 h-4 text-gray-500" 
              size={16}
            />
          ) : (
            <Moon 
              className="w-4 h-4 text-black" 
              size={16}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
