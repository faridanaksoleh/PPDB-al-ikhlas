import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SCHOOL_CONFIG } from '../../config/school.config';
import { DataService } from '../../services/dataService';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingState';
import { Modal } from '../../components/ui/Modal';
import { formatDateTime, formatDate } from '../../lib/utils';
import type { Announcement } from '../../types/database';
import {
  LogOut,
  User,
  GraduationCap,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

export const ParticipantDashboardPage: React.FC = () => {
  const { user, profile, participant, signOut, refreshProfile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingAnnouncements(true);
      const data = await DataService.getAnnouncements('participant');
      if (isMounted) {
        setAnnouncements(data);
        setIsLoadingAnnouncements(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyNumber = () => {
    if (participant?.participant_number) {
      navigator.clipboard.writeText(participant.participant_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getGreeting = () => {
    return "Assalamu'alaikum Warahmatullahi Wabarakatuh";
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col">
      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src={SCHOOL_CONFIG.logoUrl}
                alt="Logo Al-Ikhlas"
                className="w-9 h-9 object-contain rounded-lg"
              />
              <div className="hidden sm:block">
                <span className="text-sm font-bold text-[#14532D] block leading-tight">
                  {SCHOOL_CONFIG.name}
                </span>
                <span className="text-[11px] font-semibold text-[#D4A853] uppercase tracking-wider">
                  Dashboard Calon Siswa
                </span>
              </div>
            </div>

            {/* User profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block">
                  {profile?.full_name || 'Calon Siswa'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {participant?.participant_number || 'Peserta PPDB'}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#14532D]/10 text-[#14532D] font-bold text-xs flex items-center justify-center">
                {profile?.full_name ? profile.full_name.charAt(0) : 'P'}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                className="border-slate-300"
              >
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#14532D] to-[#166534] text-white p-6 sm:p-8 shadow-sm relative overflow-hidden text-left">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-1/3 flex items-center justify-end pr-8">
            <Sparkles className="w-64 h-64 text-amber-300" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-2">
            <p className="text-xs sm:text-sm font-medium text-amber-300 tracking-wide">
              {getGreeting()},
            </p>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {profile?.full_name || 'Calon Peserta Didik'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed pt-1">
              Portal tes seleksi penerimaan peserta didik baru Sekolah Al-Ikhlas Tahun Ajaran {SCHOOL_CONFIG.academicYear}.
              Pantau kelengkapan berkas dan status verifikasi Anda di bawah ini.
            </p>
          </div>
        </div>

        {/* Verification Status Banner if revision required */}
        {participant?.verification_status === 'revision_required' && (
          <Alert variant="warning" title="Perhatian: Berkas Memerlukan Perbaikan">
            Panitia PPDB menemukan beberapa dokumen pendaftaran yang belum lengkap atau memerlukan perbaikan. Silakan hubungi layanan helpdesk PPDB Al-Ikhlas melalui WhatsApp untuk petunjuk revisi.
          </Alert>
        )}

        {/* Grid 2 Columns: Identity & Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Data Peserta */}
          <Card className="lg:col-span-2 text-left">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#166534]" />
                  Informasi Calon Peserta
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Data yang terdaftar pada sistem panitia PPDB
                </p>
              </div>
              <StatusBadge
                type="verification"
                status={participant?.verification_status || 'pending'}
              />
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nomor Peserta */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Nomor Peserta Ujian
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-mono font-extrabold text-slate-900">
                      {participant?.participant_number || '-'}
                    </span>
                    <button
                      onClick={handleCopyNumber}
                      title="Salin Nomor Peserta"
                      className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Jenjang yang Didaftarkan */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Jenjang Dituju
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#14532D]">
                      {participant?.applied_grade || '-'}
                    </span>
                    <span className="text-xs text-slate-500">
                      (PPDB {SCHOOL_CONFIG.academicYear})
                    </span>
                  </div>
                </div>

                {/* Status Pendaftaran Berkas */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Status Pendaftaran
                  </span>
                  <div>
                    <StatusBadge
                      type="registration"
                      status={participant?.registration_status || 'submitted'}
                    />
                  </div>
                </div>

                {/* Asal Sekolah */}
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Asal Sekolah
                  </span>
                  <span className="text-sm font-semibold text-slate-800 truncate block">
                    {participant?.origin_school || 'Belum diisi'}
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Status Verifikasi: </strong>
                  {participant?.verification_status === 'verified'
                    ? 'Berkas Anda telah lolos verifikasi panitia. Anda memenuhi syarat untuk mengikuti Computer Based Test.'
                    : participant?.verification_status === 'pending'
                    ? 'Dokumen Anda sedang dalam antrean verifikasi oleh tim administrasi PPDB.'
                    : 'Silakan hubungi panitia PPDB terkait status berkas Anda.'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Helpdesk PPDB */}
          <Card className="text-left">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4A853]" />
                Bantuan & Informasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-600">
              <p>
                Jika data pada profil tidak sesuai dengan berkas asli Anda, segera hubungi sekretariat PPDB Al-Ikhlas.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="font-semibold text-slate-800">Kontak Panitia:</div>
                <div className="font-mono text-slate-700">{SCHOOL_CONFIG.contact.whatsapp}</div>
                <div className="text-slate-500">{SCHOOL_CONFIG.contact.serviceHours}</div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                Simpan Nomor Peserta Anda dengan baik karena digunakan sebagai identitas ujian pada Modul 2.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION: UJIAN SAYA (PLACEHOLDER RESMI MODUL 1 -> MODUL 2) */}
        <Card className="text-left">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#14532D]" />
                <CardTitle>Ujian Saya (Computer Based Test)</CardTitle>
              </div>
              <p className="text-xs text-slate-500">
                Akses modul soal, simulasi, dan jadwal pengerjaan tes daring
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md border border-amber-300">
              Akan Aktif pada Modul 2
            </span>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Jadwal Ujian Masuk Gelombang 1
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ruang Computer Based Test (CBT), bank soal tes potensi akademik & kesiapan belajar, serta pewaktuan otomatis akan tersedia pada tahap pengembangan <strong>Modul 2</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Target Jenjang: <strong>{participant?.applied_grade || 'Semua'}</strong></span>
                  <span>·</span>
                  <span>Durasi Ujian: <strong>90 Menit</strong></span>
                  <span>·</span>
                  <span>Tipe: <strong>Pilihan Ganda & Observasi</strong></span>
                </div>
              </div>

              <Button
                variant="outline"
                size="md"
                disabled
                className="opacity-70 cursor-not-allowed shrink-0"
              >
                Mulai Ujian (Modul 2)
              </Button>
            </div>

            {/* Checklist Persiapan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700">Nomor Peserta Terdaftar</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-2 text-xs">
                {participant?.verification_status === 'verified' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className="text-slate-700">Verifikasi Berkas Calon Siswa</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Kartu Ujian Digital (Modul 2)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION: PENGUMUMAN RELEVAN */}
        <Card className="text-left">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#166534]" />
                <CardTitle>Pengumuman Resmi PPDB</CardTitle>
              </div>
              <p className="text-xs text-slate-500">
                Pemberitahuan terkini seputar alur dan seleksi Sekolah Al-Ikhlas
              </p>
            </div>
          </CardHeader>

          <CardContent>
            {isLoadingAnnouncements ? (
              <LoadingSpinner label="Memuat pengumuman..." />
            ) : announcements.length === 0 ? (
              <EmptyState
                title="Belum Ada Pengumuman"
                description="Pengumuman baru dari panitia PPDB akan muncul di sini."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAnnouncement(item)}
                    className="py-4 first:pt-0 last:pb-0 hover:bg-slate-50/70 p-3 rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateTime(item.published_at || item.created_at)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 hover:text-[#14532D] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAnnouncement(null)}
          title={selectedAnnouncement.title}
          description={`Dipublikasikan pada ${formatDateTime(
            selectedAnnouncement.published_at || selectedAnnouncement.created_at
          )}`}
          maxWidth="lg"
          footer={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAnnouncement(null)}
            >
              Tutup
            </Button>
          }
        >
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {selectedAnnouncement.content}
          </div>
        </Modal>
      )}
    </div>
  );
};
