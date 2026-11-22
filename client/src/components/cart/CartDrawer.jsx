import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const CartDrawer = ({ onNavigate }) => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();
  const { settings } = useAuth();

  if (!isCartOpen) return null;

  const threshold = settings?.freeShippingThreshold || 5000;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / threshold) * 100));
  const remainingForFreeShipping = Math.max(0, threshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-zinc-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-royal-black text-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-lg font-bold text-gold-light tracking-wide">
                Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Goal Bar */}
          <div className="bg-zinc-50 px-6 py-3 border-b border-zinc-100 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-zinc-600 mb-1.5">
                Add <span className="font-bold text-royal-black">৳{remainingForFreeShipping.toLocaleString()}</span> more to unlock <span className="text-emerald-700 font-semibold">Free Delivery</span>!
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                Congratulations! You qualified for Free Delivery!
              </p>
            )}
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-gold to-gold-dark h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <ShoppingBag className="w-16 h-16 text-zinc-300 mb-3 stroke-[1.2]" />
                <p className="font-serif text-base font-semibold text-royal-black">Your bag is empty</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                  Explore our luxury handloom Jamdani & Silk sarees.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-5"
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('/shop');
                  }}
                >
                  Browse Sarees
                </Button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.product} className="py-4 flex gap-4">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.src = '/logo.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-royal-black line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-zinc-400 hover:text-red-500 p-0.5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.fabric}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold text-royal-black">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                        <button
                          onClick={() => updateQuantity(item.product, -1)}
                          className="p-1 hover:bg-zinc-200 text-zinc-600 rounded-l transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-royal-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product, 1)}
                          className="p-1 hover:bg-zinc-200 text-zinc-600 rounded-r transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-zinc-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-serif text-lg font-bold text-royal-black">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Delivery charges (Inside Dhaka ৳80 / Outside Dhaka ৳150) calculated at next step.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-between"
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('/checkout');
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
