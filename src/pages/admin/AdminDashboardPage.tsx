import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DataService } from '../../services/dataService';
import { AdminSidebar, AdminTab } from '../../components/admin/AdminSidebar';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { OverviewView } from '../../components/admin/OverviewView';
import { ParticipantsView } from '../../components/admin/ParticipantsView';
import { AnnouncementsView } from '../../components/admin/AnnouncementsView';
import { ModuleRoadmapView } from '../../components/admin/ModuleRoadmapView';
import { SettingsView } from '../../components/admin/SettingsView';
import { LoadingSpinner } from '../../components/ui/LoadingState';
import type { Participant, Announcement, RegistrationStatus, VerificationStatus } from '../../types/database';

export const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data states
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const [pts, anns] = await Promise.all([
      DataService.getParticipants(),
      DataService.getAnnouncements('admin'),
    ]);
    setParticipants(pts);
    setAnnouncements(anns);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update participant status
  const handleUpdateParticipantStatus = async (
    id: string,
    regStatus: RegistrationStatus,
    verifStatus: VerificationStatus
  ): Promise<boolean> => {
    const success = await DataService.updateParticipantStatus(id, regStatus, verifStatus);
    if (success) {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, registration_status: regStatus, verification_status: verifStatus }
            : p
        )
      );
    }
    return success;
  };

  // Announcement Handlers
  const handleCreateAnnouncement = async (
    data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>
  ): Promise<boolean> => {
    const created = await DataService.createAnnouncement(data);
    if (created) {
      setAnnouncements((prev) => [created, ...prev]);
      return true;
    }
    return false;
  };

  const handleUpdateAnnouncement = async (
    id: string,
    updates: Partial<Announcement>
  ): Promise<boolean> => {
    const success = await DataService.updateAnnouncement(id, updates);
    if (success) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a))
      );
      return true;
    }
    return false;
  };

  const handleDeleteAnnouncement = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteAnnouncement(id);
    if (success) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      return true;
    }
    return false;
  };

  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'overview':
        return 'Ringkasan Portal';
      case 'participants':
        return 'Data Calon Peserta Didik';
      case 'question_bank':
        return 'Bank Soal (Modul 2)';
      case 'exam_management':
        return 'Manajemen Ujian CBT (Modul 3)';
      case 'results':
        return 'Hasil & Penilaian (Modul 4)';
      case 'announcements':
        return 'Manajemen Pengumuman';
      case 'settings':
        return 'Pengaturan & Skema Database';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          tabTitle={getTabTitle(currentTab)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <LoadingSpinner label="Memuat data administrator..." />
          ) : (
            <>
              {currentTab === 'overview' && (
                <OverviewView
                  participants={participants}
                  announcements={announcements}
                  onNavigateTab={setCurrentTab}
                  onOpenNewAnnouncement={() => {
                    setCurrentTab('announcements');
                    setIsNewAnnouncementOpen(true);
                  }}
                />
              )}

              {currentTab === 'participants' && (
                <ParticipantsView
                  participants={participants}
                  onUpdateStatus={handleUpdateParticipantStatus}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'question_bank' && (
                <ModuleRoadmapView tab="question_bank" />
              )}

              {currentTab === 'exam_management' && (
                <ModuleRoadmapView tab="exam_management" />
              )}

              {currentTab === 'results' && (
                <ModuleRoadmapView tab="results" />
              )}

              {currentTab === 'announcements' && (
                <AnnouncementsView
                  announcements={announcements}
                  onCreate={handleCreateAnnouncement}
                  onUpdate={handleUpdateAnnouncement}
                  onDelete={handleDeleteAnnouncement}
                  isModalOpenExternal={isNewAnnouncementOpen}
                  onCloseExternalModal={() => setIsNewAnnouncementOpen(false)}
                />
              )}

              {currentTab === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
