import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { formatDateTime } from '../../lib/utils';
import type { Participant, Announcement } from '../../types/database';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
  Bell,
  Sparkles,
} from 'lucide-react';
import type { AdminTab } from './AdminSidebar';

interface OverviewViewProps {
  participants: Participant[];
  announcements: Announcement[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenNewAnnouncement: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  participants,
  announcements,
  onNavigateTab,
  onOpenNewAnnouncement,
}) => {
  const total = participants.length;
  const verified = participants.filter((p) => p.verification_status === 'verified').length;
  const pending = participants.filter((p) => p.verification_status === 'pending').length;
  const revision = participants.filter((p) => p.verification_status === 'revision_required').length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14532D] to-[#166534] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Dashboard Penerimaan Peserta Didik Baru
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Modul 1: Fondasi Proyek, Desain UI, Database PostgreSQL Supabase & Autentikasi RBAC.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="gold"
            size="sm"
            onClick={() => onNavigateTab('participants')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Kelola Peserta
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Pendaftar
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              {total}
            </span>
            <span className="text-xs text-slate-500">calon siswa</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Terverifikasi
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 tabular-nums">
              {verified}
            </span>
            <span className="text-xs text-slate-500">siap ujian CBT</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Menunggu Verifikasi
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 tabular-nums">
              {pending}
            </span>
            <span className="text-xs text-slate-500">dalam antrean</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
              Perlu Revisi
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-red-700 tabular-nums">
              {revision}
            </span>
            <span className="text-xs text-slate-500">butuh perbaikan</span>
          </div>
        </Card>
      </div>

      {/* Grid: Peserta Terbaru & Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Participants (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Data Pendaftar Terbaru</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Calon peserta didik yang baru mendaftar atau diperbarui
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('participants')}
            >
              Lihat Semua
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <Table className="border-0 rounded-none">
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Peserta</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Jenjang</TableHead>
                  <TableHead>Status Verifikasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.slice(0, 4).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-bold text-slate-900">
                      {p.participant_number}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {p.profile?.full_name || 'Peserta PPDB'}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-[#14532D] bg-[#14532D]/10 px-2 py-0.5 rounded">
                        {p.applied_grade}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge type="verification" status={p.verification_status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Announcements Preview (1 col) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pengumuman Aktif</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengumuman yang tampil pada portal
              </p>
            </div>
            <button
              onClick={onOpenNewAnnouncement}
              title="Buat Pengumuman"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </CardHeader>

          <CardContent className="space-y-3">
            {announcements.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">
                    {formatDateTime(a.published_at || a.created_at)}
                  </span>
                  <span className="uppercase font-semibold text-slate-500 text-[10px]">
                    {a.target_role}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{a.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{a.content}</p>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('announcements')}
              className="w-full justify-center text-xs"
            >
              Kelola Seluruh Pengumuman
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
