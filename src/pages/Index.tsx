
import React from 'react';
import Matrix from '@/components/Matrix';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

const Index = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1A1F2C]' : 'bg-gradient-to-br from-gray-50 to-gray-100'} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-gradient' : 'text-gray-900'}`}>
              Eisenhower Task Manager
            </h1>
            <p className={`text-lg max-w-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Organize and prioritize your tasks efficiently using the Eisenhower Matrix method.
            </p>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        <Matrix />
      </div>
    </div>
  );
};

export default Index;
