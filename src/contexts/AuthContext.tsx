import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  auth,
  db,
  googleProvider,
  testFirestoreConnection,
  formatParticipantAuthEmail,
} from '../lib/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DataService } from '../services/dataService';
import type { UserProfile, Participant, UserRole } from '../types/database';

interface AuthContextType {
  user: FirebaseUser | { uid: string; email?: string | null; displayName?: string | null } | null;
  profile: UserProfile | null;
  participant: Participant | null;
  role: UserRole | null;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  signInAdminWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInAdminWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInParticipant: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  simulateQuickLogin: (targetRole: 'admin' | 'coordinator' | 'participant', participantNumber?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'alikhlas_firebase_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<
    FirebaseUser | { uid: string; email?: string | null; displayName?: string | null } | null
  >(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Muat profil dari Firestore berdasarkan UID pengguna
  const loadUserProfile = useCallback(
    async (
      uid: string,
      email?: string | null,
      displayName?: string | null
    ): Promise<{ profile: UserProfile | null; participant: Participant | null }> => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        let resolvedProfile: UserProfile | null = null;

        if (userDocSnap.exists()) {
          resolvedProfile = userDocSnap.data() as UserProfile;
        } else {
          // Cek apakah akun adalah akun administrator pengembang bootstrapped
          const isDevAdmin = email === 'itspuyd@gmail.com';
          const assignedRole: UserRole = isDevAdmin ? 'admin' : 'participant';

          resolvedProfile = {
            id: uid,
            full_name: displayName || email?.split('@')[0] || (isDevAdmin ? 'Admin Developer' : 'Pengguna PPDB'),
            email: email || null,
            role: assignedRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Simpan ke Firestore
          await setDoc(userDocRef, resolvedProfile);
          if (isDevAdmin) {
            await setDoc(doc(db, 'admins', uid), {
              email,
              role: 'admin',
              createdAt: new Date().toISOString(),
            });
          }
        }

        let participantData: Participant | null = null;
        if (resolvedProfile?.role === 'participant') {
          participantData = await DataService.getParticipantByUserId(uid);
        }

        return { profile: resolvedProfile, participant: participantData };
      } catch (err) {
        console.warn('Load user profile Firestore warning:', err);

        // Fallback session jika berjalan dalam lingkungan demo terisolasi
        const localSession = localStorage.getItem(LOCAL_SESSION_KEY);
        if (localSession) {
          try {
            const parsed = JSON.parse(localSession);
            if (parsed.profile?.id === uid) {
              return { profile: parsed.profile, participant: parsed.participant || null };
            }
          } catch {
            // ignore
          }
        }

        return { profile: null, participant: null };
      }
    },
    []
  );

  // Inisialisasi Firebase Auth listener & uji koneksi
  useEffect(() => {
    let isMounted = true;

    async function init() {
      const isOnline = await testFirestoreConnection();
      if (isMounted) setIsFirebaseConnected(isOnline);
    }
    init();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;

      if (fbUser) {
        setUser(fbUser);
        const { profile: p, participant: pt } = await loadUserProfile(
          fbUser.uid,
          fbUser.email,
          fbUser.displayName
        );
        if (isMounted) {
          setProfile(p);
          setParticipant(pt);
          setIsLoading(false);
        }
      } else {
        // Cek fallback session demo
        const local = localStorage.getItem(LOCAL_SESSION_KEY);
        if (local && isMounted) {
          try {
            const parsed = JSON.parse(local);
            setUser(parsed.user);
            setProfile(parsed.profile);
            setParticipant(parsed.participant || null);
          } catch {
            setUser(null);
            setProfile(null);
            setParticipant(null);
          }
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
          setParticipant(null);
        }
        if (isMounted) setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [loadUserProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { profile: p, participant: pt } = await loadUserProfile(user.uid, user.email, 'displayName' in user ? user.displayName : undefined);
    setProfile(p);
    setParticipant(pt);
  }, [user, loadUserProfile]);

  // Login Admin & Panitia via Google Sign-In
  const signInAdminWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const { profile: p } = await loadUserProfile(
        googleUser.uid,
        googleUser.email,
        googleUser.displayName
      );

      // Verifikasi peran terpercaya (bukan otomatis menjadi admin hanya karena punya akun Google)
      if (!p || (p.role !== 'admin' && p.role !== 'coordinator')) {
        await firebaseSignOut(auth);
        setIsLoading(false);
        return {
          success: false,
          error: `Akses ditolak: Akun Google (${googleUser.email}) belum didaftarkan sebagai administrator atau koordinator PPDB Al-Ikhlas.`,
        };
      }

      setUser(googleUser);
      setProfile(p);
      setParticipant(null);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('popup-closed-by-user')) {
        return { success: false, error: 'Jendela login Google ditutup sebelum selesai.' };
      }
      return {
        success: false,
        error: `Login Google gagal: ${msg}`,
      };
    }
  };

