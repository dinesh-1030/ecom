'use client';

import * as React from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth-provider';

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, signup, signInWithGoogle } = useAuth();
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password, phone);
      }
      setLoading(false);
    }, 800);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert(error instanceof Error ? error.message : 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => setAuthModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex w-full max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl">
        {/* Left Side Visual Banner */}
        <div className="hidden md:flex w-2/5 flex-col justify-between bg-gradient-to-br from-neutral-900 via-neutral-950 to-amber-950 p-6 text-white border-r border-border/40">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              AURA Luxury
            </span>
            <h3 className="mt-3 text-2xl font-bold leading-snug">
              Experience Next-Gen Fashion
            </h3>
            <p className="mt-2 text-xs text-neutral-300">
              Log in to sync your personalized AI Try-On avatars, saved wishlist items, and instant checkout.
            </p>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>100% Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Free Express Delivery Across India</span>
            </div>
          </div>
        </div>

        {/* Right Form Area */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {authMode === 'login'
                  ? 'Enter your credentials to access your bag and fit avatars'
                  : 'Join AURA to get member exclusive discounts & try-on previews'}
              </p>
            </div>
            <button
              onClick={() => setAuthModalOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vishnu Selvan"
                    className="pl-9 text-xs h-9"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="pl-9 text-xs h-9"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold h-10 mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {authMode === 'login' ? 'Sign In' : 'Register Account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Mock Google Login */}
          <div className="mt-4 text-center">
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-2 text-[10px] uppercase text-muted-foreground">
                Or Continue With
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 py-2 text-xs font-semibold hover:bg-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
              )}
              {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </button>

            <p className="mt-4 text-xs text-muted-foreground">
              {authMode === 'login' ? "Don't have an account? " : 'Already registered? '}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="font-bold text-amber-500 hover:underline"
              >
                {authMode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}