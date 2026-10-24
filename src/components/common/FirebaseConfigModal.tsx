import React, { useState } from 'react';
import { Database, ShieldCheck, CheckCircle2, Server, Key, RefreshCw } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { useAuth } from '../../contexts/AuthContext';
import firebaseConfig from '../../../firebase-applet-config.json';

export const FirebaseConfigModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { isFirebaseConnected } = useAuth();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Status Infrastruktur Backend (Firebase & Firestore)"
      description="Layanan autentikasi dan database Cloud Firestore terkelola untuk Al-Ikhlas Admission Test."
      maxWidth="lg"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <div className="space-y-4 text-left">
        {isFirebaseConnected ? (
          <Alert variant="success" title="Status: Terhubung Aktif ke Firebase Cloud">
            Aplikasi terhubung langsung ke project Google Cloud/Firebase resmi dengan Firebase Authentication dan database Cloud Firestore aktif.
          </Alert>
        ) : (
          <Alert variant="warning" title="Status: Memeriksa Koneksi">
            Sedang memverifikasi status koneksi ke endpoint Firestore database.
          </Alert>
        )}

        {/* Configuration Details */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-700">Project ID Firebase</span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {firebaseConfig.projectId}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-700">Firestore Database ID</span>
            <span className="font-mono text-[11px] text-[#14532D] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate max-w-xs">
              {firebaseConfig.firestoreDatabaseId}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-700">Auth Domain</span>
            <span className="font-mono text-slate-800">{firebaseConfig.authDomain}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Metode Autentikasi Aktif</span>
            <span className="text-slate-800 font-medium">
              Google Sign-In & Email/Password (Peserta)
            </span>
          </div>
        </div>

        {/* Security Rules Audit */}
        <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Keamanan Aturan Firestore (firestore.rules):
          </div>
          <p>
            1. <strong>Prinsip Default-Deny</strong>: Semua akses baca dan tulis ditutup kecuali secara eksplisit diizinkan.
          </p>
          <p>
            2. <strong>Isolasi Data Peserta</strong>: Peserta hanya dapat membaca data miliknya sendiri (<code>resource.data.userId == request.auth.uid</code>).
          </p>
          <p>
            3. <strong>Pencegahan Eskalasi Role</strong>: Hak admin diverifikasi di sisi server melalui koleksi <code>/admins</code> dan dokumen profil pengguna.
          </p>
        </div>
      </div>
    </Modal>
  );
};
