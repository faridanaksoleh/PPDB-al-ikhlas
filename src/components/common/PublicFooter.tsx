import React from 'react';
import { SCHOOL_CONFIG } from '../../config/school.config';
import { ShieldCheck, Phone, Mail, Clock, MapPin } from 'lucide-react';

export const PublicFooter: React.FC<{
  onOpenAdminLogin: () => void;
  onOpenParticipantLogin: () => void;
}> = ({ onOpenAdminLogin, onOpenParticipantLogin }) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={SCHOOL_CONFIG.logoUrl}
                alt="Logo Al-Ikhlas"
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div>
                <span className="text-lg font-bold text-[#14532D] block leading-tight">
                  {SCHOOL_CONFIG.name}
                </span>
                <span className="text-xs font-semibold text-[#D4A853] uppercase tracking-wider">
                  {SCHOOL_CONFIG.portalName}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              {SCHOOL_CONFIG.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#166534]" />
              <span>Sistem Ujian Terotentikasi Firebase & Cloud Firestore Security Rules</span>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Akses Portal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenParticipantLogin}
                  className="hover:text-[#14532D] transition-colors text-left"
                >
                  Masuk sebagai Peserta
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdminLogin}
                  className="hover:text-[#14532D] transition-colors text-left"
                >
                  Portal Administrator PPDB
                </button>
              </li>
              <li>
                <a href="#petunjuk" className="hover:text-[#14532D] transition-colors">
                  Petunjuk Pelaksanaan Tes
                </a>
              </li>
              <li>
                <a href="#jenjang" className="hover:text-[#14532D] transition-colors">
                  Daftar Jenjang PPDB
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan PPDB Demo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Helpdesk PPDB
              </h4>
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                Contoh Demo
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{SCHOOL_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{SCHOOL_CONFIG.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{SCHOOL_CONFIG.contact.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{SCHOOL_CONFIG.contact.serviceHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {SCHOOL_CONFIG.name}. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <span>Tahun Ajaran {SCHOOL_CONFIG.academicYear}</span>
            <span>·</span>
            <span>Modul 1: UI, Database & Autentikasi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
