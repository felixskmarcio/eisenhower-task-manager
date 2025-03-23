
import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductivityDashboard from "./pages/ProductivityDashboard";
import { TagProvider } from "./contexts/TagContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import TagsPage from "./pages/TagsPage";
import SettingsPage from "./pages/SettingsPage";
import './styles/index.css';
import './styles/settings.css';
import DebugTools from '@/components/DebugTools'
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorHandler from './components/GlobalErrorHandler';

const queryClient = new QueryClient();

const App = () => {
  const googleScriptLoaded = useRef(false);

  // Load Google API script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (googleScriptLoaded.current || document.getElementById('google-api-script')) {
        return;
      }
      
      console.log('Loading Google API script');
      const script = document.createElement("script");
      script.id = 'google-api-script';
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google API script loaded successfully');
        googleScriptLoaded.current = true;
      };
      
      script.onerror = (e) => {
        console.error('Error loading Google API script', e);
      };
      
      document.body.appendChild(script);
    };

    loadGoogleScript();
    
    // Clean up function
    return () => {
      // No cleanup needed for the script as it should persist
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TagProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<ProductivityDashboard />} />
                    <Route path="/tags" element={<TagsPage />} />
                    <Route path="/config" element={<SettingsPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
              {process.env.NODE_ENV === 'development' && <DebugTools />}
              <GlobalErrorHandler />
            </TooltipProvider>
          </TagProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
