import React from 'react';
import { SCHOOL_CONFIG } from '../config/school.config';
import { PublicNavbar } from '../components/common/PublicNavbar';
import { PublicFooter } from '../components/common/PublicFooter';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  FileCheck2,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC<{
  onOpenParticipantLogin: () => void;
  onOpenAdminLogin: () => void;
}> = ({ onOpenParticipantLogin, onOpenAdminLogin }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7]">
      <PublicNavbar
        onOpenParticipantLogin={onOpenParticipantLogin}
        onOpenAdminLogin={onOpenAdminLogin}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
          {/* Subtle Islamic geometric background accent */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#14532D_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text Area */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Quiet Kicker */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#166534] tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#166534]" />
                  <span>PENERIMAAN PESERTA DIDIK BARU (PPDB) {SCHOOL_CONFIG.academicYear}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#1F2937] tracking-tight leading-[1.15] text-balance">
                  {SCHOOL_CONFIG.tagline}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  {SCHOOL_CONFIG.description}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onOpenParticipantLogin}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="shadow-md shadow-emerald-950/10 text-base"
                  >
                    Masuk sebagai Peserta
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onOpenAdminLogin}
                    leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
                    className="border-slate-300 text-slate-700 hover:text-slate-900 bg-white"
                  >
                    Login Administrator
                  </Button>
                </div>

                {/* Proof & Reliability Points */}
                <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-xs text-slate-500">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 block text-sm">Computer Based</span>
                    <span>Sistem CBT Teruji</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 block text-sm">Akun Terverifikasi</span>
                    <span>Akses Nomor Peserta</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 block text-sm">Transparan</span>
                    <span>Audit Nilai Objektif</span>
                  </div>
                </div>
              </div>

              {/* Marquee Image Carrier */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white group">
                  <img
                    src={SCHOOL_CONFIG.heroImageUrl}
                    alt="Kampus Sekolah Al-Ikhlas"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-left">
                    <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Lingkungan Belajar Islami & Modern</span>
                    </div>
                    <p className="text-sm font-semibold leading-snug">
                      Membina generasi berakhlak mulia, cerdas, dan mandiri berlandaskan Al-Qur'an dan Sunnah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JENJANG PENDIDIKAN SECTION */}
        <section id="jenjang" className="py-16 bg-white border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                Program Seleksi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Jenjang Pendidikan PPDB {SCHOOL_CONFIG.academicYear}
              </h2>
              <p className="text-sm text-slate-600">
                Pilih jenjang yang Anda daftarkan dan pastikan nomor peserta Anda aktif untuk mengikuti tahapan tes seleksi online.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCHOOL_CONFIG.grades.map((grade) => (
                <Card
                  key={grade.code}
                  className="hover:border-[#166534]/50 transition-all hover:shadow-md cursor-default text-left"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-[#14532D]/10 text-[#14532D] px-2.5 py-1 rounded">
                        {grade.code}
                      </span>
                      <span className="text-xs text-slate-500">{grade.age}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{grade.label}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tes penelusuran potensi, observasi kesiapan belajar, dan wawancara calon peserta didik secara terstruktur.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PETUNJUK PELAKSANAAN TES SECTION */}
        <section id="petunjuk" className="py-20 bg-[#F8FAF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4A853]">
                Alur & Prosedur
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Petunjuk Pelaksanaan Tes Masuk
              </h2>
              <p className="text-sm text-slate-600">
                Langkah-langkah yang harus dipersiapkan oleh orang tua dan calon peserta didik sebelum memasuki ruang ujian daring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SCHOOL_CONFIG.testGuidelines.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col space-y-3 text-left"
                >
                  <span className="text-3xl font-mono font-extrabold text-[#D4A853]">
                    {item.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Banner Reminder */}
            <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1 text-left">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#166534]" />
                  Sudah memiliki Nomor Peserta dan Kata Sandi?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Segera masuk ke dashboard peserta untuk memeriksa status verifikasi dan jadwal ujian Anda.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={onOpenParticipantLogin}
                className="shrink-0"
              >
                Masuk ke Dashboard Peserta
              </Button>
            </div>
          </div>
        </section>

        {/* KONTAK PPDB SECTION */}
        <section id="kontak" className="py-16 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <span>Informasi Helpdesk & Kontak</span>
                <span>(Demo)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pusat Bantuan PPDB Al-Ikhlas
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Hubungi panitia penerimaan siswa baru jika mengalami kendala dalam mengakses portal atau verifikasi berkas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col items-center text-center space-y-2">
                <Phone className="w-6 h-6 text-[#166534]" />
                <h4 className="text-sm font-bold text-slate-900">WhatsApp Panitia</h4>
                <p className="text-xs text-slate-600 font-mono">{SCHOOL_CONFIG.contact.whatsapp}</p>
                <span className="text-[11px] text-slate-400">Respon cepat saat jam kerja</span>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col items-center text-center space-y-2">
                <Mail className="w-6 h-6 text-[#166534]" />
                <h4 className="text-sm font-bold text-slate-900">Surel Resmi PPDB</h4>
                <p className="text-xs text-slate-600 font-mono">{SCHOOL_CONFIG.contact.email}</p>
                <span className="text-[11px] text-slate-400">Konfirmasi dokumen & berkas</span>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col items-center text-center space-y-2">
                <Clock className="w-6 h-6 text-[#166534]" />
                <h4 className="text-sm font-bold text-slate-900">Jam Operasional</h4>
                <p className="text-xs text-slate-600">{SCHOOL_CONFIG.contact.serviceHours}</p>
                <span className="text-[11px] text-slate-400">Waktu Indonesia Barat</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter
        onOpenAdminLogin={onOpenAdminLogin}
        onOpenParticipantLogin={onOpenParticipantLogin}
      />
    </div>
  );
};
