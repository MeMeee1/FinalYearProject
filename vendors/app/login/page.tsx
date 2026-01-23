'use client';

import { useState } from 'react';
import { handleLogin } from './actions';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, Store, ChevronRight, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-card rounded-[3rem] shadow-2xl shadow-primary/5 border border-border overflow-hidden relative backdrop-blur-sm">

          {/* Top Branding Section */}
          <div className="p-10 pb-4 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary/20 rotate-6 hover:rotate-0 transition-transform duration-500">
              <Store className="text-primary-foreground w-8 h-8 -rotate-6 group-hover:rotate-0" />
            </div>
            <div className="space-y-1">
              <Heading className="text-3xl font-black tracking-tighter text-foreground">Vendor access</Heading>
              <Text className="text-muted-foreground font-medium text-sm">Synchronize with your business hub.</Text>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-10 pt-6 space-y-6">

            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Secure Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-border bg-secondary/30 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground font-bold placeholder:text-muted-foreground/40 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Access Token</label>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Lost access?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-14 pr-14 py-4 rounded-2xl border border-border bg-secondary/30 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground font-bold placeholder:text-muted-foreground/40 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive animate-in shake-1">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <Text className="text-xs font-bold">{errorMessage}</Text>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <button
                onClick={onLogin}
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group uppercase text-xs tracking-[0.15em]"
              >
                {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : 'Authorize Session'}
                {!isLoading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-border/50"></div>
                <span className="flex-shrink-0 mx-6 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">Institutional Access</span>
                <div className="flex-grow border-t border-border/50"></div>
              </div>

              <button
                onClick={() => router.push('/signUp')}
                className="w-full bg-secondary/50 hover:bg-secondary text-foreground font-black py-4 rounded-2xl border border-border transition-all active:scale-[0.98] text-xs uppercase tracking-widest"
              >
                Onboard New Enterprise
              </button>
            </div>
          </div>

          <div className="p-8 bg-secondary/20 text-center border-t border-border/50">
            <Text className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
              Final Year Project &bull; 2026
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