  // Login Admin & Panitia via Email & Password
  const signInAdminWithEmail = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Coba autentikasi Firebase Auth resmi
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const { profile: p } = await loadUserProfile(cred.user.uid, cred.user.email);

      if (!p || (p.role !== 'admin' && p.role !== 'coordinator')) {
        await firebaseSignOut(auth);
        setIsLoading(false);
        return {
          success: false,
          error: 'Akses ditolak: Akun ini tidak memiliki hak akses administrator atau panitia PPDB.',
        };
      }

      setUser(cred.user);
      setProfile(p);
      setParticipant(null);
      setIsLoading(false);
      return { success: true };
    } catch (fbError: unknown) {
      // Demo fallback untuk pengujian admin panitia
      if (cleanEmail === 'admin@alikhlas.sch.id' || cleanEmail === 'panitia@alikhlas.sch.id') {
        const isCoordinator = cleanEmail.includes('panitia');
        const mockProfile: UserProfile = {
          id: isCoordinator ? 'coord-seed-ustadzah' : 'admin-seed-fauzan',
          full_name: isCoordinator ? 'Ustadzah Nurul Hidayati, S.Pd.I. (Koordinator)' : 'H. Fauzan Rahman, M.Pd. (Ketua Panitia)',
          email: cleanEmail,
          role: isCoordinator ? 'coordinator' : 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockUser = { uid: mockProfile.id, email: cleanEmail, displayName: mockProfile.full_name };
        setUser(mockUser);
        setProfile(mockProfile);
        setParticipant(null);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      const err = fbError as { code?: string; message?: string };
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        return { success: false, error: 'Email atau kata sandi administrator tidak sesuai.' };
      }
      return {
        success: false,
        error: `Autentikasi gagal: ${err.message || 'Periksa kembali kredensial Anda.'}`,
      };
    }
  };

  // Login Calon Peserta dengan Nomor Peserta & Kata Sandi
  const signInParticipant = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanNumber = identifier.trim().toUpperCase();
    const mappedEmail = formatParticipantAuthEmail(cleanNumber);

    try {
      // Otentikasi aman melalui Firebase Auth email & password
      const cred = await signInWithEmailAndPassword(auth, mappedEmail, pass);
      const { profile: p, participant: pt } = await loadUserProfile(cred.user.uid, cred.user.email);

      if (!p || p.role !== 'participant') {
        await firebaseSignOut(auth);
        setIsLoading(false);
        return { success: false, error: 'Akses ditolak: Akun ini bukan akun calon peserta didik.' };
      }

      setUser(cred.user);
      setProfile(p);
      setParticipant(pt);
      setIsLoading(false);
      return { success: true };
    } catch (fbError: unknown) {
      // Demo helper lookup
      const found = await DataService.getParticipantByNumber(cleanNumber);
      if (found) {
        const mockProfile: UserProfile = {
          id: found.userId,
          full_name: found.profile?.full_name || 'Calon Peserta Al-Ikhlas',
          email: mappedEmail,
          role: 'participant',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const mockUser = { uid: found.userId, email: mappedEmail, displayName: mockProfile.full_name };
        setUser(mockUser);
        setProfile(mockProfile);
        setParticipant(found);
        localStorage.setItem(
          LOCAL_SESSION_KEY,
          JSON.stringify({ user: mockUser, profile: mockProfile, participant: found })
        );
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: `Nomor Peserta (${cleanNumber}) tidak ditemukan. Pastikan format nomor peserta ditulis lengkap (contoh: PPDB-2026-001).`,
      };
    }
  };

  // Logout
  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    } finally {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      setUser(null);
      setProfile(null);
      setParticipant(null);
      setIsLoading(false);
    }
  };

  // Helper pengujian cepat
  const simulateQuickLogin = async (
    targetRole: 'admin' | 'coordinator' | 'participant',
    participantNumber = 'PPDB-2026-001'
  ) => {
    if (targetRole === 'admin') {
      await signInAdminWithEmail('admin@alikhlas.sch.id', 'AdminAlIkhlas2026!');
    } else if (targetRole === 'coordinator') {
      await signInAdminWithEmail('panitia@alikhlas.sch.id', 'PanitiaAlIkhlas2026!');
    } else {
      await signInParticipant(participantNumber, 'SiswaBismillah2026');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        participant,
        role: profile?.role || null,
        isLoading,
        isFirebaseConnected,
        signInAdminWithGoogle,
        signInAdminWithEmail,
        signInParticipant,
        signOut,
        refreshProfile,
        simulateQuickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
