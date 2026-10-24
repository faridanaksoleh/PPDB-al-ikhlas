import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  Participant,
  Announcement,
  UserProfile,
  UserRole,
  RegistrationStatus,
  VerificationStatus,
} from '../types/database';

// Initial Mock Seed Data untuk demonstrasi & inisialisasi awal
const DEFAULT_SEED_PROFILES: UserProfile[] = [
  {
    id: 'admin-seed-fauzan',
    full_name: 'H. Fauzan Rahman, M.Pd.',
    email: 'admin@alikhlas.sch.id',
    role: 'admin',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'coord-seed-ustadzah',
    full_name: 'Ustadzah Nurul Hidayati, S.Pd.I.',
    email: 'panitia@alikhlas.sch.id',
    role: 'coordinator',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-part-001',
    full_name: 'Ahmad Faris Al-Fatih',
    email: 'ppdb2026001@siswa.alikhlas.sch.id',
    role: 'participant',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-part-002',
    full_name: 'Siti Maryam Azzahra',
    email: 'ppdb2026002@siswa.alikhlas.sch.id',
    role: 'participant',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-part-003',
    full_name: 'Muhammad Rayhan Pratama',
    email: 'ppdb2026003@siswa.alikhlas.sch.id',
    role: 'participant',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-part-004',
    full_name: 'Khansa Alya Nabila',
    email: 'ppdb2026004@siswa.alikhlas.sch.id',
    role: 'participant',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_SEED_PARTICIPANTS: Participant[] = [
  {
    id: 'pt-001',
    userId: 'user-part-001',
    participant_number: 'PPDB-2026-001',
    applied_grade: 'SD-1',
    registration_status: 'verified',
    verification_status: 'verified',
    origin_school: 'TK Islam Al-Hikmah',
    parent_phone: '081234567890',
    birth_date: '2019-05-14',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pt-002',
    userId: 'user-part-002',
    participant_number: 'PPDB-2026-002',
    applied_grade: 'SMP-7',
    registration_status: 'submitted',
    verification_status: 'pending',
    origin_school: 'SD Islam Al-Ikhlas',
    parent_phone: '081398765432',
    birth_date: '2014-08-20',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pt-003',
    userId: 'user-part-003',
    participant_number: 'PPDB-2026-003',
    applied_grade: 'SMA-10',
    registration_status: 'submitted',
    verification_status: 'revision_required',
    origin_school: 'SMP Negeri 1 Jakarta',
    parent_phone: '081512344321',
    birth_date: '2011-02-10',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pt-004',
    userId: 'user-part-004',
    participant_number: 'PPDB-2026-004',
    applied_grade: 'TK-A',
    registration_status: 'submitted',
    verification_status: 'verified',
    origin_school: 'KB Bintang Ceria',
    parent_phone: '081788990011',
    birth_date: '2021-11-05',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Tata Tertib Pelaksanaan Computer Based Test (CBT) Gelombang 1',
    content:
      'Calon peserta didik baru diimbau untuk memastikan koneksi internet stabil (minimal 5 Mbps) dan menggunakan peramban Google Chrome atau Microsoft Edge terbaru. Tes online akan dilaksanakan sesuai jadwal di portal ini.',
    status: 'published',
    target_role: 'all',
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    expires_at: null,
    authorId: 'admin-seed-fauzan',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ann-002',
    title: 'Verifikasi Berkas Calon Siswa Gelombang 1 Telah Dimulai',
    content:
      'Panitia PPDB Al-Ikhlas sedang melakukan verifikasi dokumen akta kelahiran, kartu keluarga, dan rapor calon peserta. Silakan pantau status verifikasi pada dashboard peserta masing-masing.',
    status: 'published',
    target_role: 'participant',
    published_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    expires_at: null,
    authorId: 'admin-seed-fauzan',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ann-003',
    title: 'Pengarahan Teknis Pengawas Tes Online & Proktor',
    content:
      'Seluruh pengawas ujian diharapkan menghadiri koordinasi internal via ruang rapat virtual pada H-1 pelaksanaan ujian jam 14.00 WIB.',
    status: 'published',
    target_role: 'coordinator',
    published_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    expires_at: null,
    authorId: 'admin-seed-fauzan',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DataService = {
  // --- USERS & PROFILES ---
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (!snap.exists()) return null;
      return snap.data() as UserProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async setUserProfile(profile: UserProfile): Promise<void> {
    const path = `users/${profile.id}`;
    try {
      await setDoc(doc(db, 'users', profile.id), profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // --- PARTICIPANTS ---
  async getParticipants(): Promise<Participant[]> {
    const path = 'participants';
    try {
      const snap = await getDocs(collection(db, 'participants'));
      if (snap.empty) {
        // Jika database Firestore belum memiliki data, seed data contoh awal
        await this.seedInitialFirestoreData();
        return DEFAULT_SEED_PARTICIPANTS.map((p) => ({
          ...p,
          profile: DEFAULT_SEED_PROFILES.find((prof) => prof.id === p.userId),
        }));
      }

      const participants: Participant[] = [];
      const userSnaps = await getDocs(collection(db, 'users'));
      const userMap = new Map<string, UserProfile>();
      userSnaps.forEach((doc) => {
        userMap.set(doc.id, doc.data() as UserProfile);
      });

      snap.forEach((doc) => {
        const data = doc.data() as Participant;
        participants.push({
          ...data,
          id: doc.id,
          profile: userMap.get(data.userId),
        });
      });

      return participants;
    } catch (error) {
      console.warn('Gagal membaca peserta Firestore, menggunakan data cache lokal:', error);
      return DEFAULT_SEED_PARTICIPANTS.map((p) => ({
        ...p,
        profile: DEFAULT_SEED_PROFILES.find((prof) => prof.id === p.userId),
      }));
    }
  },

  async getParticipantByUserId(userId: string): Promise<Participant | null> {
    const path = 'participants';
    try {
      const q = query(collection(db, 'participants'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (snap.empty) {
        // Cek fallback data awal
        const fallback = DEFAULT_SEED_PARTICIPANTS.find((p) => p.userId === userId);
        if (fallback) {
          return {
            ...fallback,
            profile: DEFAULT_SEED_PROFILES.find((prof) => prof.id === fallback.userId),
          };
        }
        return null;
      }
      const pDoc = snap.docs[0];
      const participant = pDoc.data() as Participant;
      const userProf = await this.getUserProfile(userId);
      return {
        ...participant,
        id: pDoc.id,
        profile: userProf || undefined,
      };
    } catch (error) {
      console.warn('Error fetching participant by userId:', error);
      const fallback = DEFAULT_SEED_PARTICIPANTS.find((p) => p.userId === userId);
      return fallback || null;
    }
  },

  async getParticipantByNumber(number: string): Promise<Participant | null> {
    const path = 'participants';
    try {
      const clean = number.trim().toUpperCase();
      const q = query(collection(db, 'participants'), where('participant_number', '==', clean));
      const snap = await getDocs(q);
      if (snap.empty) {
        const fallback = DEFAULT_SEED_PARTICIPANTS.find(
          (p) => p.participant_number.toUpperCase() === clean
        );
        return fallback || null;
      }
      const pDoc = snap.docs[0];
      const participant = pDoc.data() as Participant;
      const userProf = await this.getUserProfile(participant.userId);
      return {
        ...participant,
        id: pDoc.id,
        profile: userProf || undefined,
      };
    } catch (error) {
      console.warn('Error fetching participant by number:', error);
      const clean = number.trim().toUpperCase();
      return DEFAULT_SEED_PARTICIPANTS.find((p) => p.participant_number.toUpperCase() === clean) || null;
    }
  },

  async updateParticipantStatus(
    id: string,
    registrationStatus: RegistrationStatus,
    verificationStatus: VerificationStatus
  ): Promise<boolean> {
    const path = `participants/${id}`;
    try {
      await updateDoc(doc(db, 'participants', id), {
        registration_status: registrationStatus,
        verification_status: verificationStatus,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.warn('Update participant Firestore gagal, memperbarui status runtime:', error);
      // Update data di cache lokal
      const idx = DEFAULT_SEED_PARTICIPANTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        DEFAULT_SEED_PARTICIPANTS[idx].registration_status = registrationStatus;
        DEFAULT_SEED_PARTICIPANTS[idx].verification_status = verificationStatus;
        return true;
      }
      return false;
    }
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(userRole?: UserRole): Promise<Announcement[]> {
    const path = 'announcements';
    try {
      const snap = await getDocs(collection(db, 'announcements'));
      if (snap.empty) {
        await this.seedInitialFirestoreData();
        return this.filterAnnouncementsByRole(DEFAULT_SEED_ANNOUNCEMENTS, userRole);
      }

      const list: Announcement[] = [];
      snap.forEach((d) => {
        list.push({ ...d.data(), id: d.id } as Announcement);
      });

      return this.filterAnnouncementsByRole(list, userRole);
    } catch (error) {
      console.warn('Get announcements error, fallback to seed data:', error);
      return this.filterAnnouncementsByRole(DEFAULT_SEED_ANNOUNCEMENTS, userRole);
    }
  },

  filterAnnouncementsByRole(items: Announcement[], role?: UserRole): Announcement[] {
    if (role === 'admin' || role === 'coordinator') {
      return items;
    }
    if (role === 'participant') {
      return items.filter(
        (a) => a.status === 'published' && (a.target_role === 'all' || a.target_role === 'participant')
      );
    }
    // Publik
    return items.filter((a) => a.status === 'published' && a.target_role === 'all');
  },

  async createAnnouncement(
    announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Announcement | null> {
    const newId = `ann-${Date.now()}`;
    const path = `announcements/${newId}`;
    const now = new Date().toISOString();
    const newDoc: Announcement = {
      ...announcement,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'announcements', newId), newDoc);
      return newDoc;
    } catch (error) {
      console.warn('Create announcement in Firestore failed, storing in memory:', error);
      DEFAULT_SEED_ANNOUNCEMENTS.unshift(newDoc);
      return newDoc;
    }
  },

  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<boolean> {
    const path = `announcements/${id}`;
    const now = new Date().toISOString();
    try {
      await updateDoc(doc(db, 'announcements', id), {
        ...updates,
        updatedAt: now,
      });
      return true;
    } catch (error) {
      console.warn('Update announcement in Firestore failed, updating in memory:', error);
      const idx = DEFAULT_SEED_ANNOUNCEMENTS.findIndex((a) => a.id === id);
      if (idx !== -1) {
        DEFAULT_SEED_ANNOUNCEMENTS[idx] = { ...DEFAULT_SEED_ANNOUNCEMENTS[idx], ...updates, updatedAt: now };
        return true;
      }
      return false;
    }
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    const path = `announcements/${id}`;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      return true;
    } catch (error) {
      console.warn('Delete announcement in Firestore failed, removing in memory:', error);
      const idx = DEFAULT_SEED_ANNOUNCEMENTS.findIndex((a) => a.id === id);
      if (idx !== -1) {
        DEFAULT_SEED_ANNOUNCEMENTS.splice(idx, 1);
        return true;
      }
      return false;
    }
  },

  // Seed Data Firestore
  async seedInitialFirestoreData(): Promise<void> {
    try {
      for (const user of DEFAULT_SEED_PROFILES) {
        await setDoc(doc(db, 'users', user.id), user);
      }
      for (const p of DEFAULT_SEED_PARTICIPANTS) {
        await setDoc(doc(db, 'participants', p.id), p);
      }
      for (const ann of DEFAULT_SEED_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', ann.id), ann);
      }
      // Tambahkan admin record terpercaya untuk developer dan ketua panitia
      await setDoc(doc(db, 'admins', 'admin-seed-fauzan'), {
        email: 'admin@alikhlas.sch.id',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'admins', 'itspuyd_admin'), {
        email: 'itspuyd@gmail.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      // Abaikan jika permission rules sedang aktif atau user belum login
    }
  },
};
