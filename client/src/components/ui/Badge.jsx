import React from 'react';

export const Badge = ({ children, variant = 'gold', className = '', ...props }) => {
  const variants = {
    gold: 'bg-gold/15 text-gold-deep border border-gold/40',
    discount: 'bg-gradient-to-r from-red-600 to-maroon text-white font-bold shadow-sm',
    new: 'bg-royal-black text-gold border border-gold/30',
    stock: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    outOfStock: 'bg-zinc-100 text-zinc-500 border border-zinc-200',
    pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    confirmed: 'bg-blue-50 text-blue-800 border border-blue-200',
    processing: 'bg-purple-50 text-purple-800 border border-purple-200',
    shipped: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-800 border border-rose-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase ${
        variants[variant] || variants.gold
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
