import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Check } from 'lucide-react';

// Interface para as propriedades do componente
interface VisualThemeSelectorProps {
  className?: string;
}

// Definição dos temas e suas cores principais
const themeColors = {
  // Temas padrão
  'nebula': { 
    primary: '#a47cff',
    secondary: '#ff6ecd',
    accent: '#29b7db',
    label: 'Nebula',
    category: 'Destaque'
  },
  'sunset': { 
    primary: '#e86c30',
    secondary: '#ea4c89',
    accent: '#f5b14c',
    label: 'Sunset',
    category: 'Destaque'
  },
  'dracula': { 
    primary: '#ff79c6',
    secondary: '#bd93f9',
    accent: '#50fa7b',
    label: 'Dracula',
    category: 'Escuro'
  },
  'dark': { 
    primary: '#60a5fa',
    secondary: '#f87171',
    accent: '#34d399',
    label: 'Dark',
    category: 'Escuro'
  },
  'night': { 
    primary: '#38bdf8',
    secondary: '#818cf8',
    accent: '#34d399',
    label: 'Night',
    category: 'Escuro'
  },
  'light': { 
    primary: '#3b82f6',
    secondary: '#ef4444',
    accent: '#10b981',
    label: 'Light',
    category: 'Claro'
  },
  'cupcake': { 
    primary: '#65c3c8',
    secondary: '#ef9fbc',
    accent: '#6bd6bd',
    label: 'Cupcake',
    category: 'Claro'
  },
  'emerald': { 
    primary: '#10b981',
    secondary: '#3b82f6',
    accent: '#ef4444',
    label: 'Emerald',
    category: 'Claro'
  },
};

// Agrupar temas por categoria
const themesByCategory = Object.entries(themeColors).reduce((acc, [themeName, theme]) => {
  const category = theme.category || 'Outros';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push({ name: themeName, ...theme });
  return acc;
}, {} as Record<string, Array<{ name: string, primary: string, secondary: string, accent: string, label: string, category: string }>>);

// Ordem de exibição das categorias
const categoryOrder = ['Destaque', 'Escuro', 'Claro', 'Outros'];

const VisualThemeSelector: React.FC<VisualThemeSelectorProps> = ({ className }) => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className={`${className || ''} py-4`}>
      <h2 className="text-xl font-bold mb-6 gradient-heading">Escolha um Tema</h2>
      
      <div className="space-y-6">
        {categoryOrder.map(category => {
          const themesInCategory = themesByCategory[category] || [];
          if (themesInCategory.length === 0) return null;
          
          return (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium opacity-70 mb-3">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {themesInCategory.map(theme => (
          <div
            key={theme.name}
            onClick={() => setTheme(theme.name as any)}
                    className={`
                      relative p-1 rounded-xl cursor-pointer transition-all duration-300
                      ${currentTheme === theme.name 
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105 animate-pulse-soft shadow-lg' 
                        : 'hover:scale-105 hover:shadow-md bg-base-200'}
                    `}
          >
            <div 
                      className="h-24 rounded-lg overflow-hidden w-full" 
              style={{ 
                        background: `linear-gradient(135deg, ${theme.primary}40, ${theme.secondary}30, ${theme.accent}20)`,
                      }}
                    >
                      <div className="flex items-center justify-center h-full p-3 gap-2">
                        <div className="h-10 w-10 rounded-full shadow-inner" style={{ backgroundColor: theme.primary }}></div>
                        <div className="h-10 w-10 rounded-full shadow-inner" style={{ backgroundColor: theme.secondary }}></div>
                        <div className="h-10 w-10 rounded-full shadow-inner" style={{ backgroundColor: theme.accent }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-2 px-2 pb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">{theme.label}</span>
                      {currentTheme === theme.name && (
                        <span className="bg-primary text-primary-content rounded-full p-1 shadow-md">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
            </div>
                </div>
              ))}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisualThemeSelector;
