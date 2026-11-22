import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Truck, ArrowRight, Copy, Check, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const OrderSuccess = ({ onNavigate, queryParams = {} }) => {
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5E6BE', '#800020', '#10B981']
      });
    } catch (e) {
      // Ignore if canvas-confetti fails
    }

    try {
      const saved = sessionStorage.getItem('last_order');
      if (saved) {
        setOrderData(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const order = orderData?.order;
  const orderId = queryParams.orderId || order?.orderId || 'AAC-2026-ORDER';

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden text-center">
        {/* Header Ribbon */}
        <div className="bg-royal-black text-white py-10 px-6 border-b border-gold/30">
          <div className="w-16 h-16 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-4 border-2 border-gold shadow-gold">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            Thank you for your order
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            Order Successfully Placed!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md mx-auto">
            Our team will contact you shortly to confirm your dispatch.
          </p>
        </div>

        {/* Order ID Box */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 max-w-md mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                Your Unique Tracking ID
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-royal-black">
                {orderId}
              </span>
            </div>
            <button
              onClick={copyOrderId}
              className="p-2 rounded-lg bg-white border border-zinc-200 hover:border-gold text-zinc-600 hover:text-royal-black transition-colors"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Actions: WhatsApp Confirmation + Track Order */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            {orderData?.ownerWhatsAppUrl && (
              <a
                href={orderData.ownerWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>
            )}

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => onNavigate(`/track-order?id=${orderId}`)}
            >
              <Truck className="w-4 h-4 text-gold" />
              <span>Track Live Status</span>
            </Button>
          </div>

          {/* Order Details Breakdown if available */}
          {order && (
            <div className="text-left pt-6 border-t border-zinc-200 space-y-4">
              <h3 className="font-serif text-base font-bold text-royal-black">Order Summary</h3>

              <div className="divide-y divide-zinc-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded bg-zinc-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-royal-black">{item.name}</p>
                        <p className="text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-royal-black">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 text-xs space-y-1.5 text-zinc-600">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-semibold text-royal-black">{order.customer.name} ({order.customer.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span className="font-semibold text-royal-black text-right max-w-xs">{order.customer.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-royal-black">{order.paymentMethod.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-bold text-royal-black">
                  <span>Total Payable:</span>
                  <span className="text-gold-deep">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/shop')}
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
