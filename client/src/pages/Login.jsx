import React, { useState } from 'react';
import { Crown, Mail, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';

export const Login = ({ onNavigate }) => {
  const { customerLogin } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await customerLogin({ email, password });
      onNavigate('/profile');
    } catch (err) {
      addToast(err.message || 'Login failed. Please check your email and password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-royal-black text-white p-8 text-center border-b border-gold/30">
          <div className="w-14 h-14 rounded-full bg-black border-2 border-gold shadow-gold mx-auto mb-3 overflow-hidden">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
            Customer Portal
          </span>
          <h1 className="font-serif text-2xl font-bold text-white mt-1">Welcome Back</h1>
          <p className="text-xs text-zinc-400 mt-1">Sign in to track orders and manage your profile</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2.5 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          {/* Password with Show/Hide feature */}
          <PasswordInput
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full py-3 font-bold"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          {/* Demo account helper */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-center">
            <p className="text-[11px] text-zinc-500">
              Demo Customer: <span className="font-mono text-royal-black font-semibold">customer@example.com</span> / <span className="font-mono text-royal-black font-semibold">customer123</span>
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-600">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="font-bold text-gold-deep hover:underline inline-flex items-center gap-1"
              >
                <span>Register here</span>
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
