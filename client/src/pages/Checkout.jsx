import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/orderService';
import { PaymentMethodSelector } from '../components/cart/PaymentMethodSelector';
import { Button } from '../components/ui/Button';

export const Checkout = ({ onNavigate }) => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, settings } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZoneKey, setDeliveryZoneKey] = useState('inside_dhaka');
  const [notes, setNotes] = useState('');

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.address) setAddress(user.address);
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
        <h2 className="font-serif text-2xl font-bold text-royal-black">Your Shopping Bag is Empty</h2>
        <p className="text-sm text-zinc-500 mt-2">Add some exquisite sarees before proceeding to checkout.</p>
        <Button variant="primary" className="mt-6" onClick={() => onNavigate('/shop')}>
          Browse Saree Catalog
        </Button>
      </div>
    );
  }

  const zones = settings?.deliveryZones || [
    { key: 'inside_dhaka', name: 'Inside Dhaka', fee: 80, estimatedDays: '1-2 Days' },
    { key: 'outside_dhaka', name: 'Outside Dhaka', fee: 150, estimatedDays: '3-5 Days' }
  ];
  const activeZone = zones.find(z => z.key === deliveryZoneKey) || zones[0];
  const freeThreshold = settings?.freeShippingThreshold || 5000;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : (activeZone?.fee || 80);
  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      addToast('Customer Name, Email, Phone Number, and Address are required.', 'error');
      return;
    }

    if (selectedMethod?.requiresTransactionId && !transactionId.trim()) {
      addToast(`Please enter the ${selectedMethod.name} Transaction ID (TrxID).`, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          address: address.trim(),
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
      addToast(err.message || 'Failed to complete checkout. Please try again.', 'error');
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
        <span>Continue Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Checkout Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCheckoutSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-soft">
            <div>
              <h1 className="font-serif text-2xl font-bold text-royal-black">Shipping & Payment</h1>
              <p className="text-xs text-zinc-500 mt-1">
                Please enter your accurate contact and delivery address for speedy courier dispatch.
              </p>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-royal-black border-b border-zinc-200 pb-2">
                1. Customer & Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhana Yasmin"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    Phone Number (Active for Delivery Call) <span className="text-red-500">*</span>
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
                  Email Address (Required for Order Tracking & Status Updates) <span className="text-red-500">*</span>
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

              <div>
                <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                  Complete Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House number, Road number, Area, Thana / District"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                />
              </div>

              {/* Delivery Zone Selection */}
              <div>
                <label className="block text-xs font-semibold text-royal-black/80 mb-1.5">
                  Select Delivery Zone <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {zones.map(z => {
                    const isSelected = deliveryZoneKey === z.key;
                    return (
                      <div
                        key={z.key}
                        onClick={() => setDeliveryZoneKey(z.key)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-gold bg-gold/5 shadow-sm'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-royal-black">{z.name}</p>
                          <p className="text-[11px] text-zinc-500">Est. delivery: {z.estimatedDays}</p>
                        </div>
                        <span className="text-xs font-bold text-gold-deep">
                          {isFreeDelivery ? 'FREE' : `৳${z.fee}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please deliver after 3 PM or call alternate number"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            {/* Dynamic Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-royal-black border-b border-zinc-200 pb-2">
                2. Payment Method
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
              <span>Place Order (৳{total.toLocaleString()})</span>
            </Button>
          </form>
        </div>

        {/* Right Order Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-soft space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-royal-black border-b border-zinc-100 pb-3">
              Order Summary ({cartItems.length} Saree{cartItems.length > 1 ? 's' : ''})
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
                    <p className="text-[11px] text-zinc-500">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
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
                <span>Subtotal:</span>
                <span className="font-semibold text-royal-black">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge ({activeZone.name}):</span>
                <span className="font-semibold text-royal-black">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `৳${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-royal-black pt-3 border-t border-zinc-200">
                <span>Total Amount:</span>
                <span className="text-lg text-gold-deep">৳{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
              <div className="flex items-center gap-2 text-royal-black font-semibold">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>Buyer Protection & Authentic Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Check parcel contents upon delivery. If any discrepancy, our 3-day exchange warranty applies nationwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
