import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Phone, Mail, Clock, Truck, ChevronRight, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getCustomerOrders, updateCustomerProfile } from '../services/authService';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const statusBanglaMap = {
  'Pending': 'অপেক্ষমাণ',
  'Processing': 'প্রস্তুত হচ্ছে',
  'Shipped': 'কুরিয়ারে আছে',
  'Delivered': 'ডেলিভারি সম্পন্ন',
  'Cancelled': 'বাতিল',
  'Pending Payment': 'পেমেন্ট বাকি',
  'Verifying Payment': 'পেমেন্ট যাচাই চলছে'
};

export const Profile = ({ onNavigate }) => {
  const { user, customerLogout, setUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'settings'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Dhaka');
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      onNavigate('/login');
      return;
    }

    setName(user.name);
    setPhone(user.phone);
    setAddress(user.address || '');
    setCity(user.city || 'Dhaka');

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const data = await getCustomerOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user, onNavigate]);

  if (!user) return null;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updateData = { name, phone, address, city };
      if (newPassword.trim()) {
        if (newPassword.length < 6) {
          addToast('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', 'error');
          setUpdating(false);
          return;
        }
        updateData.password = newPassword;
      }
      const updatedUser = await updateCustomerProfile(updateData);
      setUser(updatedUser);
      setNewPassword('');
      addToast('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!', 'success');
    } catch (err) {
      addToast(err.message || 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* User Header Ribbon */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-royal-black text-gold flex items-center justify-center font-bold text-2xl border-2 border-gold shadow-gold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gold-deep font-bold">
              গ্রাহক অ্যাকাউন্ট
            </span>
            <h1 className="font-serif text-2xl font-bold text-royal-black">{user.name}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={customerLogout}
          className="self-start sm:self-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>লগআউট</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-semibold text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'orders' ? 'text-royal-black' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Package className="w-4 h-4 text-gold" />
          <span>আমার অর্ডারসমূহ ({orders.length})</span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 font-semibold text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'settings' ? 'text-royal-black' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <User className="w-4 h-4 text-gold" />
          <span>প্রোফাইল ও ঠিকানা সেটিংস</span>
          {activeTab === 'settings' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />
          )}
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-zinc-200 animate-pulse h-32" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200">
              <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-royal-black">এখনও কোনো অর্ডার নেই</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                আপনি এখনও কোনো অর্ডার করেননি। আমাদের ঐতিহ্যবাহী তাঁতের শাড়ি কালেকশন ঘুরে দেখুন এবং আপনার প্রথম অর্ডারটি করুন!
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-5"
                onClick={() => onNavigate('/shop')}
              >
                শাড়ির কালেকশন দেখুন
              </Button>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order._id || order.orderId}
                className="bg-white rounded-2xl border border-zinc-200 shadow-soft p-5 sm:p-6 space-y-4 hover:border-gold/40 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm sm:text-base font-bold text-royal-black">
                      #{order.orderId}
                    </span>
                    <Badge
                      variant={
                        order.status === 'Delivered'
                          ? 'delivered'
                          : order.status === 'Cancelled'
                          ? 'cancelled'
                          : order.status === 'Shipped'
                          ? 'shipped'
                          : order.status === 'Processing'
                          ? 'processing'
                          : 'pending'
                      }
                    >
                      {statusBanglaMap[order.status] || order.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => onNavigate(`/track-order?id=${order.orderId}`)}
                      className="inline-flex items-center gap-1 font-bold text-gold-deep hover:underline"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>ট্র্যাক অর্ডার</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Items row */}
                <div className="divide-y divide-zinc-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-royal-black text-sm">{item.name}</p>
                          <p className="text-zinc-500">পরিমাণ: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="font-bold text-royal-black">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Footer row */}
                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-600">
                  <p>
                    <strong className="text-royal-black">ডেলিভারি ঠিকানা:</strong> {order.customer.address} ({order.customer.deliveryZoneName})
                  </p>
                  <p className="text-sm font-bold text-royal-black">
                    মোট: <span className="text-gold-deep text-base">৳{order.total.toLocaleString()}</span> ({order.paymentMethod?.name})
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Profile Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-soft">
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <h3 className="font-serif text-lg font-bold text-royal-black">প্রোফাইল তথ্য আপডেট করুন</h3>
              <p className="text-xs text-zinc-500 mt-0.5">আপনার ডেলিভারি ঠিকানা এবং অ্যাকাউন্টের তথ্য পরিবর্তন করুন।</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80 mb-1">
                পূর্ণ নাম
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80 mb-1">
                ইমেইল ঠিকানা (পরিবর্তনযোগ্য নয়)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80 mb-1">
                মোবাইল নম্বর
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-royal-black/80 mb-1">
                স্থায়ী ডেলিভারি ঠিকানা
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="বাসা/হোল্ডিং নম্বর, রোড, এলাকা, থানা"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
              />
            </div>

            {/* Password show/hide input for updates */}
            <div className="pt-2 border-t border-zinc-100">
              <PasswordInput
                label="পাসওয়ার্ড পরিবর্তন (পরিবর্তন না করতে চাইলে খালি রাখুন)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড লিখুন (ঐচ্ছিক)"
                required={false}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={updating}
              className="w-full py-3 font-bold"
            >
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
