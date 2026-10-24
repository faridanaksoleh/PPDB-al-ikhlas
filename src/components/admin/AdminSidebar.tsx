import React from 'react';
import { SCHOOL_CONFIG } from '../../config/school.config';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  Award,
  Bell,
  Settings,
  X,
  Database,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'participants'
  | 'question_bank'
  | 'exam_management'
  | 'results'
  | 'announcements'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Ringkasan',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'participants' as AdminTab,
      label: 'Data Peserta',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'question_bank' as AdminTab,
      label: 'Bank Soal',
      icon: <BookOpen className="w-4 h-4" />,
      badge: 'Modul 2',
    },
    {
      id: 'exam_management' as AdminTab,
      label: 'Manajemen Ujian',
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: 'Modul 3',
    },
    {
      id: 'results' as AdminTab,
      label: 'Hasil Penilaian',
      icon: <Award className="w-4 h-4" />,
      badge: 'Modul 4',
    },
    {
      id: 'announcements' as AdminTab,
      label: 'Pengumuman',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Pengaturan & DB',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleSelect = (tab: AdminTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-0',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <img
              src={SCHOOL_CONFIG.logoUrl}
              alt="Logo Al-Ikhlas"
              className="w-8 h-8 object-contain rounded-md"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-[#14532D] leading-tight">
                Al-Ikhlas PPDB
              </span>
              <span className="text-[10px] font-semibold text-[#D4A853] uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 text-left">
            Menu Utama
          </div>

          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer',
                  isActive
                    ? 'bg-[#14532D] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-mono',
                      isActive
                        ? 'bg-emerald-900/60 text-emerald-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-left">
          <div className="font-semibold text-slate-700">Tahun Ajaran {SCHOOL_CONFIG.academicYear}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Modul 1: UI, Database & Auth</div>
        </div>
      </aside>
    </>
  );
};
