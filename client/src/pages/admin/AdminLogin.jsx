import React, { useState } from 'react';
import { Crown, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';

export const AdminLogin = ({ onNavigate }) => {
  const { adminLogin } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('admin@abuahmedcollection.com');
  const [password, setPassword] = useState('admin12345');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin({ email, password });
      onNavigate('/admin');
    } catch (err) {
      addToast(err.message || 'Invalid admin credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-royal-black text-white p-8 text-center border-b border-gold/30">
          <div className="w-16 h-16 rounded-full bg-black border-2 border-gold shadow-gold mx-auto mb-3 overflow-hidden flex items-center justify-center">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Store Management
          </span>
          <h1 className="font-serif text-2xl font-bold text-white mt-1">Admin Portal</h1>
          <p className="text-xs text-zinc-400 mt-1">Secure access to products, orders & settings</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@abuahmedcollection.com"
                className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2.5 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          {/* Password with Show/Hide feature */}
          <PasswordInput
            label="Admin Password"
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
            className="w-full py-3 font-bold mt-2"
          >
            <Crown className="w-4 h-4 text-royal-black mr-1" />
            <span>Sign In to Admin Panel</span>
          </Button>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-center">
            <p className="text-[11px] text-zinc-500">
              Default Credentials: <br />
              <span className="font-mono text-royal-black font-semibold">admin@abuahmedcollection.com</span> / <span className="font-mono text-royal-black font-semibold">admin12345</span>
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-xs text-zinc-500 hover:text-royal-black underline"
            >
              Return to Customer Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
