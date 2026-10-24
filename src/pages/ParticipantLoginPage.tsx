import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SCHOOL_CONFIG } from '../config/school.config';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { UserCheck, ArrowLeft, KeyRound, Hash, HelpCircle, ShieldAlert } from 'lucide-react';

export const ParticipantLoginPage: React.FC<{
  onBack: () => void;
  onSuccess: () => void;
  onSwitchToAdmin: () => void;
}> = ({ onBack, onSuccess, onSwitchToAdmin }) => {
  const { signInParticipant, isLoading, isFirebaseConnected } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = () => {
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier = 'Nomor Peserta atau Username wajib diisi.';
    } else if (identifier.trim().length < 4) {
      errors.identifier = 'Nomor Peserta minimal 4 karakter.';
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 4) {
      errors.password = 'Kata sandi minimal 4 karakter.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validate()) return;

    const res = await signInParticipant(identifier, password);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.error || 'Gagal masuk. Periksa kembali Nomor Peserta dan Kata Sandi.');
    }
  };

  // Demo account quick filler (labeled demo clearly)
  const handleFillDemo = (num: string) => {
    setIdentifier(num);
    setPassword('SiswaBismillah2026');
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
              <img
                src={SCHOOL_CONFIG.logoUrl}
                alt="Logo Al-Ikhlas"
                className="w-10 h-10 object-contain rounded-lg"
              />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Masuk Calon Peserta
            </h2>
            <p className="text-xs text-slate-500">
              Gunakan Nomor Peserta yang tertera pada Kartu Tanda Peserta PPDB Al-Ikhlas.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-5">
            {errorMsg && (
              <Alert variant="error" title="Gagal Masuk" onDismiss={() => setErrorMsg(null)}>
                {errorMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Nomor Peserta / Username"
                placeholder="Contoh: PPDB-2026-001"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) setFieldErrors({ ...fieldErrors, identifier: undefined });
                }}
                leftIcon={<Hash className="w-4 h-4" />}
                error={fieldErrors.identifier}
                disabled={isLoading}
                autoFocus
              />

              <Input
                label="Kata Sandi"
                type="password"
                placeholder="••••••••"
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
                className="w-full justify-center"
                isLoading={isLoading}
              >
                Masuk ke Ruang Tes
              </Button>
            </form>

            {/* Demo Testing Assistant (Explicitly marked Demo) */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#166534]" />
                  Akun Contoh Demo Calon Siswa
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-100/60 px-1.5 py-0.2 rounded font-medium">
                  Pengujian
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFillDemo('PPDB-2026-001')}
                  className="text-xs font-mono bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 transition-colors"
                >
                  PPDB-2026-001 (SD-1)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('PPDB-2026-002')}
                  className="text-xs font-mono bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 transition-colors"
                >
                  PPDB-2026-002 (SMP-7)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('PPDB-2026-003')}
                  className="text-xs font-mono bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-700 transition-colors"
                >
                  PPDB-2026-003 (SMA-10)
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Klik salah satu nomor di atas untuk mengisi form otomatis.
              </p>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Anda panitia atau penguji? <span className="font-semibold text-[#14532D]">Login Admin</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
