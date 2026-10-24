import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SCHOOL_CONFIG } from '../config/school.config';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Shield, ArrowLeft, KeyRound, Mail, Lock, ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC<{
  onBack: () => void;
  onSuccess: () => void;
  onSwitchToParticipant: () => void;
}> = ({ onBack, onSuccess, onSwitchToParticipant }) => {
  const { signInAdminWithEmail, signInAdminWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Alamat email panitia wajib diisi.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Format alamat email tidak valid.';
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validate()) return;

    const res = await signInAdminWithEmail(email, password);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.error || 'Autentikasi admin gagal. Pastikan kredensial Anda terdaftar.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    const res = await signInAdminWithGoogle();
    if (res.success) {
      onSuccess();
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(demoEmail.includes('panitia') ? 'PanitiaAlIkhlas2026!' : 'AdminAlIkhlas2026!');
    setFieldErrors({});
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#F8FAF7]">
      <div className="w-full max-w-md space-y-6">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Card */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="text-center pb-4 border-b border-slate-100">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#14532D]/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#14532D]" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Portal Administrator & Panitia PPDB
            </h2>
            <p className="text-xs text-slate-500">
              Autentikasi Firebase terverifikasi untuk Panitia Penerimaan dan Administrator Ujian.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-5">
            {errorMsg && (
              <Alert variant="error" title="Akses Ditolak" onDismiss={() => setErrorMsg(null)}>
                {errorMsg}
              </Alert>
            )}

            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
              className="w-full justify-center border-slate-300 text-slate-700 hover:bg-slate-50 gap-2.5 font-medium shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Google (Akun Resmi Panitia)</span>
            </Button>

            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                Atau Email Terdaftar
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3" noValidate>
              <Input
                label="Email Panitia / Administrator"
                type="email"
                placeholder="panitia@alikhlas.sch.id"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                }}
                leftIcon={<Mail className="w-4 h-4" />}
                error={fieldErrors.email}
                disabled={isLoading}
              />

              <Input
                label="Kata Sandi Administrator"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                }}
                leftIcon={<KeyRound className="w-4 h-4" />}
                error={fieldErrors.password}
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center bg-[#14532D] hover:bg-[#166534]"
                isLoading={isLoading}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Masuk ke Panel Administrasi
              </Button>
            </form>

            {/* Demo Testing Assistant */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Kredensial Contoh Pengujian (Demo)
                </span>
                <span className="text-[10px] text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded font-medium">
                  Pengujian
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin@alikhlas.sch.id')}
                  className="text-left text-xs bg-white hover:bg-slate-100 border border-slate-200 p-2 rounded text-slate-700 transition-colors"
                >
                  <span className="font-semibold block text-slate-800">Admin Utama</span>
                  <span className="text-[10px] text-slate-500 font-mono">admin@alikhlas.sch.id</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('panitia@alikhlas.sch.id')}
                  className="text-left text-xs bg-white hover:bg-slate-100 border border-slate-200 p-2 rounded text-slate-700 transition-colors"
                >
                  <span className="font-semibold block text-slate-800">Koordinator PPDB</span>
                  <span className="text-[10px] text-slate-500 font-mono">panitia@alikhlas.sch.id</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onSwitchToParticipant}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Anda calon peserta didik? <span className="font-semibold text-[#14532D]">Login Peserta</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
