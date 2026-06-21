import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hook/useAuth';
import { authService } from '@/services/auth.service';
// import { authService } from '@/services/authService';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

type Mode = 'login' | 'register' | 'forgot' | 'verify-otp' | 'reset';

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    otp: '',
    newPassword: '',
  });

  const { login, register, loading, error, clearError } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) clearError();
    setApiError('');
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    clearError();
    setApiError('');
    setSuccessMsg('');
    setForm({ username: '', email: '', phone: '', password: '', otp: '', newPassword: '' });
  };

  // ── Login / Register ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let ok = false;

    if (mode === 'login') {
      ok = await login({ email: form.email, password: form.password });
    } else {
      ok = await register({
        firstName: form.username,
        lastName: form.username,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
    }

    if (ok) {
      onSuccess?.();
      onClose();
    }
  };

  // ── Step 1: Send OTP ─────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setApiError('');
    try {
      await authService.forgotPassword(form.email);
      setOtpEmail(form.email);
      setMode('verify-otp');
    } catch (err: any) {
      setApiError(err.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setApiError('');
    try {
      const data = await authService.verifyOtp(otpEmail, form.otp);
      setResetToken(data.resetToken);
      setMode('reset');
    } catch (err: any) {
      setApiError(err.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setApiError('');
    try {
      await authService.resetPassword(resetToken, form.newPassword);
      setSuccessMsg('Password reset successful! Please login.');
      setTimeout(() => switchMode('login'), 2000);
    } catch (err: any) {
      setApiError(err.message || 'Reset failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const isLoading = loading || otpLoading;
  const displayError = error || apiError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-900">
              {mode === 'login' && 'Login'}
              {mode === 'register' && 'Register'}
              {mode === 'forgot' && 'Forgot Password'}
              {mode === 'verify-otp' && 'Verify OTP'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {displayError}
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              {successMsg}
            </div>
          )}

          {/* ── LOGIN ── */}
          {mode === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-pink-400 hover:text-pink-500"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Login
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button onClick={() => switchMode('register')} className="text-pink-400 hover:text-pink-500">
                    Register
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ── REGISTER ── */}
          {mode === 'register' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Username *</label>
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Phone *</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Register
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button onClick={() => switchMode('login')} className="text-pink-400 hover:text-pink-500">
                    Login
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-gray-500">
                Enter your registered email and we'll send you an OTP code.
              </p>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Enter your registered email"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send OTP
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-sm text-pink-400 hover:text-pink-500"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* ── VERIFY OTP ── */}
          {mode === 'verify-otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-gray-500">
                We sent a 6-digit OTP to{' '}
                <span className="font-medium text-gray-700">{otpEmail}</span>. Check your inbox!
              </p>
              <div>
                <label className="block text-sm text-gray-700 mb-2">OTP Code *</label>
                <input
                  name="otp"
                  type="text"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify OTP
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-pink-400 hover:text-pink-500"
                >
                  ← Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* ── RESET PASSWORD ── */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-gray-500">
                Enter your new password below.
              </p>
              <div>
                <label className="block text-sm text-gray-700 mb-2">New Password *</label>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Reset Password
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}