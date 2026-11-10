
import React, { lazy, Suspense } from 'react';
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TagProvider } from "./contexts/TagContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import Landing from "./pages/Landing";
import RouteLoading from "./components/RouteLoading";

import './styles/index.css';
import './styles/settings.css';
import './styles/loading.css';

import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorHandler from './components/GlobalErrorHandler';
import LoadingScreen from './components/LoadingScreen';
import { useLoading } from './contexts/LoadingContext';

// Keep the public homepage eager; internal screens and their dependencies load
// only when rendered. Guards stay outside the lazy components.
const Layout = lazy(() => import("./components/Layout"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProductivityDashboard = lazy(() => import("./pages/ProductivityDashboard"));
const TagsPage = lazy(() => import("./pages/TagsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const Introduction = lazy(() => import("./pages/Introduction"));

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
  const { pathname } = useLocation();

  return (
    <>
      {isLoading && pathname !== '/' && <LoadingScreen />}
      <AuthProvider>
        <TagProvider>
          <TooltipProvider>
            <Suspense fallback={<RouteLoading />}>
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
              <Route path="/admin" element={
                <PrivateRoute>
                  <Layout>
                    <AdminPage />
                  </Layout>
                </PrivateRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>

            <Toaster />
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
