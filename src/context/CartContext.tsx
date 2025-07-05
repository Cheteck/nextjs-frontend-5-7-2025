"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sellerId?: number;
  variationId?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (id: number, variationId?: number, sellerId?: number) => void;
  updateQuantity: (id: number, quantity: number, variationId?: number, sellerId?: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const findCartItem = (id: number, variationId?: number, sellerId?: number) => {
    return cartItems.findIndex(item => 
      item.id === id && 
      (variationId === undefined || item.variationId === variationId) &&
      (sellerId === undefined || item.sellerId === sellerId)
    );
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = findCartItem(item.id, item.variationId, item.sellerId);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (id: number, variationId?: number, sellerId?: number) => {
    setCartItems((prevItems) => {
      return prevItems.filter(item => 
        !(item.id === id && 
          (variationId === undefined || item.variationId === variationId) &&
          (sellerId === undefined || item.sellerId === sellerId))
      );
    });
  };

  const updateQuantity = (id: number, quantity: number, variationId?: number, sellerId?: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = findCartItem(id, variationId, sellerId);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        if (quantity <= 0) {
          updatedItems.splice(existingItemIndex, 1);
        } else {
          updatedItems[existingItemIndex].quantity = quantity;
        }
        return updatedItems;
      }
      return prevItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
