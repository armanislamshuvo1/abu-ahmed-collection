import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';

export const Register = ({ onNavigate }) => {
  const { customerRegister } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      addToast('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', 'error');
      return;
    }

    setLoading(true);
    try {
      await customerRegister({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password,
        address: address.trim(),
        city: city.trim()
      });
      onNavigate('/profile');
    } catch (err) {
      addToast(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-royal-black text-white p-8 text-center border-b border-gold/30">
          <div className="w-14 h-14 rounded-full bg-black border-2 border-gold shadow-gold mx-auto mb-3 overflow-hidden">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
            আবু আহমেদ মেম্বার
          </span>
          <h1 className="font-serif text-2xl font-bold text-white mt-1">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="text-xs text-zinc-400 mt-1">দ্রুত চেকআউট ও অর্ডার হিস্ট্রির জন্য রেজিস্টার করুন</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80 mb-1">
              পুরো নাম <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="যেমন: ফারহানা ইয়াসমিন"
                value={name}
                onChange={e => setName(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80 mb-1">
              ইমেইল ঠিকানা <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80 mb-1">
              মোবাইল নম্বর <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          {/* Password with Show/Hide feature */}
          <PasswordInput
            label="পাসওয়ার্ড"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="কমপক্ষে ৬ অক্ষর"
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80 mb-1">
              ডেলিভারি ঠিকানা (ঐচ্ছিক)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="বাড়ি নং, রোড নং, এলাকা, থানা"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full py-3 font-bold mt-2"
          >
            <span>অ্যাকাউন্ট তৈরি করুন</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <div className="pt-4 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-600">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="font-bold text-gold-deep hover:underline"
              >
                সাইন ইন করুন
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
