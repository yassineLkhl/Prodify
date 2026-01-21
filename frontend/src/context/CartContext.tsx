import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Track } from '../types/track';
import type { ReactNode } from 'react';

interface CartContextType {
  items: Track[];
  addToCart: (track: Track) => void;
  removeFromCart: (trackId: string) => void;
  clearCart: () => void;
  isInCart: (trackId: string) => boolean;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'prodify_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Track[]>([]);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [items]);

  const addToCart = useCallback((track: Track) => {
    setItems((prevItems) => {
      // Vérifier si la track est déjà dans le panier
      if (prevItems.some((item) => item.id === track.id)) {
        return prevItems; // Ne pas ajouter de doublon
      }
      return [...prevItems, track];
    });
  }, []);

  const removeFromCart = useCallback((trackId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== trackId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const isInCart = useCallback((trackId: string) => {
    return items.some((item) => item.id === trackId);
  }, [items]);

  // Calculer le total
  const total = items.reduce((sum, item) => sum + item.price, 0);

  // Nombre d'items
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte plus facilement
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

