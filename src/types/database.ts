/**
 * Definisi Type Database & Model untuk Al-Ikhlas Admission Test (Firebase & Cloud Firestore)
 */

export type UserRole = 'admin' | 'coordinator' | 'participant';

export type AppliedGrade = 'KB' | 'TK-A' | 'TK-B' | 'SD-1' | 'SMP-7' | 'SMA-10';

export type RegistrationStatus = 'draft' | 'submitted' | 'verified' | 'rejected';

export type VerificationStatus = 'pending' | 'verified' | 'revision_required' | 'rejected';

export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export type AnnouncementTarget = 'all' | 'participant' | 'coordinator' | 'admin';

export interface UserProfile {
  id: string; // Firebase Auth UID
  full_name: string;
  email?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Participant {
  id: string; // Firestore document ID
  userId: string; // Foreign key ke users.id
  participant_number: string; // Contoh: PPDB-2026-001
  applied_grade: AppliedGrade;
  registration_status: RegistrationStatus;
  verification_status: VerificationStatus;
  birth_date?: string | null;
  origin_school?: string | null;
  parent_phone?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: UserProfile;
}

export interface Announcement {
  id: string; // Firestore document ID
  title: string;
  content: string;
  status: AnnouncementStatus;
  target_role: AnnouncementTarget;
  published_at: string | null;
  expires_at: string | null;
  authorId?: string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ====================================================================
// PERSIAPAN STRUKTUR DATA UNTUK MODUL 2 - 4
// ====================================================================

export type QuestionType = 'multiple_choice' | 'short_answer' | 'observation_checklist';

export interface QuestionBankItem {
  id: string;
  grade: AppliedGrade;
  category: 'tpa' | 'academic_readiness' | 'islamic_studies';
  type: QuestionType;
  question_text: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamPackage {
  id: string;
  title: string;
  grade: AppliedGrade;
  durationMinutes: number;
  questionIds: string[];
  totalScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamSchedule {
  id: string;
  packageId: string;
  waveName: string;
  startTime: string;
  endTime: string;
  isLocked: boolean;
}

export interface DigitalExamCard {
  id: string;
  participantId: string;
  participant_number: string;
  fullName: string;
  grade: AppliedGrade;
  roomName: string;
  qrCodeToken: string;
  issuedAt: string;
}

export interface ParticipantExamAnswer {
  id: string;
  participantId: string;
  packageId: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
  submittedAt?: string | null;
  autoSavedAt: string;
}

export interface ExamResult {
  id: string;
  participantId: string;
  packageId: string;
  totalScore: number;
  passingGrade: number;
  isPassed: boolean;
  rank: number;
  evaluatedAt: string;
}
