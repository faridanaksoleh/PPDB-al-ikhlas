import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StatusBadge } from '../ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { Alert } from '../ui/Alert';
import { formatDate, formatDateTime } from '../../lib/utils';
import { SCHOOL_CONFIG } from '../../config/school.config';
import type { Participant, AppliedGrade, VerificationStatus, RegistrationStatus } from '../../types/database';
import {
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Phone,
  School,
  Calendar,
  Check,
} from 'lucide-react';

interface ParticipantsViewProps {
  participants: Participant[];
  onUpdateStatus: (id: string, reg: RegistrationStatus, verif: VerificationStatus) => Promise<boolean>;
  onRefresh: () => void;
}

export const ParticipantsView: React.FC<ParticipantsViewProps> = ({
  participants,
  onUpdateStatus,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Detail Modal State
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [editVerifStatus, setEditVerifStatus] = useState<VerificationStatus>('pending');
  const [editRegStatus, setEditRegStatus] = useState<RegistrationStatus>('submitted');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const filtered = participants.filter((p) => {
    const matchSearch =
      p.participant_number.toLowerCase().includes(search.toLowerCase()) ||
      (p.profile?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.origin_school || '').toLowerCase().includes(search.toLowerCase());

    const matchGrade = selectedGrade === 'all' || p.applied_grade === selectedGrade;
    const matchStatus = selectedStatus === 'all' || p.verification_status === selectedStatus;

    return matchSearch && matchGrade && matchStatus;
  });

  const handleOpenDetail = (p: Participant) => {
    setSelectedParticipant(p);
    setEditVerifStatus(p.verification_status);
    setEditRegStatus(p.registration_status);
    setUpdateSuccess(false);
  };

  const handleSaveStatus = async () => {
    if (!selectedParticipant) return;
    setIsUpdating(true);
    const success = await onUpdateStatus(selectedParticipant.id, editRegStatus, editVerifStatus);
    setIsUpdating(false);
    if (success) {
      setUpdateSuccess(true);
      setTimeout(() => {
        setSelectedParticipant(null);
      }, 1200);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Data Calon Peserta Didik Baru
          </h2>
          <p className="text-xs text-slate-500">
            Daftar pendaftar PPDB Sekolah Al-Ikhlas, verifikasi berkas, dan hak akses ujian CBT
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Muat Ulang
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Cari nomor peserta, nama, atau asal sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <div className="space-y-1">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534]"
            >
              <option value="all">Semua Jenjang Pendidikan</option>
              {SCHOOL_CONFIG.grades.map((g) => (
                <option key={g.code} value={g.code}>
                  {g.code} - {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534]"
            >
              <option value="all">Semua Status Verifikasi</option>
              <option value="verified">Terverifikasi (Lolos)</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="revision_required">Perlu Revisi Berkas</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="Tidak Ada Peserta yang Sesuai"
            description="Coba ubah kata kunci pencarian atau bersihkan filter jenjang dan status."
            actionLabel="Reset Filter"
            onAction={() => {
              setSearch('');
              setSelectedGrade('all');
              setSelectedStatus('all');
            }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Peserta</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Jenjang</TableHead>
                <TableHead>Asal Sekolah</TableHead>
                <TableHead>Status Berkas</TableHead>
                <TableHead>Verifikasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-bold text-slate-900">
                    {p.participant_number}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {p.profile?.full_name || 'Peserta PPDB'}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-[#14532D] bg-[#14532D]/10 px-2 py-0.5 rounded">
                      {p.applied_grade}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 max-w-[150px] truncate">
                    {p.origin_school || '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge type="registration" status={p.registration_status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge type="verification" status={p.verification_status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(p)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Detail & Verifikasi
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Detail & Verification Modal */}
      {selectedParticipant && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedParticipant(null)}
          title={`Verifikasi Calon Siswa: ${selectedParticipant.profile?.full_name}`}
          description={`Nomor Peserta: ${selectedParticipant.participant_number}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              {updateSuccess ? (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Status berhasil diperbarui!
                </span>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedParticipant(null)}
                >
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveStatus}
                  isLoading={isUpdating}
                >
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            {/* Applicant Summary */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Jenjang Pilihan</span>
                <span className="text-sm font-bold text-[#14532D]">
                  {selectedParticipant.applied_grade}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Asal Sekolah</span>
                <span className="text-sm font-semibold text-slate-800">
                  {selectedParticipant.origin_school || 'Belum diisi'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Telepon Orang Tua</span>
                <span className="text-sm font-mono text-slate-700">
                  {selectedParticipant.parent_phone || '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Waktu Pendaftaran</span>
                <span className="text-xs text-slate-600">
                  {formatDateTime(selectedParticipant.created_at)}
                </span>
              </div>
            </div>

            {/* Status Editing */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pembaruan Status Verifikasi Panitia
              </h4>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Status Verifikasi Berkas
                </label>
                <select
                  value={editVerifStatus}
                  onChange={(e) => setEditVerifStatus(e.target.value as VerificationStatus)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                >
                  <option value="verified">Terverifikasi (Lolos seleksi berkas & berhak CBT)</option>
                  <option value="pending">Menunggu Verifikasi (Dalam antrean review)</option>
                  <option value="revision_required">Perlu Revisi (Dokumen tidak lengkap/kurang jelas)</option>
                  <option value="rejected">Ditolak (Tidak memenuhi kualifikasi usia/persyaratan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Status Kelengkapan Dokumen
                </label>
                <select
                  value={editRegStatus}
                  onChange={(e) => setEditRegStatus(e.target.value as RegistrationStatus)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                >
                  <option value="submitted">Terkirim (Dokumen awal sudah diupload)</option>
                  <option value="verified">Lengkap (Seluruh berkas fisik & digital valid)</option>
                  <option value="rejected">Dibatalkan</option>
                </select>
              </div>
            </div>

            <Alert variant="info" title="Hak Akses Ujian CBT">
              Hanya peserta dengan status <strong>Terverifikasi</strong> yang dapat memulai pengerjaan tes daring ketika Modul 2 dibuka.
            </Alert>
          </div>
        </Modal>
      )}
    </div>
  );
};
