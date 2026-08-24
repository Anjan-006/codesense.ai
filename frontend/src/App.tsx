import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AppLayout from '@/components/layout/AppLayout';

// Route Guards
import ProtectedRoute from '@/routes/ProtectedRoute';

// Public Pages
import LandingPage from '@/pages/public/LandingPage';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// App Pages
import DashboardPage from '@/pages/app/DashboardPage';
import ProjectsPage from '@/pages/app/ProjectsPage';
import ChatPage from '@/pages/app/ChatPage';
import SearchPage from '@/pages/app/SearchPage';
import SettingsPage from '@/pages/app/SettingsPage';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ═══ Public Routes ═══ */}
          <Route element={<PublicLayout />}>
            <Route path="/"         element={<LandingPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/features" element={<LandingPage />} />
            <Route path="/pricing"  element={<LandingPage />} />
            <Route path="/about"    element={<LandingPage />} />
            <Route path="/contact"  element={<LandingPage />} />
          </Route>

          {/* ═══ Protected Routes ═══ */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard"    element={<DashboardPage />} />
              <Route path="/projects"     element={<ProjectsPage />} />
              <Route path="/chat"         element={<ChatPage />} />
              <Route path="/search"       element={<SearchPage />} />
              <Route path="/documentation" element={<SearchPage />} />
              <Route path="/settings"     element={<SettingsPage />} />
              <Route path="/admin"        element={<DashboardPage />} />
            </Route>
          </Route>

          {/* ═══ Catch-all ═══ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--green-200)',
            borderRadius: '1rem',
            fontSize: '14px',
            boxShadow: '-6px -6px 14px var(--shadow-light), 6px 6px 14px var(--shadow-dark)',
          },
          success: { iconTheme: { primary: 'var(--green-500)', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}
