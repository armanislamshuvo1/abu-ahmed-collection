import React, { useEffect, useState } from 'react';
import { ShoppingBag, Zap, Check, Truck, ShieldCheck, RefreshCw, MessageCircle, Heart, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { getProductBySlug } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ImageGallery } from '../components/product/ImageGallery';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProductDetail = ({ slug, onNavigate }) => {
  const { addToCart, setQuickOrderProduct } = useCart();
  const { settings } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data.product);
        setRelated(data.related || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Failed to load saree details', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse space-y-4">
        <div className="w-16 h-16 bg-zinc-200 rounded-full mx-auto" />
        <div className="h-6 bg-zinc-200 rounded max-w-sm mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
        <h2 className="font-serif text-2xl font-bold text-royal-black">Saree Not Found</h2>
        <p className="text-sm text-zinc-500 mt-2">The product you are looking for may have been moved or updated.</p>
        <Button variant="primary" className="mt-6" onClick={() => onNavigate('/shop')}>
          Return to Saree Collection
        </Button>
      </div>
    );
  }

  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice > 0;
  const currentPrice = hasDiscount ? product.discountPrice : product.regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)
    : 0;

  const whatsAppPhone = settings?.whatsappNumber || '8801806732097';
  const whatsAppInquiryUrl = `https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(
    `Hello Abu Ahmed Collection, I want to inquire about: ${product.name} (Price: ৳${currentPrice}). Is it available for delivery?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-10">
      {/* Product Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Gallery */}
        <div className="lg:col-span-6">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Information */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-3.5">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="gold">{product.category}</Badge>
              <Badge variant="stock">{product.fabric}</Badge>
              {hasDiscount && <Badge variant="discount">−{discountPercent}% OFF</Badge>}
              {product.inStock ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                </span>
              ) : (
                <span className="text-xs text-red-500 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-royal-black leading-snug">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-royal-black">
                ৳{currentPrice?.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-base text-zinc-400 line-through">
                  ৳{product.regularPrice?.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-zinc-500 font-medium">VAT & Taxes included</span>
            </div>

            {/* Color tags */}
            {product.colors && product.colors.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-zinc-700 block mb-1.5">Color Palette:</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-zinc-100 text-royal-black px-3 py-1 rounded-full border border-zinc-200 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Blouse Piece Spec */}
            <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span className="font-semibold text-royal-black">Blouse Piece:</span>
                <span className="text-zinc-700">{product.blousePiece ? 'Included with Saree' : 'Not Included'}</span>
              </div>
              <span className="text-zinc-500">Length: 12 Haat (approx 5.5m)</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-semibold text-zinc-700">Quantity:</span>
              <div className="flex items-center border border-zinc-300 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 rounded-l"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-royal-black">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 rounded-r"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!product.inStock}
                  onClick={() => setQuickOrderProduct({ ...product, quantity })}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 text-gold-dark" />
                  <span>Buy Now</span>
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product, quantity, true)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </Button>
              </div>

              {/* WhatsApp direct order */}
              <a
                href={whatsAppInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Order or Inquire Directly on WhatsApp</span>
              </a>
            </div>

            {/* Assurance Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold shrink-0" />
                <span>Inside Dhaka: ৳80 | Outside: ৳150</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>Cash on Delivery Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saree Craft & Care Instructions Tabs */}
      <div className="rounded-3xl bg-white border border-zinc-200 p-6 sm:p-10 shadow-soft space-y-8">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-royal-black mb-3">
            About This Artisan Saree
          </h3>
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line font-light">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-100">
          <div className="space-y-1">
            <h4 className="text-xs uppercase tracking-wider font-bold text-royal-black">Fabric Composition</h4>
            <p className="text-xs text-zinc-600">{product.fabric}</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs uppercase tracking-wider font-bold text-royal-black">Blouse Piece</h4>
            <p className="text-xs text-zinc-600">{product.blousePiece ? 'Matching Unstitched Blouse Piece Included' : 'No Blouse Piece'}</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs uppercase tracking-wider font-bold text-royal-black">Care Guidelines</h4>
            <p className="text-xs text-zinc-600">{product.careInstructions || 'Dry clean recommended. Wrap in cotton muslin.'}</p>
          </div>
        </div>
      </div>

      {/* Related Sarees */}
      {related.length > 0 && (
        <div className="space-y-6">
          <div className="border-b border-zinc-200 pb-3">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-royal-black">
              You May Also Admire
            </h3>
          </div>
          <ProductGrid products={related} onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
};
