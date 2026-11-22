import React from 'react';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  loading = false,
  onNavigate,
  emptyMessage = 'No sarees found matching your criteria.'
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-zinc-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-200 rounded w-3/4" />
              <div className="h-4 bg-zinc-200 rounded w-1/2" />
              <div className="h-8 bg-zinc-200 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-zinc-200">
        <Sparkles className="w-12 h-12 text-gold mx-auto mb-3" />
        <h3 className="font-serif text-lg font-bold text-royal-black">No Sarees Found</h3>
        <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map(product => (
        <ProductCard
          key={product._id || product.slug}
          product={product}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
};
