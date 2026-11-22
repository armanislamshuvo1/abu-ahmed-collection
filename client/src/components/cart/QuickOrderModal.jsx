import React, { useState, useEffect } from 'react';
import { Zap, Truck, Check, Sparkles, MapPin, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createOrder } from '../../services/orderService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import {
  BANGLADESH_LOCATIONS,
  DIVISIONS,
  determineDeliveryZoneKey
} from '../../data/bangladeshLocations';

export const QuickOrderModal = ({ onNavigate }) => {
  const { quickOrderProduct, setQuickOrderProduct } = useCart();
  const { user, settings } = useAuth();
  const { addToast } = useToast();

  const [quantity, setQuantity] = useState(1);
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

  // Auto-detect and set delivery zone whenever division, district, or thana changes (LOCKED)
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

  // Auto-fill logged-in customer info if available
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.address) setStreetAddress(user.address);
    }
  }, [user]);

  // Set default payment method when settings load
  useEffect(() => {
    if (settings?.paymentMethods && settings.paymentMethods.length > 0 && !selectedMethod) {
      const codMethod = settings.paymentMethods.find(m => m.code === 'cod') || settings.paymentMethods[0];
      setSelectedMethod(codMethod);
    }
  }, [settings, selectedMethod]);

  if (!quickOrderProduct) return null;

  const activePrice = (quickOrderProduct.discountPrice !== null && quickOrderProduct.discountPrice !== undefined && quickOrderProduct.discountPrice > 0)
    ? quickOrderProduct.discountPrice
    : quickOrderProduct.regularPrice;

  const subtotal = activePrice * quantity;

  // Find delivery fee from settings
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
  const deliveryFee = subtotal >= freeThreshold ? 0 : (activeZone?.fee ?? 80);
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      addToast('Please fill in your Name, Email, and Phone number.', 'error');
      return;
    }

    if (!division || !district || !thana || !streetAddress.trim()) {
      addToast('Please select Division, District, Thana and enter your street address.', 'error');
      return;
    }

    // Build unified full address string
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
        items: [
          {
            product: quickOrderProduct._id,
            name: quickOrderProduct.name,
            price: activePrice,
            quantity,
            image: (quickOrderProduct.images && quickOrderProduct.images[0]) || '/logo.jpg'
          }
        ],
        paymentMethod: {
          code: selectedMethod?.code || 'cod',
          name: selectedMethod?.name || 'Cash on Delivery',
          transactionId: transactionId.trim()
        }
      };

      const result = await createOrder(orderPayload);
      addToast(`Order placed successfully! Order ID: ${result.order.orderId}`, 'success');
      setQuickOrderProduct(null);

      // Save order info into sessionStorage for the OrderSuccess page
      sessionStorage.setItem('last_order', JSON.stringify(result));
      onNavigate(`/order-success?orderId=${result.order.orderId}`);
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={!!quickOrderProduct}
      onClose={() => setQuickOrderProduct(null)}
      title="⚡ 1-Click Fast Checkout"
      subtitle="Complete your order in 30 seconds with Cash on Delivery or bKash"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Saree Summary Box */}
        <div className="flex gap-4 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-300">
            <img
              src={(quickOrderProduct.images && quickOrderProduct.images[0]) || '/logo.jpg'}
              alt={quickOrderProduct.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = '/logo.jpg'; }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-sm font-semibold text-royal-black line-clamp-1">
              {quickOrderProduct.name}
            </h4>
            <p className="text-xs text-zinc-500">{quickOrderProduct.fabric}</p>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold text-royal-black">৳{activePrice.toLocaleString()} each</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 font-medium">Qty:</span>
                <select
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs font-semibold"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details Form */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-royal-black border-b pb-1.5 border-zinc-200">
            Delivery & Contact Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Farhana Yasmin"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-royal-black/80 mb-1">
              Email Address (For Order Tracking & Invoice) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Cascading Location Dropdowns: Division > District > Thana */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                Division <span className="text-red-500">*</span>
              </label>
              <select
                value={division}
                onChange={e => handleDivisionChange(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                {DIVISIONS.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={e => handleDistrictChange(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                {availableDistricts.map(dst => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                Thana / Upazila <span className="text-red-500">*</span>
              </label>
              <select
                value={thana}
                onChange={e => setThana(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="">Select Thana / Upazila</option>
                {availableThanas.map(th => (
                  <option key={th} value={th}>{th}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-royal-black/80 mb-1">
              Street / House / Area Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="House, Road, Area, Landmark"
              value={streetAddress}
              onChange={e => setStreetAddress(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
            />
          </div>

          {/* Delivery Zone (LOCKED & AUTO-CALCULATED — User cannot tamper) */}
          <div>
            <label className="block text-xs font-semibold text-royal-black/80 mb-1.5">
              Delivery Charge <span className="text-emerald-700 font-normal">(Auto-calculated from your address)</span>
            </label>
            <div className="p-3.5 rounded-xl border border-gold/40 bg-gold/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/15 text-gold-deep flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-royal-black">{activeZone.name}</p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Auto-Assigned
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Est. delivery: {activeZone.estimatedDays || (deliveryZoneKey === 'inside_dhaka' ? '1-2 Days' : '3-5 Days')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-gold-deep">
                  {subtotal >= freeThreshold ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `৳${deliveryFee}`
                  )}
                </span>
                <p className="text-[10px] text-zinc-400 flex items-center gap-0.5 justify-end mt-0.5">
                  <Lock className="w-3 h-3 text-zinc-400" />
                  <span>Fixed by address</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Payment Method Selector */}
        <PaymentMethodSelector
          paymentMethods={settings?.paymentMethods || []}
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
          transactionId={transactionId}
          onChangeTransactionId={setTransactionId}
        />

        {/* Price Breakdown */}
        <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200 space-y-1.5 text-xs text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''}):</span>
            <span className="font-semibold text-royal-black">৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee ({activeZone.name}):</span>
            <span className="font-semibold text-royal-black">
              {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `৳${deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-royal-black pt-2 border-t border-zinc-200">
            <span>Total Payable:</span>
            <span className="text-base text-gold-deep">৳{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit Button (no payment type mentioned) */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full text-base"
        >
          <span>Confirm Order (৳{total.toLocaleString()})</span>
        </Button>
      </form>
    </Modal>
  );
};
