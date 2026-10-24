import React, { useState } from 'react';
import { Database, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { SCHOOL_CONFIG } from '../../config/school.config';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { FirebaseConfigModal } from './FirebaseConfigModal';

export const PublicNavbar: React.FC<{
  onOpenParticipantLogin: () => void;
  onOpenAdminLogin: () => void;
  onNavigateSection?: (sectionId: string) => void;
}> = ({ onOpenParticipantLogin, onOpenAdminLogin, onNavigateSection }) => {
  const { isFirebaseConnected } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-18">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <img
                src={SCHOOL_CONFIG.logoUrl}
                alt="Logo Al-Ikhlas"
                className="w-10 h-10 object-contain rounded-lg shadow-xs"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-[#14532D] tracking-tight leading-none whitespace-nowrap">
                  Al-Ikhlas
                </span>
                <span className="text-[11px] font-semibold text-[#D4A853] uppercase tracking-wider mt-0.5 whitespace-nowrap">
                  Admission Test
                </span>
              </div>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <button
                onClick={() => handleScroll('hero')}
                className="hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Beranda
              </button>
              <button
                onClick={() => handleScroll('jenjang')}
                className="hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Jenjang Pendidikan
              </button>
              <button
                onClick={() => handleScroll('petunjuk')}
                className="hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Petunjuk Tes
              </button>
              <button
                onClick={() => handleScroll('kontak')}
                className="hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Kontak PPDB
              </button>
            </nav>

            {/* Zone 3: Actions */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <button
                onClick={() => setConfigModalOpen(true)}
                title="Status Infrastruktur Firebase & Firestore"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              >
                <Database className="w-4 h-4 text-[#166534]" />
                <span className="hidden lg:inline text-xs">
                  {isFirebaseConnected ? 'Firebase Aktif' : 'Memeriksa DB'}
                </span>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAdminLogin}
                className="border-slate-300 text-slate-700 hover:text-slate-900"
              >
                Login Admin
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={onOpenParticipantLogin}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Masuk Peserta
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setConfigModalOpen(true)}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Konfigurasi Database"
              >
                <Database className="w-5 h-5 text-[#166534]" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
              <button
                onClick={() => handleScroll('hero')}
                className="text-left py-2 hover:text-[#14532D]"
              >
                Beranda
              </button>
              <button
                onClick={() => handleScroll('jenjang')}
                className="text-left py-2 hover:text-[#14532D]"
              >
                Jenjang Pendidikan
              </button>
              <button
                onClick={() => handleScroll('petunjuk')}
                className="text-left py-2 hover:text-[#14532D]"
              >
                Petunjuk Tes
              </button>
              <button
                onClick={() => handleScroll('kontak')}
                className="text-left py-2 hover:text-[#14532D]"
              >
                Kontak PPDB
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenParticipantLogin();
                }}
                className="w-full justify-center"
              >
                Masuk sebagai Peserta
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full justify-center"
              >
                Login Admin PPDB
              </Button>
            </div>
          </div>
        )}
      </header>

      <FirebaseConfigModal isOpen={configModalOpen} onClose={() => setConfigModalOpen(false)} />
    </>
  );
};
