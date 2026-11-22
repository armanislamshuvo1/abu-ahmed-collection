import React, { useEffect, useState } from 'react';
import { Crown, Sparkles, ArrowRight, ShieldCheck, Truck, Clock, Heart } from 'lucide-react';
import { getProducts, getCategories } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

export const Home = ({ onNavigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [featuredData, newArrivalsData, catsData] = await Promise.all([
          getProducts({ featured: 'true' }),
          getProducts({ newArrival: 'true' }),
          getCategories()
        ]);
        setFeaturedProducts(featuredData.slice(0, 4));
        setNewArrivals(newArrivalsData.slice(0, 8));
        setCategories(catsData);
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Royal Hero Banner */}
      <section className="relative overflow-hidden bg-royal-black text-white py-16 sm:py-24 border-b border-gold/20">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-gold-light text-xs font-semibold uppercase tracking-widest shadow-sm">
                <Crown className="w-3.5 h-3.5 text-gold" />
                <span>Abu Ahmed Collection • Royal Heritage</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Timeless Elegance in <br />
                <span className="gold-text-gradient">Every Royal Drape</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover Bengal's most coveted handloom creations. From intricate masterwork Dhakai Jamdani and bridal Banarasi katan to featherweight Tangail cottons — crafted for women who appreciate royal dignity.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('/shop')}
                  className="w-full sm:w-auto"
                >
                  <span>Explore Saree Collection</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate('/shop?category=Dhakai+Jamdani')}
                  className="w-full sm:w-auto"
                >
                  <span>Dhakai Jamdani</span>
                </Button>
              </div>

              {/* Highlights row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-800 text-left">
                <div>
                  <span className="block font-serif text-lg sm:text-2xl font-bold text-gold">100%</span>
                  <span className="text-[11px] text-zinc-400">Authentic Handloom</span>
                </div>
                <div>
                  <span className="block font-serif text-lg sm:text-2xl font-bold text-gold">COD</span>
                  <span className="text-[11px] text-zinc-400">All 64 Districts</span>
                </div>
                <div>
                  <span className="block font-serif text-lg sm:text-2xl font-bold text-gold">Fast</span>
                  <span className="text-[11px] text-zinc-400">Nationwide Shipping</span>
                </div>
              </div>
            </div>

            {/* Right Featured Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl p-2 bg-royal-dark/80 group">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
                  alt="Abu Ahmed Collection Masterpiece"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-royal-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                    Heritage Masterpiece
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-1">
                    Royal Black & Gold Dhakai Jamdani
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1">Starting from ৳3,850 • Cash on Delivery</p>
                  <button
                    onClick={() => onNavigate('/product/royal-black-gold-heritage-dhakai-jamdani')}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:text-white transition-colors"
                  >
                    <span>View Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Saree Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-deep">
            Artisan Weaving Traditions
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-royal-black">
            Shop by Saree Category
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-light">
            Each piece is woven with devotion and curated directly from the traditional handloom belts of Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={cat._id || idx}
              onClick={() => onNavigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-soft border border-zinc-200/80 hover:border-gold hover:shadow-gold transition-all duration-300"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-center">
                <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-gold-light transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-zinc-300 uppercase tracking-wider mt-0.5">
                  Explore Designs →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Sarees Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-deep font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Handpicked Exclusives</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-royal-black">
                Featured Heritage Sarees
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/shop?featured=true')}
            >
              <span>View All Featured</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <ProductGrid
            products={featuredProducts}
            loading={loading}
            onNavigate={onNavigate}
          />
        </section>
      )}

      {/* Mid-page Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-royal-black via-zinc-900 to-royal-black text-white p-8 sm:p-12 border border-gold/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block bg-gold/20 text-gold-light border border-gold/40 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
              Eid & Wedding Season Collection
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Royal Bridal Banarasi & Pure Katan Silk
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Every bride deserves a drape that echoes queenly grace. Our handwoven Katans feature rich all-over metallic zari weaving that glistens under wedding lights.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => onNavigate('/shop?category=Banarasi+Katan')}
              >
                <span>Shop Bridal Collection</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-deep font-semibold mb-1">
              <Crown className="w-3.5 h-3.5 text-gold" />
              <span>Fresh Off The Weaving Loom</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-royal-black">
              New Arrivals & Trending Drape
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/shop')}
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <ProductGrid
          products={newArrivals}
          loading={loading}
          onNavigate={onNavigate}
        />
      </section>
    </div>
  );
};
