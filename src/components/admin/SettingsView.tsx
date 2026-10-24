import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';
import { SCHOOL_CONFIG } from '../../config/school.config';
import { useAuth } from '../../contexts/AuthContext';
import { FirebaseConfigModal } from '../common/FirebaseConfigModal';
import firebaseConfig from '../../../firebase-applet-config.json';
import {
  Database,
  ShieldCheck,
  Copy,
  Check,
  FileCode,
  Key,
  Server,
  Layers,
  Lock,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { isFirebaseConnected } = useAuth();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const firestoreRulesContent = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // 1. DEFAULT DENY
    match /{document=**} {
      allow read, write: if false;
    }

    // 2. HELPER FUNCTIONS
    function isSignedIn() {
      return request.auth != null;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\\\-]+$');
    }

    function incoming() {
      return request.resource.data;
    }

    function existing() {
      return resource.data;
    }

    function isAdmin() {
      return isSignedIn() && (
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) ||
        request.auth.token.email == 'itspuyd@gmail.com'
      );
    }

    function isCoordinator() {
      return isAdmin() || (
        isSignedIn() &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'coordinator'
      );
    }

    // 3. USERS / PROFILES
    match /users/{userId} {
      allow get: if isSignedIn() && (request.auth.uid == userId || isCoordinator());
      allow list: if isCoordinator();
      allow create: if isSignedIn() && isValidId(userId) && request.auth.uid == userId && (
        incoming().role == 'participant' || isAdmin()
      );
      allow update: if isSignedIn() && (
        isAdmin() || (
          request.auth.uid == userId &&
          incoming().diff(existing()).affectedKeys().hasOnly(['full_name', 'updatedAt'])
        )
      );
      allow delete: if isAdmin();
    }

    // 4. ADMINS
    match /admins/{adminId} {
      allow read, write: if isAdmin();
    }

    // 5. PARTICIPANTS
    match /participants/{participantId} {
      allow get, list: if isCoordinator() || (
        isSignedIn() && resource.data.userId == request.auth.uid
      );
      allow create, update: if isCoordinator();
      allow delete: if isAdmin();
    }

    // 6. ANNOUNCEMENTS
    match /announcements/{announcementId} {
      allow get, list: if isCoordinator() || (
        resource.data.status == 'published' && (
          resource.data.target_role == 'all' ||
          (isSignedIn() && resource.data.target_role == 'participant')
        )
      );
      allow create, update: if isCoordinator();
      allow delete: if isAdmin();
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesContent);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Pengaturan Sistem & Database Firebase
        </h2>
        <p className="text-xs text-slate-500">
          Konfigurasi portal PPDB Al-Ikhlas, Cloud Firestore Database, dan Firestore Security Rules
        </p>
      </div>

      {/* Firebase Status Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#166534]" />
              <h3 className="text-base font-bold text-slate-900">
                Infrastruktur Google Firebase & Cloud Firestore
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Project ID: <span className="font-mono font-semibold text-slate-700">{firebaseConfig.projectId}</span> · Database ID: <span className="font-mono text-emerald-800 font-semibold">{firebaseConfig.firestoreDatabaseId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded font-semibold ${
                isFirebaseConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isFirebaseConnected ? 'Firestore Terhubung' : 'Memeriksa Koneksi'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfigModalOpen(true)}
            >
              Lihat Detail Proyek
            </Button>
          </div>
        </div>
      </Card>

      {/* School Configuration View */}
      <Card>
        <CardHeader>
          <CardTitle>Identitas Sekolah & PPDB</CardTitle>
          <p className="text-xs text-slate-500">
            Dikelola terpusat melalui file konfigurasi <code>src/config/school.config.ts</code>
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-semibold">Nama Institusi</span>
              <span className="font-bold text-slate-800 text-sm">{SCHOOL_CONFIG.name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-semibold">Tahun Akademik</span>
              <span className="font-bold text-slate-800 text-sm">{SCHOOL_CONFIG.academicYear}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-semibold">Alamat Sekolah (Demo)</span>
              <span className="text-slate-700">{SCHOOL_CONFIG.contact.address}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block font-semibold">Kontak Helpdesk (Demo)</span>
              <span className="text-slate-700">{SCHOOL_CONFIG.contact.whatsapp}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Firestore Collections Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#14532D]" />
            Struktur Koleksi Cloud Firestore
          </CardTitle>
          <p className="text-xs text-slate-500">
            Koleksi data terstruktur berdasarkan <code>firebase-blueprint.json</code>
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#14532D]">/users/{'{userId}'}</span>
                <Badge variant="neutral">Profil & Role</Badge>
              </div>
              <p className="text-slate-600">Menyimpan data profil pengguna dan peran: admin, coordinator, participant.</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#14532D]">/participants/{'{participantId}'}</span>
                <Badge variant="info">Calon Siswa</Badge>
              </div>
              <p className="text-slate-600">Menyimpan nomor peserta, jenjang pilihan, status berkas, dan status verifikasi.</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#14532D]">/announcements/{'{announcementId}'}</span>
                <Badge variant="success">Pengumuman</Badge>
              </div>
              <p className="text-slate-600">Broadcast informasi resmi dengan target audiens: all, participant, coordinator, admin.</p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#14532D]">/admins/{'{adminId}'}</span>
                <Badge variant="gold">Otorisasi Terpercaya</Badge>
              </div>
              <p className="text-slate-600">Daftar pengguna dengan hak istimewa administrator untuk verifikasi aturan Firestore.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Firestore Security Rules Viewer */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#14532D]" />
              Firestore Security Rules (firestore.rules)
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Aturan keamanan aktif diterapkan di Firebase Cloud
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyRules}
            leftIcon={copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedRules ? 'Tersalin!' : 'Salin Rules'}
          </Button>
        </CardHeader>

        <CardContent>
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
            <pre>{firestoreRulesContent}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Security Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            Audit Keamanan & Kontrol Akses Firestore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1">✓ Isolasi Data Peserta</span>
              Peserta hanya dapat membaca data miliknya sendiri melalui aturan <code>resource.data.userId == request.auth.uid</code>.
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1">✓ Pencegahan Eskalasi Role</span>
              Pengguna dilarang mengubah kolom <code>role</code> pada dokumen profil mereka melalui aturan <code>affectedKeys().hasOnly()</code>.
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1">✓ Autentikasi Google Terpercaya</span>
              Admin & Koordinator dapat masuk menggunakan Google Sign-In dengan verifikasi ketat terhadap daftar panitia berwenang.
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1">✓ Zero Private Keys di Browser</span>
              Frontend hanya menggunakan kredensial publik Firebase; hak akses ditegakkan di level aturan Cloud Firestore.
            </div>
          </div>
        </CardContent>
      </Card>

      <FirebaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
};
