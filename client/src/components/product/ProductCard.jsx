import React, { useState } from 'react';
import { ShoppingBag, Zap, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Badge } from '../ui/Badge';

export const ProductCard = ({ product, onNavigate }) => {
  const { addToCart, setQuickOrderProduct } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = (product.images && product.images[0]) || '/logo.jpg';
  const secondaryImage = (product.images && product.images[1]) || primaryImage;

  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice > 0;
  const currentPrice = hasDiscount ? product.discountPrice : product.regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)
    : 0;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-zinc-200/80 shadow-soft hover:shadow-gold hover:border-gold/40 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with aspect-[3/4] */}
      <div
        onClick={() => onNavigate(`/product/${product.slug}`)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 cursor-pointer"
      >
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/logo.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5 items-start">
            {hasDiscount && (
              <Badge variant="discount" className="text-[11px] px-2 py-0.5">
                −{discountPercent}%
              </Badge>
            )}
            {product.isNewArrival && !hasDiscount && (
              <Badge variant="new" className="text-[10px] px-2 py-0.5">
                নতুন
              </Badge>
            )}
          </div>

          <span className="backdrop-blur-md bg-royal-black/75 text-gold-light text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold/20 shadow-sm">
            {product.fabric || product.category}
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <span className="bg-red-950/90 text-red-200 border border-red-500/50 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
              স্টক শেষ
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Colors swatches preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[11px] text-zinc-500 font-medium">রং:</span>
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.2 rounded border border-zinc-200"
                >
                  {col}
                </span>
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-zinc-400">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Saree Name */}
        <h3
          onClick={() => onNavigate(`/product/${product.slug}`)}
          className="font-serif text-sm sm:text-base font-semibold text-royal-black line-clamp-2 min-h-[2.8em] group-hover:text-gold-dark transition-colors cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-bold text-royal-black">
            ৳{currentPrice?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through">
              ৳{product.regularPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Blouse piece badge */}
        <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>{product.blousePiece ? 'ব্লাউজ পিস সহ' : 'ব্লাউজ পিস ছাড়া'}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => setQuickOrderProduct(product)}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center gap-1 bg-royal-black hover:bg-gold-dark text-white hover:text-royal-black text-xs font-semibold py-2 px-2 rounded-lg transition-colors duration-200 active:scale-95 disabled:opacity-50"
            title="দ্রুত ১-ক্লিকে সরাসরি অর্ডার"
          >
            <Zap className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>অর্ডার করুন</span>
          </button>

          <button
            onClick={() => addToCart(product, 1, true)}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center gap-1 bg-gold/15 hover:bg-gold text-royal-black hover:text-black border border-gold/40 text-xs font-semibold py-2 px-2 rounded-lg transition-colors duration-200 active:scale-95 disabled:opacity-50"
            title="ব্যাগে যোগ করুন"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>কার্টে রাখুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
