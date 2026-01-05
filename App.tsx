
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { storageService } from './services/storageService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import StockMovement from './pages/StockMovement';
import Reports from './pages/Reports';
import KanbanBoard from './pages/KanbanBoard';
import CustomerList from './pages/CustomerList';
import Settings from './pages/Settings';
import CustomerContact from './pages/CustomerContact';
import { UserRole } from './types';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
    const { user } = useAuth();
    if (!user || user.role !== UserRole.ADMIN) return <Navigate to="/app/dashboard" replace />;
    return <>{children}</>;
  };

const AppHomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role === UserRole.CUSTOMER) {
    return <Navigate to="/app/contact" replace />;
  }
  return <Navigate to="/app/dashboard" replace />;
};

const App = () => {
  useEffect(() => {
    storageService.init();
  }, []);

  return (
    <HashRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <InventoryProvider>
              <Routes>
                {/* Public Route */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />

                {/* Protected App Routes */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="kanban" element={<KanbanBoard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="customers" element={<CustomerList />} />
                  <Route path="stock-movement" element={<StockMovement />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="contact" element={<CustomerContact />} />

                  {/* Admin Only Route */}
                  <Route path="settings" element={
                      <AdminRoute>
                          <Settings />
                      </AdminRoute>
                  } />
                  
                  {/* Default redirect dynamically based on role */}
                  <Route index element={<AppHomeRedirect />} />
                </Route>
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </InventoryProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
