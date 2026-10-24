import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { FirebaseConfigModal } from '../common/FirebaseConfigModal';
import { Menu, LogOut, Database, Shield, ChevronRight } from 'lucide-react';

export const AdminTopbar: React.FC<{
  onOpenMobileSidebar: () => void;
  tabTitle: string;
}> = ({ onOpenMobileSidebar, tabTitle }) => {
  const { profile, role, signOut, isFirebaseConnected } = useAuth();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
            <span className="text-slate-400 font-normal hidden sm:inline">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <span className="text-[#14532D] font-bold">{tabTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Database indicator */}
          <button
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Klik untuk membuka status database Cloud Firestore"
          >
            <Database className="w-3.5 h-3.5 text-[#166534]" />
            <span className="hidden md:inline">
              {isFirebaseConnected ? 'Firestore Terhubung' : 'Memeriksa DB'}
            </span>
          </button>

          {/* Admin user info */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-800">
              {profile?.full_name || 'Administrator PPDB'}
            </span>
            <span className="text-[10px] text-amber-700 font-medium">
              {role === 'coordinator' ? 'Koordinator PPDB' : 'Panitia Penerimaan'}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs">
            {profile?.full_name ? profile.full_name.charAt(0) : 'A'}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            className="border-slate-300"
          >
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      <FirebaseConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </>
  );
};
