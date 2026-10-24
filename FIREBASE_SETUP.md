# Panduan Backend Firebase — Al-Ikhlas Admission Test

Aplikasi telah dimigrasikan dari Supabase ke **Google Firebase (Firebase Authentication & Cloud Firestore)**.

---

## 1. Konfigurasi Proyek
Konfigurasi tersimpan secara otomatis di `firebase-applet-config.json`:
- **Project ID**: `gen-lang-client-0390272883`
- **Firestore Database ID**: `ai-studio-alikhlasadmissio-59131057-7547-486e-b560-97c44f724a77`
- **Auth Domain**: `gen-lang-client-0390272883.firebaseapp.com`

---

## 2. Model Autentikasi & Hak Akses (RBAC)

Sistem membedakan tiga tingkatan peran pengguna:
1. **admin**:
   - Hak penuh mengelola seluruh data peserta, verifikasi berkas, pengumuman, dan konfigurasi.
   - Dapat login menggunakan **Google Sign-In** (khusus akun resmi yang terdaftar) atau email & kata sandi panitia.
   - Akun pengembang `itspuyd@gmail.com` secara otomatis di-bootstrap sebagai admin terpercaya.
2. **coordinator**:
   - Panitia pelaksana tes yang bertugas memverifikasi berkas calon siswa dan menerbitkan pengumuman.
   - Dapat login menggunakan Google Sign-In atau email panitia.
3. **participant**:
   - Calon peserta didik baru.
   - Login menggunakan **Nomor Peserta** (misal: `PPDB-2026-001`) dan Kata Sandi.
   - Di sisi Firebase Auth, nomor peserta dipetakan ke email terenkripsi (misal: `ppdb2026001@siswa.alikhlas.sch.id`), sehingga kata sandi tidak pernah disimpan dalam plaintext di Firestore.

---

## 3. Struktur Cloud Firestore (firebase-blueprint.json)

1. `/users/{userId}`:
   - Menyimpan profil pengguna (`id`, `full_name`, `email`, `role`, `createdAt`, `updatedAt`).
2. `/participants/{participantId}`:
   - Menyimpan data calon siswa (`userId`, `participant_number`, `applied_grade`, `registration_status`, `verification_status`, `origin_school`, `parent_phone`).
3. `/announcements/{announcementId}`:
   - Pengumuman resmi PPDB (`title`, `content`, `status`, `target_role`, `published_at`, `expires_at`, `authorId`).
4. `/admins/{adminId}`:
   - Data otorisasi terpercaya di sisi database untuk mencegah manipulasi peran dari klien.

---

## 4. Keamanan Firestore Security Rules (firestore.rules)

Aturan keamanan diterapkan dengan prinsip **Default-Deny** dan hak akses minimum:
- Seluruh koleksi menolak baca/tulis secara bawaan (`match /{document=**} { allow read, write: if false; }`).
- Peserta **hanya** dapat membaca data pribadi miliknya sendiri (`resource.data.userId == request.auth.uid`).
- Pengguna biasa **tidak dapat** menaikkan rolenya menjadi admin; pembaruan dibatasi pada kolom `full_name` dan `updatedAt`.
- Dokumen pengumuman hanya dapat dibaca publik jika `status == 'published'`.

---

## 5. Kredensial Uji Coba Demo

Untuk kemudahan pengujian:
- **Admin**: Klik "Admin Utama" (`admin@alikhlas.sch.id` / `AdminAlIkhlas2026!`) atau gunakan tombol "Masuk dengan Google" dengan akun `itspuyd@gmail.com`.
- **Koordinator**: Klik "Koordinator PPDB" (`panitia@alikhlas.sch.id` / `PanitiaAlIkhlas2026!`).
- **Peserta**: Masukkan nomor `PPDB-2026-001` s/d `PPDB-2026-004` dengan kata sandi `SiswaBismillah2026`.
