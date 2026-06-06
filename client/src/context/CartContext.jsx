import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCart } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      const { data } = await fetchCart();
      setCart(data);
    } catch {
      setCart({ items: [] });
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const count = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, setCart, refreshCart, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
