"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  category: string;
  size: string; // e.g. "Scoop", "1 Kg", "Classic"
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localeStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("ak_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not load cart from local storage", e);
    }
  }, []);

  // Save to localeStorage on items change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ak_cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (i) => i.id === newItem.id && i.size === newItem.size
      );

      if (existingItemIndex > -1) {
        // Update quantity if item with exact same size exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }
      return [...currentItems, newItem];
    });
    // Auto-open cart on add
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size: string) => {
    setItems((current) => current.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
