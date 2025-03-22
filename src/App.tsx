import React, { lazy, Suspense } from 'react';
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

const queryClient = new QueryClient();

const App = () => (
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
        </TooltipProvider>
      </TagProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
