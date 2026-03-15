"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

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
  applyPromoCode: (code: string) => Promise<boolean>;
  clearPromoCode: () => void;
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  promoCode: string | null;
  promoError: string | null;
  isApplying: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoData, setPromoData] = useState<any>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const supabase = createClient();

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
    if (promoData) {
      const currentSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      
      // Validate min order again in case cart changed
      if (currentSubtotal < promoData.min_order) {
        setDiscount(0);
        return;
      }

      if (promoData.type === 'percentage') {
        setDiscount(currentSubtotal * (promoData.value / 100));
      } else {
        setDiscount(Math.min(promoData.value, currentSubtotal));
      }
    } else {
      setDiscount(0);
    }
  }, [promoData, cart]);

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
    setPromoData(null);
  };

  const clearPromoCode = () => {
    setPromoCode(null);
    setPromoData(null);
    setPromoError(null);
  };

  const applyPromoCode = async (code: string) => {
    setIsApplying(true);
    setPromoError(null);
    
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error || !data) {
        setPromoError("Invalid promo code");
        return false;
      }

      if (data.status !== 'Active') {
        setPromoError(`This code is ${data.status.toLowerCase()}`);
        return false;
      }

      const now = new Date();
      if (data.expires_at && new Date(data.expires_at) < now) {
        setPromoError("This code has expired");
        return false;
      }

      if (data.max_uses > 0 && data.used_count >= data.max_uses) {
        setPromoError("This code has reached its usage limit");
        return false;
      }

      const currentSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      if (data.min_order > 0 && currentSubtotal < data.min_order) {
        setPromoError(`Minimum order of ${data.min_order} MAD required`);
        return false;
      }

      setPromoData(data);
      setPromoCode(data.code);
      return true;
    } catch (err) {
      setPromoError("Verification failed. Please try again.");
      return false;
    } finally {
      setIsApplying(false);
    }
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
        clearPromoCode,
        subtotal,
        discount,
        total,
        itemCount,
        promoCode,
        promoError,
        isApplying,
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
