import React from 'react';
import { cn } from '../../lib/utils';
import type { RegistrationStatus, VerificationStatus, AnnouncementStatus, UserRole } from '../../types/database';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
    gold: 'bg-amber-100/70 text-amber-900 border-amber-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border tracking-wide select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{
  type: 'registration' | 'verification' | 'announcement' | 'role';
  status: RegistrationStatus | VerificationStatus | AnnouncementStatus | UserRole | string;
}> = ({ type, status }) => {
  switch (type) {
    case 'verification':
      if (status === 'verified') {
        return <Badge variant="success">Terverifikasi</Badge>;
      }
      if (status === 'pending') {
        return <Badge variant="warning">Menunggu Verifikasi</Badge>;
      }
      if (status === 'revision_required') {
        return <Badge variant="error">Perlu Revisi Berkas</Badge>;
      }
      if (status === 'rejected') {
        return <Badge variant="error">Ditolak</Badge>;
      }
      break;

    case 'registration':
      if (status === 'verified') {
        return <Badge variant="success">Berkas Lengkap</Badge>;
      }
      if (status === 'submitted') {
        return <Badge variant="info">Berkas Terkirim</Badge>;
      }
      if (status === 'draft') {
        return <Badge variant="neutral">Draft Pendaftaran</Badge>;
      }
      if (status === 'rejected') {
        return <Badge variant="error">Dibatalkan</Badge>;
      }
      break;

    case 'announcement':
      if (status === 'published') {
        return <Badge variant="success">Dipublikasikan</Badge>;
      }
      if (status === 'draft') {
        return <Badge variant="neutral">Draft</Badge>;
      }
      if (status === 'archived') {
        return <Badge variant="default">Diarsipkan</Badge>;
      }
      break;

    case 'role':
      if (status === 'admin') {
        return <Badge variant="gold">Administrator PPDB</Badge>;
      }
      if (status === 'coordinator') {
        return <Badge variant="warning">Koordinator PPDB</Badge>;
      }
      if (status === 'participant') {
        return <Badge variant="info">Calon Siswa</Badge>;
      }
      break;
  }

  return <Badge variant="neutral">{status}</Badge>;
};
