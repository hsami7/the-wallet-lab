"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
  variant?: string;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  promoCode: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
    const savedPromo = localStorage.getItem("promoCode");
    if (savedPromo) {
        setPromoCode(savedPromo);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
      if (promoCode) {
        localStorage.setItem("promoCode", promoCode);
      } else {
        localStorage.removeItem("promoCode");
      }
    }
  }, [cart, promoCode, isInitialized]);

  // Recalculate discount whenever promoCode or cart changes
  useEffect(() => {
    if (promoCode === "SAVE10") {
      setDiscount(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.1);
    } else if (promoCode === "LAB20") {
      setDiscount(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.2);
    } else {
      setDiscount(0);
    }
  }, [promoCode, cart]);

  const addItem = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevCart, item];
    });
  };

  const removeItem = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
  };

  const applyPromoCode = (code: string) => {
    const validCodes = ["SAVE10", "LAB20"];
    if (validCodes.includes(code.toUpperCase())) {
      setPromoCode(code.toUpperCase());
      return true;
    }
    return false;
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - discount + (subtotal > 0 ? subtotal * 0.08 : 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromoCode,
        subtotal,
        discount,
        total,
        itemCount,
        promoCode,
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
