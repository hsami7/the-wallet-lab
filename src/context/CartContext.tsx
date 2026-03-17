"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
  variant?: any;
}

interface ShippingRate {
  id: string;
  name: string;
  price: number;
}

interface ShippingRule {
  id: string;
  active: boolean;
  min_amount: number;
  min_quantity: number;
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
  shippingFee: number;
  isFreeShipping: boolean;
  total: number;
  itemCount: number;
  promoCode: string | null;
  promoError: string | null;
  isApplying: boolean;
  shippingRates: ShippingRate[];
  selectedRateId: string | null;
  setSelectedRateId: (id: string) => void;
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

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch shipping data & subscribe to real-time changes
  useEffect(() => {
    const fetchShipping = async () => {
      const { data: rates } = await supabase.from('shipping_rates').select('id, name, price').eq('is_active', true).order('price', { ascending: true });
      const { data: rules } = await supabase.from('shipping_rules').select('id, active, min_amount, min_quantity');

      if (rates && rates.length > 0) {
        // Ensure price is a number (Supabase returns numeric as string)
        const typedRates = rates.map(r => ({
          ...r,
          price: Number(r.price)
        }));
        setShippingRates(typedRates);

        // Always re-validate selected rate from fresh DB data
        setSelectedRateId(prev => {
          const stillExists = typedRates.find(r => r.id === prev);
          return stillExists ? prev : typedRates[0].id;
        });
      }
      if (rules) setShippingRules(rules);
    };

    fetchShipping();

    // Real-time subscription: re-fetch whenever shipping_rates change in the DB
    const channel = supabase
      .channel('shipping_rates_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipping_rates' }, () => {
        fetchShipping();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipping_rules' }, () => {
        fetchShipping();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    const savedRate = localStorage.getItem("selectedRateId");
    if (savedRate) {
      setSelectedRateId(savedRate);
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
      if (selectedRateId) {
        localStorage.setItem("selectedRateId", selectedRateId);
      }
    }
  }, [cart, promoCode, selectedRateId, isInitialized]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  // Recalculate discount whenever promoCode or cart changes
  useEffect(() => {
    if (promoData) {
      // Validate min order again in case cart changed
      if (subtotal < promoData.min_order) {
        setDiscount(0);
        return;
      }

      if (promoData.type === 'percentage') {
        setDiscount(subtotal * (promoData.value / 100));
      } else {
        setDiscount(Math.min(promoData.value, subtotal));
      }
    } else {
      setDiscount(0);
    }
  }, [promoData, subtotal]);

  // Shipping logic
  const { isFreeShipping, shippingFee } = useMemo(() => {
    if (subtotal === 0) return { isFreeShipping: false, shippingFee: 0 };

    // Check promotional rules (e.g., free over X amount)
    const applies = shippingRules.some(rule =>
      rule.active && (
        (rule.min_amount > 0 && subtotal >= rule.min_amount) ||
        (rule.min_quantity > 0 && itemCount >= rule.min_quantity)
      )
    );

    if (applies) return { isFreeShipping: true, shippingFee: 0 };

    // Otherwise use the selected rate
    const rate = shippingRates.find(r => r.id === selectedRateId);
    // Treat price of 0 as free shipping
    if (rate && rate.price === 0) return { isFreeShipping: true, shippingFee: 0 };
    return { isFreeShipping: false, shippingFee: rate ? rate.price : 0 };
  }, [subtotal, itemCount, shippingRules, shippingRates, selectedRateId]);

  const total = useMemo(() => {
    const afterDiscount = subtotal - discount;
    return (afterDiscount > 0 ? afterDiscount : 0) + shippingFee;
  }, [subtotal, discount, shippingFee]);

  const addItem = (item: CartItem) => {
    setCart((prevCart) => {
      // Unique item key: ID + Variant Name (to handle different colors separately)
      const existingItem = prevCart.find((i) => 
        i.id === item.id && 
        ((!i.variant && !item.variant) || (i.variant?.name === item.variant?.name))
      );

      if (existingItem) {
        return prevCart.map((i) =>
          (i.id === item.id && i.variant?.name === item.variant?.name)
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
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

      if (data.min_order > 0 && subtotal < data.min_order) {
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
        shippingFee,
        isFreeShipping,
        total,
        itemCount,
        promoCode,
        promoError,
        isApplying,
        shippingRates,
        selectedRateId,
        setSelectedRateId,
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
