import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  fetchWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
  clearWishlistApi,
} from '../api/wishlistApi';
import { getStoredUser } from '../api/authApi';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [synced, setSynced] = useState(false);

  const isLoggedIn = () => !!getStoredUser() && !!localStorage.getItem('groceriaToken');

  const normaliseItem = (item) => ({
    id: item.product?.toString() || item._id?.toString(),
    _id: item.product?.toString() || item._id?.toString(),
    name: item.name,
    price: item.price,
    image: item.image || '',
    weight: item.weight || '',
    category: item.category || '',
    addedAt: item.addedAt,
  });

  const loadWishlist = useCallback(async () => {
    if (isLoggedIn()) {
      try {
        const res = await fetchWishlist();
        if (res.success) {
          setWishlist((res.data.items || []).map(normaliseItem));
          setSynced(true);
          return;
        }
      } catch (e) {
        console.warn('Wishlist sync failed');
      }
    }
    try {
      const saved = localStorage.getItem('groceriaWishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch (_) {}
    setSynced(true);
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    if (synced) {
      localStorage.setItem('groceriaWishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, synced]);

  const addToWishlist = async (product) => {
    const productId = product._id || String(product.id);
    const alreadyIn = wishlist.find((i) => i.id === productId);
    if (alreadyIn) return;

    setWishlist((prev) => [...prev, { ...product, id: productId, _id: productId }]);

    if (isLoggedIn()) {
      try {
        const res = await addToWishlistApi({
          productId,
          name: product.name,
          price: product.price,
          image: product.image || '',
          weight: product.weight || '',
          category: product.category || '',
        });
        if (res.success) {
          setWishlist((res.data.items || []).map(normaliseItem));
        }
      } catch (e) {
        console.warn('addToWishlist API error:', e.message);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((i) => i.id !== productId));
    if (isLoggedIn()) {
      try {
        await removeFromWishlistApi(productId);
      } catch (e) {
        console.warn('removeFromWishlist API error:', e.message);
      }
    }
  };

  const clearWishlist = async () => {
    setWishlist([]);
    if (isLoggedIn()) {
      try {
        await clearWishlistApi();
      } catch (e) {
        console.warn('clearWishlist API error:', e.message);
      }
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((i) => i.id === String(productId) || i.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
