import React from 'react';
import ThemeSelector from './ThemeSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="fixed top-4 right-4 z-50">
        <ThemeSelector />
      </div>
      {children}
    </div>
  );
};

export default Layout;