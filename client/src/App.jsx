import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickOrderModal } from './components/cart/QuickOrderModal';
import { WhatsAppFloatingBtn } from './components/layout/WhatsAppFloatingBtn';

// Customer Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { TrackOrder } from './pages/TrackOrder';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [queryParams, setQueryParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const obj = {};
    for (const [key, val] of params.entries()) {
      obj[key] = val;
    }
    return obj;
  });

  // Listen to popstate (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      const params = new URLSearchParams(window.location.search);
      const obj = {};
      for (const [key, val] of params.entries()) {
        obj[key] = val;
      }
      setQueryParams(obj);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (url) => {
    const [path, search] = url.split('?');
    window.history.pushState({}, '', url);
    setCurrentPath(path);

    const obj = {};
    if (search) {
      const params = new URLSearchParams(search);
      for (const [key, val] of params.entries()) {
        obj[key] = val;
      }
    }
    setQueryParams(obj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine which page to render
  const renderPage = () => {
    // Admin routes
    if (currentPath === '/admin/login') {
      return <AdminLogin onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/admin')) {
      return <AdminDashboard onNavigate={navigate} />;
    }

    // Customer routes
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return <ProductDetail slug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/shop') {
      return <Shop onNavigate={navigate} queryParams={queryParams} />;
    }

    if (currentPath === '/checkout') {
      return <Checkout onNavigate={navigate} />;
    }

    if (currentPath === '/order-success') {
      return <OrderSuccess onNavigate={navigate} queryParams={queryParams} />;
    }

    if (currentPath === '/track-order') {
      return <TrackOrder onNavigate={navigate} queryParams={queryParams} />;
    }

    if (currentPath === '/login') {
      return <Login onNavigate={navigate} />;
    }

    if (currentPath === '/register') {
      return <Register onNavigate={navigate} />;
    }

    if (currentPath === '/profile') {
      return <Profile onNavigate={navigate} />;
    }

    return <Home onNavigate={navigate} />;
  };

  const isAdminSection = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-cream text-royal-black">
      {!isAdminSection && <Navbar onNavigate={navigate} currentPath={currentPath} />}

      <main className="flex-1">
        {renderPage()}
      </main>

      {!isAdminSection && <Footer onNavigate={navigate} />}

      {/* Global Interactive Overlays */}
      {!isAdminSection && (
        <>
          <CartDrawer onNavigate={navigate} />
          <QuickOrderModal onNavigate={navigate} />
          <WhatsAppFloatingBtn />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
