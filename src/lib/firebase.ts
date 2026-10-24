import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Hubungkan ke Firestore database ID yang terdaftar pada konfigurasi
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Inisialisasi Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider untuk Admin & Panitia
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ====================================================================
// ERROR HANDLING STANDARD UNTUK FIRESTORE
// ====================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Security / Operation Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ====================================================================
// VALIDASI KONEKSI DATABASE FIRESTORE SAAT BOOTING
// ====================================================================
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Mencoba tes koneksi server langsung
    await getDocFromServer(doc(db, 'system_health', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Periksa konfigurasi koneksi jaringan Firebase.');
      return false;
    }
    // Jika mengembalikan permission denied atau not-found, koneksi ke server Firestore tetap sukses
    return true;
  }
}

// Format standar email peserta untuk pemetaan akun autentikasi Firebase
export function formatParticipantAuthEmail(participantNumber: string): string {
  const clean = participantNumber.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${clean}@siswa.alikhlas.sch.id`;
}
