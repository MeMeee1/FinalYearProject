'use client';

import { useState } from 'react';
import { handleLogin, handleSignup } from './actions';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-white/50 overflow-hidden">

        {/* Header Section */}
        <div className="bg-white p-8 pb-0 text-center">
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 mb-4">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to access platform controls</p>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-6 space-y-5">

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
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
              className="w-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            {/* Admin typically doesn't have public signup, but keeping it as feature parity with previous code, but de-emphasized */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-medium">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              onClick={onSignup}
              disabled={isLoading}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              Create Admin Account
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Authorized personnel only. Access is monitored.
          </p>
        </div>

      </div>
    </div>
  );
}
