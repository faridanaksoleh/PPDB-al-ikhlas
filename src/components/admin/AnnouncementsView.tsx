import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StatusBadge, Badge } from '../ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/Table';
import { Modal, ConfirmDialog } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime } from '../../lib/utils';
import type { Announcement, AnnouncementStatus, AnnouncementTarget } from '../../types/database';
import { Plus, Edit2, Trash2, Bell, Check, Calendar } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  onCreate: (data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<Announcement>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  isModalOpenExternal?: boolean;
  onCloseExternalModal?: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  onCreate,
  onUpdate,
  onDelete,
  isModalOpenExternal = false,
  onCloseExternalModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenExternal);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<AnnouncementStatus>('published');
  const [targetRole, setTargetRole] = useState<AnnouncementTarget>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState<Announcement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync external open state
  React.useEffect(() => {
    if (isModalOpenExternal) {
      handleOpenCreate();
    }
  }, [isModalOpenExternal]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setStatus('published');
    setTargetRole('all');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setStatus(item.status);
    setTargetRole(item.target_role);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Judul pengumuman wajib diisi.');
      return;
    }
    if (!content.trim()) {
      setFormError('Isi pengumuman wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    let success = false;

    if (editingItem) {
      success = await onUpdate(editingItem.id, {
        title: title.trim(),
        content: content.trim(),
        status,
        target_role: targetRole,
      });
    } else {
      success = await onCreate({
        title: title.trim(),
        content: content.trim(),
        status,
        target_role: targetRole,
        published_at: status === 'published' ? new Date().toISOString() : null,
        expires_at: null,
      });
    }

    setIsSubmitting(false);
    if (success) {
      handleCloseModal();
    } else {
      setFormError('Gagal menyimpan pengumuman ke database.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    await onDelete(deleteCandidate.id);
    setIsDeleting(false);
    setDeleteCandidate(null);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Pengumuman PPDB
          </h2>
          <p className="text-xs text-slate-500">
            Publikasikan informasi jadwal, verifikasi, atau panduan teknis kepada peserta dan publik
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Buat Pengumuman Baru
        </Button>
      </div>

      <Card>
        {announcements.length === 0 ? (
          <EmptyState
            title="Belum Ada Pengumuman"
            description="Mulai publikasikan pengumuman pertama Anda untuk calon peserta didik baru."
            actionLabel="Buat Pengumuman"
            onAction={handleOpenCreate}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Pengumuman</TableHead>
                <TableHead>Target Audiens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-md">
                    <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                    <span className="text-xs text-slate-500 line-clamp-1">{item.content}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.target_role === 'all' ? 'default' : item.target_role === 'participant' ? 'info' : 'gold'}>
                      {item.target_role === 'all' ? 'Semua (Publik)' : item.target_role === 'participant' ? 'Hanya Peserta' : 'Hanya Admin'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge type="announcement" status={item.status} />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">
                    {formatDateTime(item.published_at || item.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Pengumuman"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteCandidate(item)}
                        title="Hapus Pengumuman"
                        className="hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          title={editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
          description="Pengumuman akan langsung ditampilkan pada dashboard peserta sesuai target audiens."
          maxWidth="lg"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={handleCloseModal} disabled={isSubmitting}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
                {editingItem ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                {formError}
              </p>
            )}

            <Input
              label="Judul Pengumuman"
              placeholder="Contoh: Jadwal Tes Online Gelombang 1 Dibuka"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700">
                Isi Pengumuman
              </label>
              <textarea
                rows={5}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                placeholder="Tuliskan isi pengumuman secara jelas dan terperinci..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Target Audiens</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as AnnouncementTarget)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                >
                  <option value="all">Semua (Publik & Peserta)</option>
                  <option value="participant">Hanya Calon Peserta</option>
                  <option value="admin">Hanya Internal Admin</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Status Publikasi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AnnouncementStatus)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                >
                  <option value="published">Dipublikasikan Langsung</option>
                  <option value="draft">Simpan sebagai Draft</option>
                  <option value="archived">Arsipkan</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Pengumuman?"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${deleteCandidate?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
