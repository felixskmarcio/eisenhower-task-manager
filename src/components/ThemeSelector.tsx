import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeSelectorProps {
  className?: string;
}

// Definição dos temas e suas cores com a paleta completa
const themeColors = {
  // Temas padrão
  'light': { 
    bg: '#ffffff', 
    colors: ['#3b82f6', '#ef4444', '#10b981', '#6b7280'],
    category: 'Padrão'
  },
  'dark': { 
    bg: '#1f2937', 
    colors: ['#60a5fa', '#f87171', '#34d399', '#f3f4f6'],
    category: 'Padrão'
  },
  
  // Temas personalizados
  'dracula': { 
    bg: '#282a36', 
    colors: ['#ff79c6', '#bd93f9', '#50fa7b', '#f8f8f2'],
    category: 'Personalizado' 
  },
  'nebula': {
    bg: '#1a0f30',
    colors: ['#a47cff', '#ff6ecd', '#29b7db', '#f8f8f2'],
    category: 'Personalizado'
  },
  'sunset': {
    bg: '#faf5e9',
    colors: ['#e86c30', '#ea4c89', '#f5b14c', '#333333'],
    category: 'Personalizado'
  },
  'synthwave': { 
    bg: '#2d1b69', 
    colors: ['#e779c1', '#58a6ff', '#f97316', '#f3f4f6'],
    category: 'Personalizado'
  },
  'cyberpunk': { 
    bg: '#000000', 
    colors: ['#00f6ff', '#ff00f2', '#ffee00', '#e8edec'],
    category: 'Personalizado'
  },
  'nord': { 
    bg: '#2e3440', 
    colors: ['#81a1c1', '#b48ead', '#a3be8c', '#eceff4'],
    category: 'Personalizado'
  },
  
  // Temas coloridos
  'cupcake': { 
    bg: '#faf7f5', 
    colors: ['#65c3c8', '#ef9fbc', '#6bd6bd', '#291334'],
    category: 'Colorido'
  },
  'bumblebee': { 
    bg: '#ffff00', 
    colors: ['#e49b0f', '#ea580c', '#171717', '#f8fafc'],
    category: 'Colorido'
  },
  'emerald': { 
    bg: '#ecfdf5', 
    colors: ['#10b981', '#3b82f6', '#ef4444', '#111827'],
    category: 'Colorido'
  },
  'corporate': { 
    bg: '#f8fafc', 
    colors: ['#0ea5e9', '#3b82f6', '#10b981', '#111827'],
    category: 'Colorido'
  },
  'valentine': { 
    bg: '#ffe8e8', 
    colors: ['#e96d7b', '#a991f7', '#f2a1a1', '#632c3b'],
    category: 'Colorido'
  },
  
  // Temas escuros
  'night': { 
    bg: '#0f1729', 
    colors: ['#38bdf8', '#818cf8', '#34d399', '#e8f2ff'],
    category: 'Escuro'
  },
  'coffee': { 
    bg: '#20141E', 
    colors: ['#DB924B', '#A16941', '#4E3620', '#F2F2F2'],
    category: 'Escuro'
  },
  'forest': { 
    bg: '#1a392a', 
    colors: ['#16725c', '#2d9566', '#38bdf8', '#f2f2f2'],
    category: 'Escuro'
  },
  'aqua': { 
    bg: '#003f5c', 
    colors: ['#38bdf8', '#818cf8', '#34d399', '#f2f2f2'],
    category: 'Escuro'
  },
  'dim': { 
    bg: '#1c1c1f', 
    colors: ['#66ccff', '#a29bfe', '#00cec9', '#fbfbfb'],
    category: 'Escuro'
  },
};

// Lista de temas claros para usar texto escuro
const lightThemes = ['light', 'cupcake', 'emerald', 'bumblebee', 'corporate', 'valentine', 'sunset'];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { currentTheme, setTheme } = useTheme();

  // Agrupar temas por categoria
  const themesByCategory = Object.entries(themeColors).reduce((acc, [themeName, theme]) => {
    const category = theme.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ name: themeName, ...theme });
    return acc;
  }, {} as Record<string, Array<{ name: string, bg: string, colors: string[], category: string }>>) ;

  // Ordem de exibição das categorias
  const categoryOrder = ['Padrão', 'Personalizado', 'Colorido', 'Escuro', 'Outros'];
  
  return (
    <div className={`${className || ''}`}>
      {/* Theme Dropdown Menu */}
      <div className="dropdown dropdown-end">
        <div 
          tabIndex={0} 
          role="button" 
          className="btn btn-sm md:btn-md m-1 flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <span>Tema</span>
          <div className="flex space-x-1 ml-2">
            {themeColors[currentTheme]?.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-base-content border-opacity-20 animate-pulse-soft"
                style={{ backgroundColor: color, animationDelay: `${index * 0.2}s` }}
              />
            ))}
          </div>
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60 ml-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048">
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>
        <ul 
          tabIndex={0} 
          className="dropdown-content bg-base-200 rounded-box z-10 w-64 p-3 shadow-xl max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          {categoryOrder.map(category => {
            const themesInCategory = themesByCategory[category] || [];
            if (themesInCategory.length === 0) return null;
            
            return (
              <li key={category} className="mb-3">
                <h3 className="font-medium text-sm opacity-70 mb-1 px-2">{category}</h3>
                <ul className="space-y-1">
                  {themesInCategory.map(theme => (
                    <li key={theme.name}>
                      <button
                        className={`w-full flex items-center px-3 py-2 rounded-md transition-all duration-300 hover:bg-base-300 ${
                          currentTheme === theme.name ? 'bg-primary bg-opacity-10 border-l-4 border-primary' : ''
                        }`}
                        onClick={() => setTheme(theme.name as any)}
                        >
                        <div className="flex-1 text-left capitalize">
                          {theme.name}
                        </div>
                        <div className="flex space-x-1">
                          {theme.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-base-content border-opacity-10 transition-transform hover:scale-110"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ThemeSelector;
