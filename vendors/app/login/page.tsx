'use client';

import { useState } from 'react';
import { handleLogin, handleSignup } from './actions';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('errorMessage');

  const onLogin = async () => {
    setIsLoading(true);
    try {
      await handleLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async () => {
    setIsLoading(true);
    try {
      await handleSignup(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-white/50 overflow-hidden">

        {/* Header Section */}
        <div className="bg-white p-8 pb-0 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-XL flex items-center justify-center text-blue-600 mb-4 rounded-xl">
            <Store size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage your store and orders</p>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-6 space-y-5">

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={onLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider font-medium">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              onClick={() => router.push('/signUp')}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              Create New Vendor Account
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
