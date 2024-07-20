import { CartItem } from '@/types/CartItem';
import { ProductType } from 'common-types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useEvent } from './EventContext'; // Importez le contexte d'événement

interface CartContextProps {
  cart: CartItem[];
  setItem: (product: ProductType, quantity: number) => void;
  addItem: (product: ProductType, quantity: number) => void;
  removeItem: (product: ProductType, quantity: number) => void;
  deleteItem: (product: ProductType) => void;
  getItemQuantity: (product: ProductType) => number;
  reset: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<{[key: string]: CartItem}>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const { triggerAddToCart } = useEvent(); 

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateCart = (product: ProductType, quantity: number, operation: 'set' | 'add' | 'remove') => {
    setCart((prevCart) => {
      const existingItem = prevCart[product.id];
      let newQuantity = 0;

      if (operation === 'set') {
        newQuantity = quantity;
      } else if (operation === 'add') {
        newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
      } else if (operation === 'remove') {
        newQuantity = existingItem ? existingItem.quantity - quantity : 0;
      }

      if (newQuantity <= 0) {
        const { [product.id]: _, ...rest } = prevCart;
        return rest;
      }

      return {
        ...prevCart,
        [product.id]: { ...product, quantity: newQuantity }
      };
    });
  };

  const setItem = (product: ProductType, quantity: number) => {
    updateCart(product, quantity, 'set');
  };

  const addItem = (product: ProductType, quantity: number) => {
    updateCart(product, quantity, 'add');
    triggerAddToCart(product, quantity);
  };

  const removeItem = (product: ProductType, quantity: number) => {
    updateCart(product, quantity, 'remove');
  };

  const deleteItem = (product: ProductType) => {
    setCart((prevCart) => {
      const { [product.id]: _, ...rest } = prevCart;
      return rest;
    });
  };

  const getItemQuantity = (product: ProductType): number => {
    return cart[product.id]?.quantity || 0;
  };

  const reset = () => {
    setCart({});
  }

  return (
    <CartContext.Provider value={{ cart: Object.values(cart), setItem, addItem, removeItem, deleteItem, getItemQuantity, reset }}>
      {children}
    </CartContext.Provider>
  );
};