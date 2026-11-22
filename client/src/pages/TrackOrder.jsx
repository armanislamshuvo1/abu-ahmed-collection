import React, { useState, useEffect } from 'react';
import { Search, Truck, Clock, CheckCircle2, AlertCircle, Package, ArrowRight, MessageCircle, Send } from 'lucide-react';
import { trackOrder, submitOrderTransactionId } from '../services/orderService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';

export const TrackOrder = ({ onNavigate, queryParams = {} }) => {
  const { addToast } = useToast();
  const [orderIdInput, setOrderIdInput] = useState(queryParams.id || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trxInput, setTrxInput] = useState('');
  const [isSubmittingTrx, setIsSubmittingTrx] = useState(false);

  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const handleTrackSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!orderIdInput.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await trackOrder(orderIdInput.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message || 'No order found with this ID. Please double check and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParams.id) {
      setOrderIdInput(queryParams.id);
      handleTrackSubmit();
    }
  }, [queryParams.id]);

  const getStepIndex = (status) => {
    if (status === 'Cancelled') return -1;
    if (status === 'Pending Payment' || status === 'Verifying Payment') return 0;
    return steps.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  const isPendingPayment = order && order.paymentMethod?.code !== 'cod' && (!order.paymentMethod?.transactionId || order.status === 'Pending Payment');
  const isVerifyingPayment = order && order.status === 'Verifying Payment';

  const handleTrxSubmit = async (e) => {
    e.preventDefault();
    if (!trxInput.trim()) {
      addToast('Please enter your Transaction ID (TrxID).', 'error');
      return;
    }

    setIsSubmittingTrx(true);
    try {
      await submitOrderTransactionId(order.orderId, trxInput.trim());
      addToast('Payment Transaction ID submitted! Payment is now verifying.', 'success');
      // Refresh order details
      const refreshed = await trackOrder(order.orderId);
      setOrder(refreshed);
      setTrxInput('');
    } catch (err) {
      addToast(err.message || 'Failed to submit Transaction ID.', 'error');
    } finally {
      setIsSubmittingTrx(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold-deep flex items-center justify-center mx-auto mb-3">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-royal-black">
          Track Your Artisan Order
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-2">
          Enter your unique Order ID (e.g., <span className="font-mono text-royal-black font-semibold">AAC-2026-1001</span>) to see live status updates.
        </p>

        {/* Input box */}
        <form onSubmit={handleTrackSubmit} className="mt-6 flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            required
            placeholder="e.g. AAC-2026-1001"
            value={orderIdInput}
            onChange={e => setOrderIdInput(e.target.value)}
            className="flex-1 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm uppercase font-mono tracking-wider focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="px-6 shrink-0"
          >
            <span>Track</span>
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Results Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-lg overflow-hidden animate-in fade-in">
          {/* Status Ribbon */}
          <div className="bg-royal-black text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/30">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gold font-bold">
                Tracking Details
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                Order #{order.orderId}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div>
              <Badge variant={order.status.toLowerCase()}>{order.status}</Badge>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Pending Payment Form if awaiting TrxID */}
            {isPendingPayment && (
              <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 text-left space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Action Needed: Complete Payment & Submit TrxID</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your order is awaiting payment confirmation. If you have sent money via {order.paymentMethod?.name}, enter your Transaction ID (TrxID) below:
                </p>

                <form onSubmit={handleTrxSubmit} className="flex flex-col sm:flex-row gap-3 pt-1">
                  <input
                    type="text"
                    required
                    placeholder="Enter Transaction ID (e.g. 9G7K21LM88)"
                    value={trxInput}
                    onChange={e => setTrxInput(e.target.value)}
                    className="flex-1 rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm text-royal-black uppercase placeholder-zinc-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 font-mono"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={isSubmittingTrx}
                    className="flex items-center justify-center gap-2 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit TrxID</span>
                  </Button>
                </form>
              </div>
            )}

            {/* Verifying Payment Notice if TrxID is submitted */}
            {isVerifyingPayment && (
              <div className="bg-cyan-50/80 border-2 border-cyan-300 rounded-2xl p-5 text-left space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-cyan-900 font-bold text-sm">
                  <Clock className="w-5 h-5 text-cyan-600 shrink-0" />
                  <span>Payment Under Verification</span>
                </div>
                <p className="text-xs text-cyan-800 leading-relaxed">
                  We received your {order.paymentMethod?.name} TrxID: <span className="font-mono font-bold">{order.paymentMethod?.transactionId}</span>. Our team is verifying the payment and will confirm your order shortly.
                </p>
              </div>
            )}

            {/* Step Progress Timeline (if not Cancelled) */}
            {order.status !== 'Cancelled' ? (
              <div className="py-4">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-6 right-6 h-1 bg-zinc-200 -z-0">
                    <div
                      className="h-full bg-gold transition-all duration-500"
                      style={{
                        width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%`
                      }}
                    />
                  </div>

                  {/* Steps circles */}
                  <div className="relative flex justify-between z-10">
                    {steps.map((st, idx) => {
                      const isCompleted = idx <= currentStepIdx && order.status !== 'Pending Payment' && order.status !== 'Verifying Payment';
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={st} className="flex flex-col items-center text-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? 'bg-royal-black text-gold border-2 border-gold shadow-gold'
                                : 'bg-zinc-100 text-zinc-400 border-2 border-zinc-200'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5 text-gold" /> : idx + 1}
                          </div>
                          <span
                            className={`mt-2 text-[11px] sm:text-xs font-semibold ${
                              isCurrent ? 'text-royal-black font-bold' : isCompleted ? 'text-zinc-700' : 'text-zinc-400'
                            }`}
                          >
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                This order was cancelled. If you believe this was in error, please reach out via our WhatsApp helpline below.
              </div>
            )}

            {/* Timeline Notes */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-royal-black">
                  Activity Timeline
                </h4>
                <div className="space-y-2">
                  {order.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                      <div className="flex-1">
                        <span className="font-semibold text-royal-black">{item.status}:</span>{' '}
                        <span className="text-zinc-600">{item.note}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery & Items Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
              {/* Delivery Details */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-royal-black">
                  Delivery Information
                </h4>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-1 text-zinc-600">
                  <p><strong className="text-royal-black">Recipient:</strong> {order.customer.name}</p>
                  <p><strong className="text-royal-black">Contact:</strong> {order.customer.phone}</p>
                  <p><strong className="text-royal-black">Address:</strong> {order.customer.address}</p>
                  <p><strong className="text-royal-black">Zone:</strong> {order.customer.deliveryZoneName}</p>
                  <p>
                    <strong className="text-royal-black">Payment:</strong> {order.paymentMethod?.name}
                    {order.paymentMethod?.transactionId ? ` (TrxID: ${order.paymentMethod.transactionId})` : ''}
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-royal-black">
                  Ordered Sarees ({order.items.length})
                </h4>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 divide-y divide-zinc-200">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={it.image} alt={it.name} className="w-8 h-10 object-cover rounded bg-white" />
                        <div>
                          <p className="font-semibold text-royal-black">{it.name}</p>
                          <p className="text-zinc-500">Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-royal-black">৳{(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-bold text-sm text-royal-black">
                    <span>Total Amount:</span>
                    <span className="text-gold-deep">৳{order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Contact Helper */}
            {order.whatsAppUrl && (
              <div className="pt-4 text-center">
                <a
                  href={order.whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire with Store Owner on WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
