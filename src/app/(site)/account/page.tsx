"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { updateProfile } from "@/app/actions/profile";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";

type TabType = "account" | "wallet" | "orders" | "privacy";

export default function AccountPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [isPendingPhone, setIsPendingPhone] = useState(false);
  const [isPendingEmail, setIsPendingEmail] = useState(false);
  const [isPendingAddress, setIsPendingAddress] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPendingName, setIsPendingName] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState({ orders: 0, address: "Add your address", twoFa: "2FA is currently active" });
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  // Validation Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const moroccanPhoneRegex = /^[5-9]\d{8}$/;

  const handleNameEdit = async () => {
    if (isEditingName) {
      if (!fullName || fullName.trim() === "") {
        setIsEditingName(false);
        return;
      }
      setIsPendingName(true);
      try {
        await updateProfile({ full_name: fullName.trim() });
        showToast("Name updated successfully!", "success");
        setIsEditingName(false);
      } catch (err: any) {
        console.error("Failed to update name", err);
        showToast(err.message || "Failed to update name.", "error");
      }
      setIsPendingName(false);
    } else {
      setIsEditingName(true);
    }
  };

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data } = await supabase
          .from("profiles")
          .select("phone, full_name, address, city, zip")
          .eq("id", user.id)
          .single();
          
        let profileAddress = "Add your address"; 
        
        // Fetch orders first to use as fallback
        setIsLoadingOrders(true);
        const { data: realOrders } = await supabase
          .from("orders")
          .select(`
            id,
            created_at,
            status,
            total_amount,
            shipping_address,
            shipping_amount,
            discount_amount,
            promo_code,
            order_items (
              quantity,
              unit_price,
              variant,
              products (
                name,
                image_url
              )
            )
          `)
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });
          
        setOrders(realOrders || []);
        setIsLoadingOrders(false);
        
        if (data) {
          // Latest order fallback
          const latestOrder = (realOrders && realOrders.length > 0) ? realOrders[0] : null;
          const orderShipping = latestOrder?.shipping_address || {};
          
          // If the phone number from DB has +212, strip it for the input field to avoid duplication
          let dbPhone = data.phone || orderShipping.phone || "";
          if (dbPhone.startsWith("+212")) {
            dbPhone = dbPhone.substring(4).trim();
          }
          setPhone(dbPhone);
          setFullName(data.full_name || "");
          
          const finalAddress = data.address || orderShipping.address1 || "";
          const finalCity = data.city || orderShipping.city || "";
          const finalZip = data.zip || orderShipping.zip || "";
          
          setAddress(finalAddress);
          setCity(finalCity);
          setZip(finalZip);
          
          if (finalAddress) profileAddress = `${finalAddress}${finalCity ? `, ${finalCity}` : ""}`;
        }
        
        // Check 2FA
        const twoFaActive = user.factors && user.factors.length > 0;
        
        setStats({
          orders: realOrders?.length || 0,
          address: profileAddress,
          twoFa: twoFaActive ? "2FA is currently active" : "2FA is not enabled", 
        });
      }
    }
    loadData();
  }, []);

  const handlePhoneEdit = async () => {
    setErrorMessage("");
    if (isEditingPhone) {
      if (!phone || phone.trim() === "") {
        setIsEditingPhone(false);
        return; // Don't save empty phone numbers
      }
      
      const strippedPhone = phone.replace(/\s+/g, '');
      if (!moroccanPhoneRegex.test(strippedPhone)) {
        setErrorMessage("Please enter a valid Moroccan phone number (9 digits, e.g. 612345678).");
        return;
      }
      
      setIsPendingPhone(true);
      let hasError = false;
      try {
        const fullPhone = `+212${strippedPhone}`;
        await updateProfile({ phone: fullPhone });
        showToast("Phone number updated successfully!", "success");
      } catch (err) {
        console.error("Failed to update phone", err);
        showToast("Database update failed. Try again.", "error");
        hasError = true;
      }
      setIsPendingPhone(false);
      if (!hasError) setIsEditingPhone(false);
    } else {
      setIsEditingPhone(true);
    }
  };

  const handleAddressEdit = async () => {
    setErrorMessage("");
    if (isEditingAddress) {
      setIsPendingAddress(true);
      try {
        await updateProfile({ 
          address: address.trim(),
          city: city.trim(),
          zip: zip.trim()
        });
        setStats(prev => ({ ...prev, address: `${address.trim()}${city ? `, ${city.trim()}` : ""}` }));
        showToast("Address updated successfully!", "success");
        setIsEditingAddress(false);
      } catch (err: any) {
        console.error("Failed to update address", err);
        showToast(err.message || "Failed to update address.", "error");
      }
      setIsPendingAddress(false);
    } else {
      setIsEditingAddress(true);
    }
  };

  const handleEmailEdit = async () => {
    setErrorMessage("");
    if (isEditingEmail) {
      if (!email || email.trim() === "") {
        setIsEditingEmail(false);
        return; 
      }
      
      if (!emailRegex.test(email.trim())) {
        showToast("Please enter a valid email address.", "warning");
        return;
      }
      
      setIsPendingEmail(true);
      let hasError = false;
      try {
        await updateProfile({ email: email.trim() });
        showToast("Verification email sent to " + email.trim(), "info", 5000);
      } catch (err: any) {
        console.error("Failed to update email", err);
        showToast(err.message || "Failed to update email.", "error");
        hasError = true;
      }
      setIsPendingEmail(false);
      
      if (!hasError) {
          setIsEditingEmail(false);
      }
    } else {
      setIsEditingEmail(true);
    }
  };

  const sidebarItems: { id: TabType; icon: string; label: string }[] = [
    { id: "account", icon: "person", label: "Account" },
    { id: "wallet", icon: "wallet", label: "Wallet" },
    { id: "orders", icon: "package_2", label: "Orders" },
    { id: "privacy", icon: "shield", label: "Privacy" },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full py-6 md:py-12 px-4 md:px-8">
        <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 p-2 md:p-6 lg:border-r border-slate-200 dark:border-slate-800 overflow-x-auto lg:overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2 lg:py-3 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === item.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <p className="text-sm font-semibold">{item.label}</p>
            </button>
          ))}
          <div className="hidden lg:block mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
            <form action={logout}>
              <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer">
                <span className="material-symbols-outlined">logout</span>
                <p className="text-sm font-semibold">Sign Out</p>
              </button>
            </form>
          </div>
        </aside>

        <section className="flex-1 p-6 md:p-10 transition-all duration-300">
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    {isEditingName ? (
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNameEdit()}
                          disabled={isPendingName}
                          autoFocus
                          className="text-2xl md:text-3xl font-bold tracking-tight bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-1 outline-none focus:ring-2 focus:ring-primary w-full max-w-md"
                        />
                        <button 
                          onClick={handleNameEdit}
                          disabled={isPendingName}
                          className="bg-primary text-white p-2 rounded-full hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all flex items-center justify-center shrink-0"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {isPendingName ? "cached" : "check"}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 group">
                        <h1 className="text-3xl font-bold tracking-tight">{fullName || "Your Name"}</h1>
                        <button 
                          onClick={() => setIsEditingName(true)}
                          className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { id: 'personal', icon: 'account_circle', title: 'Personal Info', desc: 'Update profile details' },
                  { id: 'orders', icon: 'local_shipping', title: 'Order Tracking', desc: `Check status of ${stats.orders} orders` },
                  { id: 'location', icon: 'location_on', title: 'Delivery Info', desc: stats.address },
                  { id: 'security', icon: 'lock', title: 'Security', desc: stats.twoFa }
                ].map((card, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                        if (card.id === 'orders') setActiveTab('orders');
                        else if (card.id === 'security') setActiveTab('privacy');
                        else if (card.id === 'personal') document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' });
                        else if (card.id === 'location') document.getElementById('delivery-info')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 hover:border-primary transition-colors group cursor-pointer shadow-sm"
                  >
                    <div className="text-primary bg-primary/10 rounded-xl size-12 flex items-center justify-center">
                      <span className="material-symbols-outlined">{card.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{card.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                <div id="contact-info" className="scroll-mt-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">contact_mail</span>
                    Contact Information
                  </h2>
                  
                  {errorMessage && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl border border-red-200 dark:border-red-800 text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {errorMessage}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 shadow-sm relative group overflow-hidden">
                      <div className="flex justify-between items-start mb-1">
                        <label className="text-xs font-bold uppercase text-slate-400">Email Address</label>
                        <button onClick={handleEmailEdit} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
                          {isEditingEmail ? "Save" : "Edit"}
                        </button>
                      </div>
                      {isEditingEmail ? (
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => {
                              setEmail(e.target.value);
                              if (errorMessage) setErrorMessage("");
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailEdit()}
                          disabled={isPendingEmail}
                          autoFocus
                          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        />
                      ) : (
                        <p className="text-slate-900 dark:text-slate-100 font-medium">
                          {email || <span className="text-slate-400 italic font-normal">Add email address...</span>}
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl bg-white dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 shadow-sm relative group overflow-hidden">
                      <div className="flex justify-between items-start mb-1">
                        <label className="text-xs font-bold uppercase text-slate-400">Phone Number</label>
                        <button onClick={handlePhoneEdit} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
                          {isEditingPhone ? "Save" : "Edit"}
                        </button>
                      </div>
                      {isEditingPhone ? (
                        <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                          <span className="flex items-center justify-center px-3 bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold border-r border-slate-200 dark:border-slate-700">
                            +212
                          </span>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value.replace(/[^0-9]/g, ''));
                                if (errorMessage) setErrorMessage("");
                            }} // only allow numbers
                            onKeyDown={(e) => e.key === 'Enter' && handlePhoneEdit()}
                            disabled={isPendingPhone}
                            autoFocus
                            placeholder="612345678"
                            className="w-full bg-transparent px-3 py-1 text-slate-900 dark:text-slate-100 font-medium outline-none disabled:opacity-50"
                          />
                        </div>
                      ) : (
                        <p className="text-slate-900 dark:text-slate-100 font-medium">
                          {phone ? `+212 ${phone}` : <span className="text-slate-400 italic font-normal">Add phone number...</span>}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div id="delivery-info" className="scroll-mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">local_shipping</span>
                      Delivery Information
                    </h2>
                    <button onClick={handleAddressEdit} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
                      {isEditingAddress ? "Save" : "Edit"}
                    </button>
                  </div>
                  
                  <div className="rounded-2xl bg-white dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    {isEditingAddress ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Street Address</label>
                            <input 
                              type="text" 
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="e.g. 123 Rue de la Liberté"
                              disabled={isPendingAddress}
                              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">City</label>
                              <input 
                                type="text" 
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Casablanca"
                                disabled={isPendingAddress}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">ZIP Code</label>
                              <input 
                                type="text" 
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                placeholder="20000"
                                disabled={isPendingAddress}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined">home_pin</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Default Shipping Address</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                            {address ? (
                              <>
                                {address} <br />
                                {city} {zip && `${zip}`}
                              </>
                            ) : (
                                <span className="text-slate-400 italic font-normal">No address saved yet. Fill it during checkout or edit here.</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold tracking-tight mb-8">My Wallet</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Real Credit Card UI */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="relative h-64 w-full max-w-md perspective-1000 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
                      {/* Card Patterns/Texture */}
                      <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 size-64 bg-primary/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                      
                      <div className="flex justify-between items-start relative z-10">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Premium Card</p>
                          <span className="material-symbols-outlined text-4xl text-white/90">contactless</span>
                        </div>
                        <div className="size-16 flex items-end justify-end">
                            <svg className="h-8" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="30" cy="30" r="30" fill="#EB001B" fillOpacity="0.8"/>
                                <circle cx="70" cy="30" r="30" fill="#F79E1B" fillOpacity="0.8"/>
                            </svg>
                        </div>
                      </div>

                      <div className="space-y-6 relative z-10">
                        <div className="flex gap-4">
                            {['****', '****', '****', '4242'].map((set, i) => (
                                <span key={i} className="text-2xl font-mono tracking-widest">{set}</span>
                            ))}
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-white/40 mb-1">Card Holder</p>
                            <p className="text-sm font-bold tracking-wider uppercase">{fullName || "MEMBER"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-white/40 mb-1">Expires</p>
                            <p className="text-sm font-bold">12/26</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold hover:border-primary hover:text-primary transition-all group w-full max-w-md">
                        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                        <span className="text-sm">Add New Card</span>
                    </button>
                  </div>
                </div>

                {/* Account Benefits / Quick Info */}
                <div className="space-y-6">
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-xl">verified</span>
                            </div>
                            <h3 className="font-bold text-primary">Secure Wallet</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Your payment information is stored securely using AES-256 bit encryption and is never shared directly with merchants.
                        </p>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold tracking-tight mb-8">Purchase History</h1>
              <div className="space-y-4">
                {isLoadingOrders ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <span className="material-symbols-outlined text-4xl text-slate-300 animate-spin mb-4">progress_activity</span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Authenticating History...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <span className="material-symbols-outlined text-5xl text-slate-200 mb-6 font-thin">receipt_long</span>
                    <p className="text-slate-900 dark:text-white font-bold mb-1">No orders found</p>
                    <p className="text-slate-500 text-sm mb-10">Your laboratory journey hasn&apos;t started yet.</p>
                    <Link href="/shop" className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all">
                      Explore the Shop
                    </Link>
                  </div>
                ) : (
                  orders.map((order, i) => {
                    const date = new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric"
                    });
                    
                    return (
                      <div 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-primary transition-all cursor-pointer group shadow-sm"
                      >
                        <div className="flex items-center gap-6">
                          <div className="size-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                            {order.order_items?.[0]?.products?.image_url ? (
                              <img src={order.order_items[0].products.image_url} alt="" className="size-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-primary text-2xl">package_2</span>
                            )}
                            {order.order_items?.length > 1 && (
                              <div className="absolute bottom-0 right-0 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-tl-lg">
                                +{order.order_items.length - 1}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">#{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-slate-400 font-medium">{date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="text-right">
                            <p className="font-black text-slate-900 dark:text-white">{Number(order.total_amount).toLocaleString()} MAD</p>
                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full inline-block ${
                              order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                              order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                              order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-slate-500/10 text-slate-500'
                            }`}>
                              {order.status}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy & Security</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">security</span>
                    Security Activity
                  </h2>
                  <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    {orders.length > 0 && orders[0].notification_history?.length > 0 ? (
                      orders[0].notification_history.slice(0, 3).map((notif: any, idx: number) => (
                        <div key={idx} className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <span className="material-symbols-outlined text-primary">notifications</span>
                          <div className="flex-1">
                            <p className="text-sm font-bold">{notif.message}</p>
                            <p className="text-xs text-slate-400">{new Date(notif.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">shield_with_heart</span>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Your account is secure</p>
                        <p className="text-xs text-slate-400 mt-1">No suspicious activity detected in the lab.</p>
                      </div>
                    )}
                    <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800/50">
                      <button className="text-primary text-sm font-bold hover:underline">View full security log</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-2">Two-Factor Authentication</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-bold text-sm">Enabled</span>
                      </div>
                      <button className="text-primary font-bold text-sm hover:underline">Manage</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-950 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Order #{selectedOrder.id.slice(0, 8)}</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {new Date(selectedOrder.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="size-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group"
                >
                  <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
                </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">inventory_2</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Shipment Status</span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                  selectedOrder.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                  selectedOrder.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  'bg-orange-500/10 text-orange-500 border-orange-500/20'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-1">Laboratory Contents</h3>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="size-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                          <img src={item.products?.image_url} alt="" className="size-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.products?.name}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {item.quantity} × {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(item.unit_price)}
                          </p>
                          {item.variant && (
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1 bg-primary/5 w-fit px-2 py-0.5 rounded-full">{item.variant}</p>
                          )}
                        </div>
                      </div>
                      <p className="font-black text-slate-900 dark:text-white text-lg">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(item.quantity * item.unit_price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Shipping Destination</h3>
                </div>
                <div className="space-y-1 pl-13">
                  <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.shipping_address?.full_name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{selectedOrder.shipping_address?.address1}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.zip}
                  </p>
                  <p className="text-sm text-primary font-bold mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">phone_iphone</span>
                    {selectedOrder.shipping_address?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer (Summary) */}
            <div className="p-8 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
               <div className="space-y-3 max-w-sm ml-auto">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500 font-semibold">Subtotal</span>
                   <span className="text-slate-900 dark:text-white font-black">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(selectedOrder.total_amount - (selectedOrder.shipping_amount || 0) + (selectedOrder.discount_amount || 0))}</span>
                 </div>
                 {selectedOrder.shipping_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-semibold">Standard Shipping</span>
                      <span className="text-slate-900 dark:text-white font-black">+{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(selectedOrder.shipping_amount)}</span>
                    </div>
                 )}
                 {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-sm px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                      <span className="text-red-500 font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">sell</span>
                        Promo Code ({selectedOrder.promo_code || 'LAB20'})
                      </span>
                      <span className="text-red-500 font-black">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(selectedOrder.discount_amount)}</span>
                    </div>
                 )}
                 <div className="flex justify-between text-xl pt-3 border-t border-slate-200 dark:border-slate-700">
                   <span className="text-slate-900 dark:text-white font-black uppercase tracking-tight">Final Total</span>
                   <span className="text-primary font-black">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(selectedOrder.total_amount)}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
