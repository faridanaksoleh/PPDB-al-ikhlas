/**
 * Konfigurasi Utama Sekolah & Portal PPDB Al-Ikhlas
 * Semua informasi kontak atau operasional diberi label demo yang transparan sesuai panduan.
 */

export const SCHOOL_CONFIG = {
  name: 'Sekolah Al-Ikhlas',
  portalName: 'Al-Ikhlas Admission Test',
  tagline: 'Siapkan Langkah Pertamamu Bersama Al-Ikhlas',
  description:
    'Portal resmi pelaksanaan tes seleksi penerimaan peserta didik baru (PPDB) Sekolah Al-Ikhlas berbasis Computer Based Testing (CBT) online yang terintegrasi, transparan, dan objektif.',
  academicYear: '2026/2027',
  
  // Brand Assets
  logoUrl: '/src/assets/images/logo_al_ikhlas_crest_1792632499824.jpg',
  heroImageUrl: '/src/assets/images/hero_campus_al_ikhlas_1792632500022.jpg',

  // Brand Colors (Hex reference)
  colors: {
    deepEmerald: '#14532D',
    forestGreen: '#166534',
    warmGold: '#D4A853',
    background: '#F8FAF7',
    surface: '#FFFFFF',
    text: '#1F2937',
    muted: '#64748B',
    error: '#DC2626',
  },

  // Jenjang yang dibuka
  grades: [
    { code: 'KB', label: 'Kelompok Bermain (KB)', age: 'Usia 3 - 4 Tahun' },
    { code: 'TK-A', label: 'Taman Kanak-Kanak A', age: 'Usia 4 - 5 Tahun' },
    { code: 'TK-B', label: 'Taman Kanak-Kanak B', age: 'Usia 5 - 6 Tahun' },
    { code: 'SD-1', label: 'Sekolah Dasar (Kelas 1)', age: 'Usia 6 - 7 Tahun' },
    { code: 'SMP-7', label: 'SMP Islam (Kelas 7)', age: 'Lulusan SD/MI' },
    { code: 'SMA-10', label: 'SMA Islam (Kelas 10)', age: 'Lulusan SMP/MTs' },
  ] as const,

  // Petunjuk Pelaksanaan Tes
  testGuidelines: [
    {
      step: '01',
      title: 'Verifikasi Akun & Kartu Peserta',
      description:
        'Gunakan Nomor Peserta dan Password yang diterbitkan oleh Panitia PPDB saat pendaftaran berkas telah diverifikasi.',
    },
    {
      step: '02',
      title: 'Pemeriksaan Perangkat & Jaringan',
      description:
        'Pastikan menggunakan browser Chrome/Edge terbaru dengan koneksi internet stabil (minimal 5 Mbps). Tes dapat diakses via laptop atau tablet.',
    },
    {
      step: '03',
      title: 'Pengerjaan Tes Sesuai Jadwal',
      description:
        'Masuk ke portal 15 menit sebelum waktu tes dimulai. Sesi ujian akan terkunci otomatis setelah waktu tes berakhir.',
    },
    {
      step: '04',
      title: 'Integritas & Kejujuran Akademik',
      description:
        'Calon peserta didik wajib mengerjakan soal secara mandiri dengan menjunjung tinggi nilai kejujuran Islami.',
    },
  ],

  // Kontak Panitia PPDB (Demo data transparan)
  contact: {
    isDemo: true,
    address: 'Jl. Cipete III No. 3, Cilandak, Jakarta Selatan (Contoh Demo)',
    phone: '+62 21 7501488 (Demo Helplink)',
    whatsapp: '+62 812-3456-7890 (WhatsApp Panitia PPDB Demo)',
    email: 'ppdb@alikhlas-demo.sch.id',
    serviceHours: 'Senin - Jumat: 08.00 - 15.00 WIB | Sabtu: 08.00 - 12.00 WIB',
  },
} as const;
