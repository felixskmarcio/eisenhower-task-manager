
import React, { lazy, Suspense } from 'react';
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
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import TagsPage from "./pages/TagsPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import './styles/index.css';
import './styles/settings.css';
import DebugTools from '@/components/DebugTools'
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorHandler from './components/GlobalErrorHandler';

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <TagProvider>
              <TooltipProvider>
                <Sonner />
                <Routes>
                  <Route path="/login" element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  } />
                  <Route path="/" element={
                    <PrivateRoute>
                      <Layout>
                        <Index />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Layout>
                        <ProductivityDashboard />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/tags" element={
                    <PrivateRoute>
                      <Layout>
                        <TagsPage />
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/config" element={
                    <PrivateRoute>
                      <Layout>
                        <SettingsPage />
                      </Layout>
                    </PrivateRoute>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {process.env.NODE_ENV === 'development' && <DebugTools />}
                <GlobalErrorHandler />
              </TooltipProvider>
            </TagProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
