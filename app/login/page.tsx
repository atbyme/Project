'use client';

export const dynamic = 'force-dynamic';


import { useState } from 'react';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const VERCEL_URL = 'https://complainceai-pi.vercel.app';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${VERCEL_URL}/auth/callback` },

        });
        if (error) throw error;
        setSuccess('Account created! Check your email for the confirmation link.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${VERCEL_URL}/auth/callback`,

          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      if (error) {
        if (error.message.includes('provider is not enabled')) {
          setError('Google Login is not enabled in the Supabase Dashboard. Please enable the Google provider in Authentication > Providers.');
        } else {
          throw error;
        }
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setError(err.message || 'Google Sign-In failed. Please try again.');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-6 selection:bg-emerald-500/30">
      <div className="fixed inset-0 glow-mesh pointer-events-none opacity-50 z-0" />

      {/* Top-right theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Back to home */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground transition-colors"
        >
          <Shield className="w-4 h-4 text-emerald-500" />
          ComplianceShield AI
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10 glass-card p-10 rounded-[2.5rem]">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLogin ? 'Welcome back' : 'Join the Firm'}
          </h1>
          <p className="text-foreground/40 text-sm leading-relaxed max-w-[280px] mx-auto text-balance">
            {isLogin
              ? "Access your secure vault and continue your firm's compliance journey."
              : 'Secure your first high-value legal bundle in under 5 minutes.'}
          </p>

        </div>

        {/* Google SSO */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-background text-foreground/30">Or continue with email</span>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium text-center">
            {success}
          </div>
        )}

        {/* Email / Password form */}
        <form onSubmit={handleAuth} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type="email"
              placeholder="CEO@yourstartup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-foreground/10 rounded-xl outline-none focus:border-emerald-500/50 transition-all text-foreground placeholder:text-foreground/25 text-sm"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-foreground/10 rounded-xl outline-none focus:border-emerald-500/50 transition-all text-foreground placeholder:text-foreground/25 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_16px_rgba(16,185,129,0.25)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isLogin ? 'Access Dashboard' : 'Create Secure Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-foreground/40">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
            className="text-emerald-500 font-bold hover:underline"
          >
            {isLogin ? 'Sign up free' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
