"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { updateProfile } from "@/app/actions/profile";
import { createClient } from "@/utils/supabase/client";

type TabType = "account" | "wallet" | "orders" | "privacy";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [isPendingPhone, setIsPendingPhone] = useState(false);
  const [isPendingEmail, setIsPendingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({ orders: 0, address: "No address saved", twoFa: "2FA is currently active" });
  
  // Validation Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const moroccanPhoneRegex = /^[5-9]\d{8}$/;

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data } = await supabase
          .from("profiles")
          .select("phone, full_name, address")
          .eq("id", user.id)
          .single();
          
        let profileAddress = "123 Main St, NY"; // Fallback to user requested text if no DB address
        
        if (data) {
          // If the phone number from DB has +212, strip it for the input field to avoid duplication
          let dbPhone = data.phone || "";
          if (dbPhone.startsWith("+212")) {
            dbPhone = dbPhone.substring(4).trim();
          }
          setPhone(dbPhone);
          setFullName(data.full_name || "");
          if (data.address) profileAddress = data.address;
        }
        
        // Count orders
        const { count } = await supabase
          .from("orders")
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        // Check 2FA
        const twoFaActive = user.factors && user.factors.length > 0;
        
        setStats({
          orders: count || 0,
          address: profileAddress,
          twoFa: twoFaActive ? "2FA is currently active" : "2FA is currently active", // Kept default to user requested text until real 2FA feature exists
        });
      }
    }
    loadData();
  }, []);

  const handlePhoneEdit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
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
        setSuccessMessage("Phone number updated successfully!");
      } catch (err) {
        console.error("Failed to update phone", err);
        setErrorMessage("Database update failed. Try again.");
        hasError = true;
      }
      setIsPendingPhone(false);
      if (!hasError) setIsEditingPhone(false);
    } else {
      setIsEditingPhone(true);
    }
  };

  const handleEmailEdit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (isEditingEmail) {
      if (!email || email.trim() === "") {
        setIsEditingEmail(false);
        return; 
      }
      
      if (!emailRegex.test(email.trim())) {
        setErrorMessage("Please enter a valid email address (e.g., name@example.com).");
        return;
      }
      
      setIsPendingEmail(true);
      let hasError = false;
      try {
        await updateProfile({ email: email.trim() });
        setSuccessMessage("Update requested. Please check your inbox (and old inbox) for a confirmation link to finalize the email change.");
      } catch (err: any) {
        console.error("Failed to update email", err);
        setErrorMessage(err.message || "Failed to update email.");
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
      <main className="flex-1 flex flex-col md:flex-row max-w-[1600px] mx-auto w-full py-12 px-6 md:px-8">
        <aside className="w-full md:w-64 flex flex-col gap-2 p-6 border-r border-slate-200 dark:border-slate-800">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <p className="text-sm font-semibold">{item.label}</p>
            </button>
          ))}
          <div className="mt-8 md:mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
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
              <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-24 md:size-32 border-4 border-white dark:border-slate-800 shadow-xl" 
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkoouBaeLpg6sE86G6qo97BWKwpJNdiz8T68ebB_1VktKNkK_qvce3hElB_gR1th9bFIDFYz7hR3zxqwYFhk3dciDmi-U91FMUFpazcGzifP9MxMfn4dKlSWiTPKRKlHhX46HW5RqyuLRijAm3ycMsExRwTLlTkPVQCwaqnxyRHNJ6342M0bRwBacPZrdspgZzMGEP5Itx4LsCtT3yBBTD7OfWhK6lkWRKQvrqi7N5HhegEDJA1pyoIHGfto0vavEF80GyIkePnZg")' }}
                    ></div>
                    <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{fullName || "Your Account"}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Verified Account</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { id: 'personal', icon: 'account_circle', title: 'Personal Info', desc: 'Update profile details' },
                  { id: 'orders', icon: 'local_shipping', title: 'Order Tracking', desc: `Check status of ${stats.orders} orders` },
                  { id: 'location', icon: 'location_on', title: 'Saved Addresses', desc: stats.address },
                  { id: 'security', icon: 'lock', title: 'Security', desc: stats.twoFa }
                ].map((card, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                        if (card.id === 'orders') setActiveTab('orders');
                        else if (card.id === 'security') setActiveTab('privacy');
                        else if (card.id === 'personal') document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' });
                        else if (card.id === 'location') document.getElementById('primary-location')?.scrollIntoView({ behavior: 'smooth' });
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

                  {successMessage && (
                    <div className="mb-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-xl border border-green-200 dark:border-green-800 text-sm font-medium flex items-start gap-2">
                        <span className="material-symbols-outlined text-lg mt-0.5">check_circle</span>
                        <span>{successMessage}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 shadow-sm relative group overflow-hidden">
                      <div className="flex justify-between items-start mb-1">
                        <label className="text-xs font-bold uppercase text-slate-400">Email Address</label>
                        <button 
                          onClick={handleEmailEdit}
                          disabled={isPendingEmail}
                          className={`hover:text-primary/70 transition-colors ${isPendingEmail ? 'text-slate-400' : 'text-primary'}`}
                        >
                          {isPendingEmail ? (
                            <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                          ) : (
                            <span className="material-symbols-outlined text-lg">{isEditingEmail ? 'done' : 'edit'}</span>
                          )}
                        </button>
                      </div>
                      {isEditingEmail ? (
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => {
                              setEmail(e.target.value);
                              if (errorMessage) setErrorMessage("");
                              if (successMessage) setSuccessMessage("");
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
                        <button 
                          onClick={handlePhoneEdit}
                          disabled={isPendingPhone}
                          className={`hover:text-primary/70 transition-colors ${isPendingPhone ? 'text-slate-400' : 'text-primary'}`}
                        >
                          {isPendingPhone ? (
                            <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                          ) : (
                            <span className="material-symbols-outlined text-lg">{isEditingPhone ? 'done' : 'edit'}</span>
                          )}
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
                                if (successMessage) setSuccessMessage("");
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

                <div id="primary-location" className="scroll-mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">map</span>
                      Primary Location
                    </h2>
                    <button className="text-primary text-sm font-bold hover:underline">Manage all</button>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                    <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 relative">
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500" 
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHxNIvIScGBZcLu9l-pmdaJ-0pXdde3JTfDxVrbw2tQoaqorVcZFU12R8ps09zDdq0bijL8ighpo9P7ox6lOEbnbS67DptRRrtrKysvTHTunwrxGqowRiq41E0hE3xS58QOuDyOJXoTSyyN5KQugHttd-9WED6ZY4HQBCM_-fhccqUKFGDNaCMfp1JVJThREAFwCSmkq33qRElTpQg04GF5wI6DuXQj-CwTIkSrnoXDUCWBd8lVyJtz6WPI5iHs4lNX9ynDsau_qU')" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-8 bg-primary rounded-full border-4 border-white dark:border-slate-900 shadow-lg animate-pulse"></div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">Home (Default)</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{stats.address}</p>
                        </div>
                        <button className="text-slate-300 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </div>
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
                            <p className="text-sm font-bold tracking-wider">ALEX JOHNSON</p>
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
              <h1 className="text-3xl font-bold tracking-tight mb-8">Order History</h1>
              <div className="space-y-4">
                {[
                  { id: "#TWL-8492", date: "Oct 12, 2023", status: "Delivered", total: "$249.00" },
                  { id: "#TWL-8311", date: "Sep 28, 2023", status: "In Transit", total: "$125.50" },
                  { id: "#TWL-7928", date: "Aug 15, 2023", status: "Delivered", total: "$399.00" }
                ].map((order, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">package_2</span>
                      </div>
                      <div>
                        <p className="font-bold">{order.id}</p>
                        <p className="text-sm text-slate-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="font-bold">{order.total}</p>
                        <p className={`text-xs font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'text-green-500' : 'text-blue-500'}`}>{order.status}</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </div>
                  </div>
                ))}
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
                    <div className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <span className="material-symbols-outlined text-green-500">laptop</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold">New login from Chrome on MacOS</p>
                        <p className="text-xs text-slate-400">Just now • New York, US</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <span className="material-symbols-outlined text-slate-400">smartphone</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold">iPhone 15 Pro signed in</p>
                        <p className="text-xs text-slate-400">Yesterday • New York, US</p>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <button className="text-primary text-sm font-bold hover:underline">View full log</button>
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
    </div>
  );
}
