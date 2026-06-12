import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  fetchCart,
  addItemToCart,
  updateCartItemQty,
  removeCartItem,
  clearCartApi,
} from '../api/cartApi';
import { getStoredUser } from '../api/authApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [synced, setSynced] = useState(false);

  const isLoggedIn = () => !!getStoredUser() && !!localStorage.getItem('groceriaToken');

  // Normalise a DB cart item to the shape the frontend expects
  const normaliseItem = (item) => ({
    id: item.product?.toString() || item._id?.toString(),  // use product ObjectId as key
    _id: item.product?.toString() || item._id?.toString(),
    name: item.name,
    price: item.price,
    image: item.image || '',
    weight: item.weight || '',
    category: item.category || '',
    quantity: item.quantity,
  });

  // Load cart — from MongoDB if logged in, else from localStorage
  const loadCart = useCallback(async () => {
    if (isLoggedIn()) {
      try {
        const res = await fetchCart();
        if (res.success) {
          setCart((res.data.items || []).map(normaliseItem));
          setSynced(true);
          return;
        }
      } catch (e) {
        console.warn('Cart sync failed, using localStorage fallback');
      }
    }
    // Fallback: localStorage
    try {
      const saved = localStorage.getItem('groceriaCart');
      if (saved) setCart(JSON.parse(saved));
    } catch (_) {}
    setSynced(true);
  }, []);

  // Persist to localStorage whenever cart changes (offline fallback)
  useEffect(() => {
    if (synced) {
      localStorage.setItem('groceriaCart', JSON.stringify(cart));
    }
  }, [cart, synced]);

  // Initial load + re-sync when login state changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Re-sync cart from MongoDB whenever the user token changes (login/logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'groceriaToken') {
        // Token was added (login) or removed (logout) — reload cart
        loadCart();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadCart]);

  const addToCart = async (product) => {
    const productId = product._id || String(product.id);

    // Optimistic update
    setCart((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (existing) {
        return prev.map((i) => i.id === productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, id: productId, _id: productId, quantity: 1 }];
    });

    if (isLoggedIn()) {
      try {
        const res = await addItemToCart({
          productId,
          name: product.name,
          price: product.price,
          image: product.image || '',
          weight: product.weight || '',
          category: product.category || '',
          quantity: 1,
        });
        if (res.success) {
          setCart((res.data.items || []).map(normaliseItem));
        }
      } catch (e) {
        console.warn('addToCart API error:', e.message);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));

    if (isLoggedIn()) {
      try {
        await removeCartItem(productId);
      } catch (e) {
        console.warn('removeFromCart API error:', e.message);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => i.id === productId ? { ...i, quantity } : i)
    );

    if (isLoggedIn()) {
      try {
        await updateCartItemQty(productId, quantity);
      } catch (e) {
        console.warn('updateQuantity API error:', e.message);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (isLoggedIn()) {
      try {
        await clearCartApi();
      } catch (e) {
        console.warn('clearCart API error:', e.message);
      }
    }
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
