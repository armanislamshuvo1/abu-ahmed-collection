import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aac_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('aac_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, openDrawer = true) => {
    const activePrice = (product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice > 0)
      ? product.discountPrice
      : product.regularPrice;

    setCartItems(prev => {
      const existing = prev.find(item => item.product === product._id);
      if (existing) {
        return prev.map(item =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          slug: product.slug,
          price: activePrice,
          regularPrice: product.regularPrice,
          image: (product.images && product.images[0]) || '/logo.jpg',
          fabric: product.fabric,
          quantity
        }
      ];
    });

    addToast(`"${product.name.slice(0, 30)}..." ব্যাগে যোগ করা হয়েছে!`, 'success');

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product !== productId));
    addToast('পণ্যটি ব্যাগ থেকে সরানো হয়েছে', 'info');
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        quickOrderProduct,
        setQuickOrderProduct
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
