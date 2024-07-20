import { ProductType } from 'common-types';
import React, { createContext, useContext, ReactNode, useRef } from 'react';

type EventCallback<T> = (props: T) => void;

interface EventContextProps {
  onAddToCart: (callback: EventCallback<{ product: ProductType, quantity: number }>) => () => void;
  triggerAddToCart: (product: ProductType, quantity: number) => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const useEvent = (): EventContextProps => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const addToCartCallbacksRef = useRef<Set<EventCallback<{ product: ProductType, quantity: number }>>>(new Set());

  const onAddToCart = (callback: EventCallback<{ product: ProductType, quantity: number }>) => {
    addToCartCallbacksRef.current.add(callback);
    return () => {
      addToCartCallbacksRef.current.delete(callback);
    };
  };

  const triggerAddToCart = (product: ProductType, quantity: number) => {
    addToCartCallbacksRef.current.forEach((callback) => callback({ product, quantity }));
  };

  return (
    <EventContext.Provider value={{ onAddToCart, triggerAddToCart }}>
      {children}
    </EventContext.Provider>
  );
};