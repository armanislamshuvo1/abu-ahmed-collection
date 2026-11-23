import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Truck, ArrowRight, Copy, Check, AlertCircle, Send, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { submitOrderTransactionId } from '../services/orderService';
import { useToast } from '../context/ToastContext';

export const OrderSuccess = ({ onNavigate, queryParams = {} }) => {
  const { addToast } = useToast();
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [trxInput, setTrxInput] = useState('');
  const [isSubmittingTrx, setIsSubmittingTrx] = useState(false);

  useEffect(() => {
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

  const isPendingPayment = order && order.paymentMethod?.code !== 'cod' && (!order.paymentMethod?.transactionId || order.status === 'Pending Payment');
  const isVerifyingPayment = order && order.status === 'Verifying Payment';

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrxSubmit = async (e) => {
    e.preventDefault();
    if (!trxInput.trim()) {
      addToast('অনুগ্রহ করে ট্রানজেকশন আইডি (TrxID) লিখুন।', 'error');
      return;
    }

    setIsSubmittingTrx(true);
    try {
      const res = await submitOrderTransactionId(orderId, trxInput.trim());
      addToast('পেমেন্ট ট্রানজেকশন আইডি জমা দেওয়া হয়েছে! পেমেন্ট যাচাই করা হচ্ছে।', 'success');

      // Update local state to Verifying Payment
      const updatedOrder = {
        ...order,
        status: 'Verifying Payment',
        paymentMethod: {
          ...order.paymentMethod,
          transactionId: trxInput.trim()
        }
      };
      const updatedData = { ...orderData, order: updatedOrder };
      setOrderData(updatedData);
      sessionStorage.setItem('last_order', JSON.stringify(updatedData));
      setTrxInput('');
    } catch (err) {
      addToast(err.message || 'ট্রানজেকশন আইডি জমা দিতে ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsSubmittingTrx(false);
    }
  };

  const statusBanglaMap = {
    'Pending': 'অপেক্ষমাণ',
    'Pending Payment': 'পেমেন্ট বাকি',
    'Verifying Payment': 'পেমেন্ট যাচাই চলছে',
    'Confirmed': 'নিশ্চিত',
    'Processing': 'প্রস্তুত হচ্ছে',
    'Shipped': 'কুরিয়ারে আছে',
    'Delivered': 'ডেলিভারি সম্পন্ন',
    'Cancelled': 'বাতিলকৃত'
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
            অর্ডার করার জন্য আন্তরিক ধন্যবাদ
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md mx-auto">
            {isPendingPayment
              ? 'অর্ডারের কাজ শুরু করার জন্য অনুগ্রহ করে নিচে পেমেন্ট ট্রানজেকশন আইডি জমা দিন।'
              : isVerifyingPayment
              ? 'আপনার পেমেন্ট ট্রানজেকশন আইডি পাওয়া গেছে এবং তা বর্তমানে যাচাই করা হচ্ছে।'
              : 'আমাদের টিম শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে পার্সেল পাঠানোর ব্যবস্থা করবে।'}
          </p>
        </div>

        {/* Order ID Box */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 max-w-md mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                আপনার অর্ডার ট্র্যাকিং আইডি
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-royal-black">
                {orderId}
              </span>
            </div>
            <button
              onClick={copyOrderId}
              className="p-2 rounded-lg bg-white border border-zinc-200 hover:border-gold text-zinc-600 hover:text-royal-black transition-colors"
              title="অর্ডার আইডি কপি করুন"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Pending Payment Action Box (If user hasn't entered TrxID yet) */}
          {isPendingPayment && (
            <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 max-w-md mx-auto text-left space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>জরুরি: পেমেন্ট সম্পন্ন করে TrxID জমা দিন</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                আপনার অর্ডারটি <span className="font-bold underline">পেমেন্ট অপেক্ষমাণ</span> অবস্থায় আছে। {order?.paymentMethod?.name || 'মোবাইল ব্যাংকিং'}-এর মাধ্যমে পেমেন্ট সম্পন্ন করে ট্রানজেকশন আইডি (TrxID) নিচে জমা দিন:
              </p>

              <form onSubmit={handleTrxSubmit} className="space-y-3 pt-1">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 9G7K21LM88"
                    value={trxInput}
                    onChange={e => setTrxInput(e.target.value)}
                    className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm text-royal-black uppercase placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 font-mono"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSubmittingTrx}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>পেমেন্ট TrxID জমা দিন</span>
                </Button>
              </form>
            </div>
          )}

          {/* Verifying Payment Notice (If TrxID is submitted and pending admin review) */}
          {isVerifyingPayment && (
            <div className="bg-cyan-50/80 border-2 border-cyan-300 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-cyan-900 font-bold text-sm">
                <Clock className="w-5 h-5 text-cyan-600 shrink-0" />
                <span>পেমেন্ট যাচাই করা হচ্ছে</span>
              </div>
              <p className="text-xs text-cyan-800 leading-relaxed">
                ধন্যবাদ! আমরা আপনার {order?.paymentMethod?.name} ট্রানজেকশন আইডি (<span className="font-mono font-bold">{order?.paymentMethod?.transactionId}</span>) পেয়েছি। আমাদের টিম যাচাই করে দ্রুত পার্সেল ডেলিভারি করবে।
              </p>
            </div>
          )}

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
                <span>হোয়াটসঅ্যাপে নিশ্চিত করুন</span>
              </a>
            )}

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => onNavigate(`/track-order?id=${orderId}`)}
            >
              <Truck className="w-4 h-4 text-gold" />
              <span>লাইভ স্ট্যাটাস ট্র্যাক করুন</span>
            </Button>
          </div>

          {/* Order Details Breakdown if available */}
          {order && (
            <div className="text-left pt-6 border-t border-zinc-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-royal-black">অর্ডার বিবরণী</h3>
                <Badge variant={order.status.toLowerCase()}>{statusBanglaMap[order.status] || order.status}</Badge>
              </div>

              <div className="divide-y divide-zinc-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded bg-zinc-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-royal-black">{item.name}</p>
                        <p className="text-zinc-500">পরিমাণ: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-royal-black">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 text-xs space-y-1.5 text-zinc-600">
                <div className="flex justify-between">
                  <span>গ্রাহক:</span>
                  <span className="font-semibold text-royal-black">{order.customer.name} ({order.customer.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি ঠিকানা:</span>
                  <span className="font-semibold text-royal-black text-right max-w-xs">{order.customer.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>পেমেন্ট পদ্ধতি:</span>
                  <span className="font-semibold text-royal-black">
                    {order.paymentMethod.name}
                    {order.paymentMethod.transactionId ? ` (TrxID: ${order.paymentMethod.transactionId})` : ''}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-bold text-royal-black">
                  <span>সর্বমোট প্রদেয় বিল:</span>
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
              <span>আরও শপিং করুন</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
