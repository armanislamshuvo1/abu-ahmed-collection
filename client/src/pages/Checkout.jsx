import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, Sparkles, Check, MapPin, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/orderService';
import { PaymentMethodSelector } from '../components/cart/PaymentMethodSelector';
import { Button } from '../components/ui/Button';
import {
  BANGLADESH_LOCATIONS,
  DIVISIONS,
  determineDeliveryZoneKey
} from '../data/bangladeshLocations';

export const Checkout = ({ onNavigate }) => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, settings } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Cascading Address Fields: Division > District > Thana > Street Address
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  const [deliveryZoneKey, setDeliveryZoneKey] = useState('inside_dhaka');
  const [notes, setNotes] = useState('');

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available districts based on division
  const availableDistricts = division && BANGLADESH_LOCATIONS[division]
    ? Object.keys(BANGLADESH_LOCATIONS[division].districts)
    : [];

  // Available thanas based on division and district
  const availableThanas = division && district && BANGLADESH_LOCATIONS[division]?.districts[district]
    ? BANGLADESH_LOCATIONS[division].districts[district].thanas
    : [];

  // Auto-detect and set delivery zone whenever division, district, or thana changes
  useEffect(() => {
    const detectedKey = determineDeliveryZoneKey(division, district, thana, settings?.districtOverrides);
    setDeliveryZoneKey(detectedKey);
  }, [division, district, thana, settings?.districtOverrides]);

  // Handle Division Change
  const handleDivisionChange = (newDivision) => {
    setDivision(newDivision);
    const districts = Object.keys(BANGLADESH_LOCATIONS[newDivision]?.districts || {});
    const firstDistrict = districts[0] || '';
    setDistrict(firstDistrict);
    setThana('');
  };

  // Handle District Change
  const handleDistrictChange = (newDistrict) => {
    setDistrict(newDistrict);
    setThana('');
  };

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.address) setStreetAddress(user.address);
    }
  }, [user]);

  useEffect(() => {
    if (settings?.paymentMethods && settings.paymentMethods.length > 0 && !selectedMethod) {
      const codMethod = settings.paymentMethods.find(m => m.code === 'cod') || settings.paymentMethods[0];
      setSelectedMethod(codMethod);
    }
  }, [settings, selectedMethod]);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-royal-black">আপনার শপিং ব্যাগ খালি</h2>
        <p className="text-sm text-zinc-500 mt-2">চেকআউটে যাওয়ার আগে আপনার পছন্দের শাড়ি ব্যাগে যোগ করুন।</p>
        <Button variant="primary" className="mt-6" onClick={() => onNavigate('/shop')}>
          শাড়ির কালেকশন দেখুন
        </Button>
      </div>
    );
  }

  const override = settings?.districtOverrides?.find(
    d => (d.isActive ?? true) && d.district.toLowerCase() === (district || '').toLowerCase()
  );

  const zones = settings?.deliveryZones || [
    { key: 'inside_dhaka', name: 'Inside Dhaka', fee: 80, estimatedDays: '1-2 Days' },
    { key: 'outside_dhaka', name: 'Outside Dhaka', fee: 150, estimatedDays: '3-5 Days' }
  ];
  const activeZone = override
    ? {
        key: `district_${override.district.toLowerCase().replace(/\s+/g, '_')}`,
        name: `${override.district} District`,
        fee: override.fee,
        estimatedDays: override.estimatedDays || '2-3 Days'
      }
    : (zones.find(z => z.key === deliveryZoneKey) || zones[0]);
  const freeThreshold = settings?.freeShippingThreshold || 5000;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : (activeZone?.fee ?? 80);
  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      addToast('গ্রাহকের নাম, ইমেইল এবং মোবাইল নম্বর আবশ্যক।', 'error');
      return;
    }

    if (!division || !district || !thana || !streetAddress.trim()) {
      addToast('অনুগ্রহ করে বিভাগ, জেলা, থানা নির্বাচন করুন এবং সঠিক ঠিকানা লিখুন।', 'error');
      return;
    }

    const fullAddress = `${streetAddress.trim()}, ${thana}, ${district}, ${division}`;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          address: fullAddress,
          division,
          district,
          thana,
          deliveryZoneKey: activeZone.key,
          deliveryZoneName: activeZone.name,
          notes: notes.trim()
        },
        items: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        paymentMethod: {
          code: selectedMethod?.code || 'cod',
          name: selectedMethod?.name || 'Cash on Delivery',
          transactionId: transactionId.trim()
        }
      };

      const result = await createOrder(orderPayload);
      clearCart();
      sessionStorage.setItem('last_order', JSON.stringify(result));
      onNavigate(`/order-success?orderId=${result.order.orderId}`);
    } catch (err) {
      addToast(err.message || 'চেকআউট সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <button
        onClick={() => onNavigate('/shop')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-royal-black mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>শপিং চালিয়ে যান</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Checkout Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCheckoutSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-soft">
            <div>
              <h1 className="font-serif text-2xl font-bold text-royal-black">ডেলিভারি ও পেমেন্ট তথ্য</h1>
              <p className="text-xs text-zinc-500 mt-1">
                দ্রুত কুরিয়ার ডেলিভারির জন্য অনুগ্রহ করে সঠিক যোগাযোগের নম্বর ও ঠিকানা প্রদান করুন।
              </p>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-royal-black border-b border-zinc-200 pb-2">
                ১. কাস্টমার ও ডেলিভারি ঠিকানা
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    পুরো নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ফারহানা ইয়াসমিন"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    মোবাইল নম্বর (ডেলিভারির সময় কল করার জন্য) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                  ইমেইল ঠিকানা (অর্ডার ট্র্যাকিং ও আপডেটের জন্য) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Cascading Location Dropdowns: Division > District > Thana */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    বিভাগ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={division}
                    onChange={e => handleDivisionChange(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {DIVISIONS.map(div => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    জেলা <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={e => handleDistrictChange(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {availableDistricts.map(dst => (
                      <option key={dst} value={dst}>{dst}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    থানা / উপজেলা <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={thana}
                    onChange={e => setThana(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="">থানা / উপজেলা নির্বাচন করুন</option>
                    {availableThanas.map(th => (
                      <option key={th} value={th}>{th}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                  বিস্তারিত ঠিকানা (রোড / বাড়ি / এলাকা) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="বাড়ি নম্বর, রোড নম্বর, এলাকা বা চেনার উপায়"
                  value={streetAddress}
                  onChange={e => setStreetAddress(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                />
              </div>

              {/* Delivery Zone (LOCKED & AUTO-CALCULATED — User cannot tamper) */}
              <div>
                <label className="block text-xs font-semibold text-royal-black/80 mb-1.5">
                  ডেলিভারি চার্জ <span className="text-emerald-700 font-normal">(ঠিকানা অনুযায়ী স্বয়ংক্রিয়ভাবে নির্ধারিত)</span>
                </label>
                <div className="p-3.5 rounded-xl border border-gold/40 bg-gold/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gold/15 text-gold-deep flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs sm:text-sm font-bold text-royal-black">{activeZone.name}</p>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          স্বয়ংক্রিয় চার্জ
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        সম্ভাব্য ডেলিভারি: {activeZone.estimatedDays || (deliveryZoneKey === 'inside_dhaka' ? '১-২ দিন' : '৩-৫ দিন')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-gold-deep">
                      {isFreeDelivery ? (
                        <span className="text-emerald-600 font-bold">ফ্রি</span>
                      ) : (
                        `৳${deliveryFee}`
                      )}
                    </span>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-0.5 justify-end mt-0.5">
                      <Lock className="w-3 h-3 text-zinc-400" />
                      <span>ঠিকানা অনুযায়ী নির্ধারিত</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                  বিশেষ ডেলিভারি নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: বিকেল ৩টার পর ডেলিভারি দিন অথবা বিকল্প নম্বরে কল করুন"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            {/* Dynamic Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-royal-black border-b border-zinc-200 pb-2">
                ২. পেমেন্ট পদ্ধতি
              </h3>
              <PaymentMethodSelector
                paymentMethods={settings?.paymentMethods || []}
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
                transactionId={transactionId}
                onChangeTransactionId={setTransactionId}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full text-base py-4 font-bold"
            >
              <span>অর্ডার কনফার্ম করুন (৳{total.toLocaleString()})</span>
            </Button>
          </form>
        </div>

        {/* Right Order Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-soft space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-royal-black border-b border-zinc-100 pb-3">
              অর্ডার সামারি ({cartItems.length}টি শাড়ি)
            </h3>

            {/* Items list */}
            <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item.product} className="py-3 flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-royal-black truncate">{item.name}</h4>
                    <p className="text-[11px] text-zinc-500">পরিমাণ: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-bold text-royal-black">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-2 border-t border-zinc-200 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>সাবটোটাল:</span>
                <span className="font-semibold text-royal-black">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ ({activeZone.name}):</span>
                <span className="font-semibold text-royal-black">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">ফ্রি</span> : `৳${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-royal-black pt-3 border-t border-zinc-200">
                <span>সর্বমোট প্রদেয় বিল:</span>
                <span className="text-lg text-gold-deep">৳{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
              <div className="flex items-center gap-2 text-royal-black font-semibold">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>ক্রেতা সুরক্ষা ও খাঁটি তাঁতের নিশ্চয়তা</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                ডেলিভারিম্যানের সামনে পার্সেল দেখে নিন। কোনো সমস্যা পরিলক্ষিত হলে আমাদের ৩ দিনের সহজ এক্সচেঞ্জ সুবিধা প্রযোজ্য।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
