import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-900">
              {mode === 'login' ? 'Login' : 'Register'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
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
              {mode === 'register' && (
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            <button className="w-full px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500">
              {mode === 'login' ? 'Login' : 'Register'}
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-pink-400 hover:text-pink-500">
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-pink-400 hover:text-pink-500">
                    Login
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-pink-50 rounded-lg">
            <p className="text-sm text-gray-900">
              💡 This is a demo. Use any email and password to create an account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}