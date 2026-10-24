import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { ParticipantLoginPage } from './pages/ParticipantLoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ParticipantDashboardPage } from './pages/participant/ParticipantDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { LoadingSpinner } from './components/ui/LoadingState';
import { Alert } from './components/ui/Alert';

type AppRoute = 'landing' | 'login-participant' | 'login-admin' | 'dashboard';

const MainApp: React.FC = () => {
  const { role, user, isLoading, signOut } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Sync route based on authentication state
  useEffect(() => {
    if (!isLoading) {
      if (user && role) {
        // Authenticated user always goes to their dedicated role dashboard
        setCurrentRoute('dashboard');
        setAccessDeniedMessage(null);
      } else if (currentRoute === 'dashboard') {
        // Unauthenticated user trying to access dashboard is redirected to landing
        setCurrentRoute('landing');
      }
    }
  }, [user, role, isLoading]);

  // Loading state when checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF7]">
        <div className="text-center space-y-3">
          <LoadingSpinner size="lg" label="Menyiapkan Al-Ikhlas Admission Portal..." />
          <p className="text-xs text-slate-400">Memeriksa sesi dan otorisasi pengguna</p>
        </div>
      </div>
    );
  }

  // 1. Authenticated Dashboard Route (Strict RBAC Guard)
  if (user && currentRoute === 'dashboard') {
    if (role === 'admin' || role === 'coordinator') {
      return <AdminDashboardPage />;
    }

    if (role === 'participant') {
      return <ParticipantDashboardPage />;
    }

    // Fallback if role is unrecognized or corrupt
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAF7]">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-red-200 shadow-sm space-y-4 text-center">
          <Alert variant="error" title="Akses Ditolak (Role Tidak Sah)">
            Akun Anda berhasil masuk namun belum memiliki role yang valid (bukan admin maupun calon peserta).
          </Alert>
          <button
            onClick={() => signOut()}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
          >
            Keluar dan Gunakan Akun Lain
          </button>
        </div>
      </div>
    );
  }

  // 2. Participant Login Route
  if (currentRoute === 'login-participant') {
    return (
      <ParticipantLoginPage
        onBack={() => setCurrentRoute('landing')}
        onSuccess={() => setCurrentRoute('dashboard')}
        onSwitchToAdmin={() => setCurrentRoute('login-admin')}
      />
    );
  }

  // 3. Admin Login Route
  if (currentRoute === 'login-admin') {
    return (
      <AdminLoginPage
        onBack={() => setCurrentRoute('landing')}
        onSuccess={() => setCurrentRoute('dashboard')}
        onSwitchToParticipant={() => setCurrentRoute('login-participant')}
      />
    );
  }

  // 4. Default: Public Landing Page
  return (
    <>
      {accessDeniedMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert
            variant="warning"
            title="Otorisasi Dibatasi"
            onDismiss={() => setAccessDeniedMessage(null)}
          >
            {accessDeniedMessage}
          </Alert>
        </div>
      )}
      <LandingPage
        onOpenParticipantLogin={() => setCurrentRoute('login-participant')}
        onOpenAdminLogin={() => setCurrentRoute('login-admin')}
      />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
