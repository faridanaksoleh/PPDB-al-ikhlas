import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { BookOpen, CalendarCheck, Award, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { AdminTab } from './AdminSidebar';

interface ModuleRoadmapViewProps {
  tab: 'question_bank' | 'exam_management' | 'results';
}

export const ModuleRoadmapView: React.FC<ModuleRoadmapViewProps> = ({ tab }) => {
  const configs = {
    question_bank: {
      moduleName: 'Modul 2',
      title: 'Bank Soal & Manajemen Paket Tes',
      icon: <BookOpen className="w-8 h-8 text-[#14532D]" />,
      statusText: 'Akan tersedia pada Modul 2',
      description:
        'Sistem perancangan dan manajemen bank soal interaktif dengan berbagai kategori: Tes Potensi Akademik (TPA), Kesiapan Belajar, dan Pemahaman Keislaman.',
      features: [
        'Editor Soal Interaktif (Pilihan Ganda, Benar/Salah, Isian Singkat, & Observasi Guru)',
        'Kategorisasi Soal Berdasarkan Jenjang (KB, TK, SD, SMP, SMA)',
        'Paket Soal & Pengacakan Butir / Opsi Jawaban (Anti-Kebocoran)',
        'Konfigurasi Kunci Jawaban & Bobot Penilaian per Butir Soal',
        'Impor / Ekspor Butir Soal Format CSV & Template Excel',
      ],
    },
    exam_management: {
      moduleName: 'Modul 3',
      title: 'Manajemen Jadwal & Pelaksanaan Ujian (CBT Runtime)',
      icon: <CalendarCheck className="w-8 h-8 text-[#14532D]" />,
      statusText: 'Akan tersedia pada Modul 3',
      description:
        'Kontrol jadwal sesi tes online, alokasi ruang ujian, pewaktuan otomatis (timer), autosave jawaban realtime, dan monitoring proktor.',
      features: [
        'Pengaturan Sesi Gelombang Ujian dengan Jam Mulai & Jam Selesai Terkunci',
        'Pewaktu Ujian Mandiri & Auto-Submit saat Batas Waktu Habis',
        'Penyimpanan Jawaban Otomatis (Realtime Autosave State)',
        'Dashboard Monitoring Proktor / Pengawas Ujian secara Langsung',
        'Deteksi Keamanan Dasar (Full-screen & Tab Switching Prevention)',
      ],
    },
    results: {
      moduleName: 'Modul 4',
      title: 'Hasil Penilaian & Rekapitulasi Kelulusan',
      icon: <Award className="w-8 h-8 text-[#14532D]" />,
      statusText: 'Akan tersedia pada Modul 4',
      description:
        'Kalkulasi nilai otomatis, penetapan passing grade per jenjang, perangkingan nilai calon siswa, serta pencetakan Berita Acara Kelulusan.',
      features: [
        'Perhitungan Skor Otomatis Berdasarkan Bobot Kunci Jawaban',
        'Penetapan Passing Grade & Kuota Daya Tampung per Jenjang',
        'Perangkingan Nilai Calon Siswa & Rekomendasi Hasil Seleksi',
        'Penerbitan Surat Keputusan (SK) Kelulusan & Kartu Hasil Seleksi Digital',
        'Ekspor Laporan Rekapitulasi ke PDF dan Spreadsheet',
      ],
    },
  };

  const current = configs[tab];

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {current.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fitur dalam roadmap pengembangan PPDB Al-Ikhlas
          </p>
        </div>
        <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
          {current.statusText}
        </span>
      </div>

      {/* Main Roadmap Card */}
      <Card className="p-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
            {current.icon}
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="gold">{current.moduleName}</Badge>
              <Badge variant="neutral">Status: Tahap Berikutnya</Badge>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{current.title}</h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {current.description}
            </p>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Ruang Lingkup Fitur yang Akan Diimplementasikan:
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {current.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
