import React from 'react';
import { Crown, Phone, Mail, MapPin, Heart, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer = ({ onNavigate }) => {
  const { settings } = useAuth();

  return (
    <footer className="bg-royal-black text-white border-t border-gold/20 pt-16 pb-12 mt-20">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-gold border border-gold/30 shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gold-light">100% Authentic</h4>
              <p className="text-xs text-zinc-400">Directly from artisan handlooms</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-gold border border-gold/30 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gold-light">Nationwide Delivery</h4>
              <p className="text-xs text-zinc-400">Across all 64 districts in Bangladesh</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-gold border border-gold/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gold-light">Cash on Delivery</h4>
              <p className="text-xs text-zinc-400">Pay after receiving your parcel</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-gold border border-gold/30 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gold-light">Easy Exchange</h4>
              <p className="text-xs text-zinc-400">Hassle-free 3-day exchange</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold shadow-gold bg-black">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-gold-light">Abu Ahmed</h3>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400">Collection</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Curating Bangladesh’s most exquisite heritage sarees. From timeless Dhakai Jamdani to luxurious Katan and breathable Tangail cotton, every drape celebrates grace, dignity, and royal poise.
            </p>
            <div className="pt-2 text-xs text-gold">
              STYLE • QUALITY • TRUST
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-light mb-4">Saree Collections</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => onNavigate('/shop?category=Dhakai+Jamdani')} className="hover:text-gold transition-colors">
                  Dhakai Jamdani Sarees
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=Handloom+Silk')} className="hover:text-gold transition-colors">
                  Pure Handloom Silk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=Banarasi+Katan')} className="hover:text-gold transition-colors">
                  Banarasi Katan Bridal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=Tangail+Cotton')} className="hover:text-gold transition-colors">
                  Tangail Soti Cotton
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=Royal+Muslin')} className="hover:text-gold transition-colors">
                  Royal Muslin Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-light mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => onNavigate('/track-order')} className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gold" />
                  <span>Track Your Order</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/profile')} className="hover:text-gold transition-colors">
                  My Account & Order History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login')} className="hover:text-gold transition-colors">
                  Customer Sign In
                </button>
              </li>
              <li>
                <span className="text-zinc-500">Shipping Policy (Inside Dhaka: ৳80 | Outside Dhaka: ৳150)</span>
              </li>
              <li>
                <span className="text-zinc-500">Cash on Delivery & bKash Accepted</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-light mb-4">Store Helpline</h4>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{settings?.storeAddress || 'Shop No. 106, RS Road, Reazuddin Bazar, Chittagong, Bangladesh'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>{settings?.storePhone || '+880 1806-732097'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>{settings?.storeEmail || 'mabuahmedsons786@gmail.com'}</span>
              </li>
            </ul>

            <div className="mt-4 space-y-2">
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
                <span className="text-gold-light font-medium block mb-1">WhatsApp Fast Order:</span>
                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '8801806732097'}?text=${encodeURIComponent('Hello Abu Ahmed Collection, I would like to inquire about sarees.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline"
                >
                  Chat on WhatsApp (+{settings?.whatsappNumber || '8801806732097'})
                </a>
              </div>

              <a
                href={settings?.facebookUrl || 'https://www.facebook.com/people/Abu-Ahmed-Collection/61586448518021/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 text-xs font-medium transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Visit Facebook Page</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Abu Ahmed Collection. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/admin')}
            className="text-zinc-600 hover:text-gold transition-colors text-[11px]"
          >
            Admin Portal
          </button>
          <span>•</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Saree Lovers
          </span>
        </div>
      </div>
    </footer>
  );
};
