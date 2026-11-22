import React, { useState } from 'react';
import { ShoppingBag, Search, User, Truck, Menu, X, Phone, Crown, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onNavigate, currentPath = '/' }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, customerLogout, settings, admin, adminLogout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categories = [
    { name: 'All Sarees', slug: 'all' },
    { name: 'Dhakai Jamdani', slug: 'Dhakai Jamdani' },
    { name: 'Handloom Silk', slug: 'Handloom Silk' },
    { name: 'Banarasi Katan', slug: 'Banarasi Katan' },
    { name: 'Tangail Cotton', slug: 'Tangail Cotton' },
    { name: 'Royal Muslin', slug: 'Royal Muslin' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Bar / Announcement - Hidden on mobile / small devices */}
      <div className="hidden sm:block bg-royal-black text-gold-light py-1.5 px-4 text-[11px] font-medium border-b border-gold/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Crown className="w-3 h-3 text-gold shrink-0" />
            <span className="truncate">
              Free Express Delivery across Bangladesh on orders over ৳{settings?.freeShippingThreshold || 5000}!
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => onNavigate('/track-order')}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Truck className="w-3 h-3 text-gold" />
              <span>Track Order</span>
            </button>
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '8801806732097'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-gold" />
              <span>Helpline: {settings?.storePhone || '+880 1806-732097'}</span>
            </a>
            <a
              href={settings?.facebookUrl || 'https://www.facebook.com/people/Abu-Ahmed-Collection/61586448518021/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gold transition-colors"
              title="Official Facebook Page"
            >
              <svg className="w-3 h-3 fill-current text-blue-400" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-royal-dark text-white border-b border-gold/15 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="p-1.5 rounded-md text-zinc-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Logo */}
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left focus:outline-none group py-1"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gold shadow-gold group-hover:scale-105 transition-transform bg-black flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Abu Ahmed Collection Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base sm:text-lg font-bold tracking-wider text-gold-light group-hover:text-gold transition-colors leading-tight">
                  Abu Ahmed
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-semibold leading-tight">
                  Collection
                </span>
              </div>
            </button>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Jamdani, Katan, Silk sarees..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-royal-card border border-zinc-700/80 rounded-full pl-10 pr-4 py-2 text-sm text-cream placeholder-zinc-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-2.5" />
              </div>
            </form>

            {/* Actions: Track, Account, Cart */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Track Order link on desktop */}
              <button
                onClick={() => onNavigate('/track-order')}
                className={`hidden lg:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                  currentPath === '/track-order'
                    ? 'border-gold text-gold bg-gold/10'
                    : 'border-zinc-700 text-zinc-300 hover:border-gold hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-gold" />
                <span>Track Order</span>
              </button>

              {/* Customer Account / Profile Dropdown */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(prev => !prev)}
                      className="flex items-center gap-2 text-xs font-medium text-cream hover:text-gold p-1.5 rounded-lg border border-transparent hover:border-gold/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold border border-gold/40">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-royal-card border border-gold/20 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                        <div className="px-4 py-2 border-b border-zinc-800">
                          <p className="text-xs text-zinc-400">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('/profile');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/60 flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-gold" />
                          <span>My Profile & Orders</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            customerLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800/60 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate('/login')}
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cream hover:text-gold transition-colors p-2"
                    title="Sign In / Register"
                  >
                    <User className="w-5 h-5 text-gold" />
                    <span className="hidden sm:inline-block">Account</span>
                  </button>
                )}
              </div>

              {/* Shopping Bag Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-royal-card border border-gold/30 hover:border-gold hover:bg-zinc-800 text-gold transition-all duration-200 active:scale-95 shadow-sm"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 text-gold-light" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-600 to-maroon text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-black shadow">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Indicator & Logout (if logged in) */}
              {admin && (
                <div className="hidden sm:inline-flex items-center gap-1.5 bg-amber-950/70 border border-amber-500/50 px-2.5 py-1 rounded-full shadow-sm">
                  <button
                    onClick={() => onNavigate('/admin')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white transition-colors"
                    title="Admin Dashboard"
                  >
                    <Crown className="w-3.5 h-3.5 text-gold" />
                    <span>Admin</span>
                  </button>
                  <span className="text-amber-500/50 text-[10px]">|</span>
                  <button
                    onClick={() => {
                      adminLogout();
                      if (currentPath.startsWith('/admin')) {
                        onNavigate('/login');
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-red-400 transition-colors"
                    title="Sign Out of Admin"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Categories Bar */}
          <div className="hidden lg:flex items-center justify-center gap-7 py-1.5 border-t border-zinc-800/80 text-[11px] font-medium uppercase tracking-wider text-zinc-300">
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => onNavigate(cat.slug === 'all' ? '/shop' : `/shop?category=${encodeURIComponent(cat.slug)}`)}
                className="hover:text-gold transition-colors py-0.5 relative group"
              >
                <span>{cat.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800 bg-royal-black px-4 pt-4 pb-6 space-y-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sarees..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-royal-card border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-cream placeholder-zinc-400 focus:outline-none focus:border-gold"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate(cat.slug === 'all' ? '/shop' : `/shop?category=${encodeURIComponent(cat.slug)}`)}
                  }
                  className="text-left py-2 px-3 text-xs uppercase font-medium text-zinc-300 hover:text-gold hover:bg-zinc-800/50 rounded-lg transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/track-order');
                }}
                className="flex items-center gap-2 py-2 text-sm text-gold hover:text-white"
              >
                <Truck className="w-4 h-4" />
                <span>Track Your Order</span>
              </button>
              {admin && (
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-950/40 border border-amber-500/40">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('/admin');
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-amber-300"
                  >
                    <Crown className="w-4 h-4 text-gold" />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      adminLogout();
                      if (currentPath.startsWith('/admin')) {
                        onNavigate('/login');
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/profile');
                  }}
                  className="flex items-center gap-2 py-2 text-sm text-zinc-200 hover:text-gold"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile & Orders ({user.name})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/login');
                  }}
                  className="flex items-center gap-2 py-2 text-sm text-gold"
                >
                  <User className="w-4 h-4" />
                  <span>Customer Login / Register</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
