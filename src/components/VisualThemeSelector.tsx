import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Interface para as propriedades do componente
interface VisualThemeSelectorProps {
  className?: string;
}

// Definição dos temas e suas cores
const themes = [
  { name: 'light', colors: ['#3b82f6', '#ec4899', '#10b981', '#111827'], background: '#ffffff' },
  { name: 'dark', colors: ['#60a5fa', '#ec4899', '#34d399', '#f3f4f6'], background: '#1f2937' },
  { name: 'cupcake', colors: ['#65c3c8', '#ef9fbc', '#6bd6bd', '#291334'], background: '#faf7f5' },
  { name: 'bumblebee', colors: ['#e49b0f', '#ea580c', '#171717', '#f8fafc'], background: '#ffff00' },
  { name: 'emerald', colors: ['#10b981', '#3b82f6', '#ef4444', '#111827'], background: '#ecfdf5' },
  { name: 'corporate', colors: ['#0ea5e9', '#3b82f6', '#10b981', '#111827'], background: '#f8fafc' },
  { name: 'synthwave', colors: ['#e779c1', '#58a6ff', '#f97316', '#f3f4f6'], background: '#2d1b69' },
  { name: 'retro', colors: ['#ef9995', '#a4cbb4', '#f9cb80', '#1a103d'], background: '#e8d8b0' },
  { name: 'cyberpunk', colors: ['#ff7598', '#ffb86b', '#01c5a1', '#e8edec'], background: '#ffee00' },
  { name: 'valentine', colors: ['#e96d7b', '#a991f7', '#f2a1a1', '#632c3b'], background: '#ffe8e8' },
  { name: 'halloween', colors: ['#f87c37', '#7d4bde', '#6bb35c', '#f2f2f2'], background: '#100815' },
  { name: 'garden', colors: ['#5c7f67', '#c1cbb3', '#83a686', '#1a1d13'], background: '#e9e7e7' },
  { name: 'forest', colors: ['#16725c', '#2d9566', '#38bdf8', '#1a1d13'], background: '#1a392a' },
  { name: 'aqua', colors: ['#38bdf8', '#818cf8', '#34d399', '#f2f2f2'], background: '#003f5c' },
  { name: 'lofi', colors: ['#0d0d0d', '#1a1919', '#444444', '#ffffff'], background: '#ffffff' },
  { name: 'pastel', colors: ['#74c7ec', '#ea76cb', '#8bd5ca', '#131020'], background: '#fbeaeb' },
  { name: 'fantasy', colors: ['#6d8b74', '#9cb28b', '#d5d8b5', '#1a1d13'], background: '#f7f6f3' },
  { name: 'wireframe', colors: ['#b8b8b8', '#9e9e9e', '#c6c6c6', '#1a1a1a'], background: '#ffffff' },
  { name: 'black', colors: ['#373737', '#4d4d4d', '#6e6e6e', '#f3f3f3'], background: '#000000' },
  { name: 'luxury', colors: ['#dca54c', '#794614', '#272727', '#ffffff'], background: '#170d03' },
  { name: 'dracula', colors: ['#ff7ac6', '#9580ff', '#8aff80', '#f8f8f2'], background: '#282a36' },
  { name: 'cmyk', colors: ['#45AEEE', '#E93CAC', '#ECDB54', '#1a1d13'], background: '#ffffff' },
  { name: 'autumn', colors: ['#8C0327', '#D85251', '#F9C22B', '#F2F2F2'], background: '#D8C99B' },
  { name: 'business', colors: ['#1C4E80', '#0091D5', '#7DB9DE', '#F2F2F2'], background: '#ffffff' },
  { name: 'acid', colors: ['#FF00F4', '#00FFFF', '#ADFF00', '#F2F2F2'], background: '#11001C' },
  { name: 'lemonade', colors: ['#519903', '#a6bb09', '#fde047', '#1a1d13'], background: '#fff1c3' },
  { name: 'night', colors: ['#38bdf8', '#818cf8', '#34d399', '#e8f2ff'], background: '#0f1729' },
  { name: 'coffee', colors: ['#DB924B', '#A16941', '#4E3620', '#F2F2F2'], background: '#20141E' },
  { name: 'winter', colors: ['#38bdf8', '#818cf8', '#34d399', '#f2f2f2'], background: '#e3e7e8' },
  { name: 'dim', colors: ['#66ccff', '#a29bfe', '#00cec9', '#fbfbfb'], background: '#1c1c1f' },
  { name: 'nord', colors: ['#81a1c1', '#b48ead', '#a3be8c', '#eceff4'], background: '#2e3440' },
  { name: 'sunset', colors: ['#FF865B', '#FD2E2E', '#06B6D4', '#F2F2F2'], background: '#1e293b' },
  { name: 'caramellatte', colors: ['#c4936b', '#8a5a83', '#e6bea9', '#f2f2f2'], background: '#271b1b' },
  { name: 'abyss', colors: ['#0369a1', '#4338ca', '#1e40af', '#f2f2f2'], background: '#050A30' },
  { name: 'silk', colors: ['#f472b6', '#38bdf8', '#4ade80', '#f2f2f2'], background: '#242933' },
];

const VisualThemeSelector: React.FC<VisualThemeSelectorProps> = ({ className }) => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className={`${className || ''} p-4`}>
      <h1 className="text-2xl font-bold mb-4">Lista de temas</h1>
      <p className="mb-6">Experimente-os:</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {themes.map((theme) => (
          <div
            key={theme.name}
            className={`rounded-lg overflow-hidden shadow-md transition-transform duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
              currentTheme === theme.name ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            style={{ background: theme.background }}
            onClick={() => setTheme(theme.name as any)}
          >
            <div 
              className="p-2 text-center font-medium"
              style={{ 
                color: theme.name === 'light' || theme.name === 'wireframe' || theme.name === 'cupcake' || 
                       theme.name === 'emerald' || theme.name === 'fantasy' || theme.name === 'pastel' || 
                       theme.name === 'lofi' || theme.name === 'business' || theme.name === 'bumblebee' || 
                       theme.name === 'lemonade' || theme.name === 'winter' || theme.name === 'corporate' ? '#333' : '#fff' 
              }}
            >
              {theme.name}
            </div>
            <div className="flex justify-around p-2">
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                  style={{ 
                    backgroundColor: color,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    color: ['#ffff00', '#f8fafc', '#ffffff', '#f3f4f6', '#f2f2f2', '#fbfbfb', '#eceff4', '#e8edec'].includes(color) ? '#333' : '#fff'
                  }}
                >
                  A
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualThemeSelector;
