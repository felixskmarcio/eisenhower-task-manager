
import React, { lazy, Suspense } from 'react';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "@/pages/Index";
import NotFound from "./pages/NotFound";
import ProductivityDashboard from "./pages/ProductivityDashboard";
import { TagProvider } from "./contexts/TagContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import TagsPage from "./pages/TagsPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import Introduction from "./pages/Introduction";
import Demo from "./pages/Demo";
import Landing from "./pages/Landing";
import './styles/index.css';
import './styles/settings.css';
import './styles/loading.css';

import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorHandler from './components/GlobalErrorHandler';
import LoadingScreen from './components/LoadingScreen';
import { useLoading } from './contexts/LoadingContext';

// Importante: criar o queryClient fora do componente para evitar problemas de renderização
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

// Componente para renderizar a tela de carregamento com o conteúdo da aplicação
const AppContent = () => {
  const { isLoading } = useLoading();
  
  return (
    <>
      {isLoading && <LoadingScreen />}
      <AuthProvider>
        <TagProvider>
          <TooltipProvider>
            <Sonner />
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              } />
              <Route path="/introduction" element={
                <PublicRoute allowAuthenticated={true}>
                  <Layout>
                    <Introduction />
                  </Layout>
                </PublicRoute>
              } />
              <Route path="/demo" element={
                <PublicRoute allowAuthenticated={true}>
                  <Layout>
                    <Demo />
                  </Layout>
                </PublicRoute>
              } />
              {/* Nova Landing Page como rota raiz pública */}
              <Route path="/" element={
                <PublicRoute allowAuthenticated={false}>
                  <Landing />
                </PublicRoute>
              } />

              {/* Rotas privadas - requerem autenticação */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/matrix" element={
                <PrivateRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/productivity" element={
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
    
            <GlobalErrorHandler />
          </TooltipProvider>
        </TagProvider>
      </AuthProvider>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <AppContent />
          </LoadingProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
