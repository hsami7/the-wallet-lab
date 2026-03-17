"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    const fetchProfile = async (userId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (profile?.full_name) {
        setUserName(profile.full_name);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const name =
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          user?.email?.split("@")[0] ||
          null;
        setUserName(name);
      }
    };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchProfile(session.user.id);
        
        // Subscribe to real-time changes for this user's profile
        const channel = supabase
          .channel(`profile-${session.user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${session.user.id}`
            },
            (payload) => {
              console.log('Real-time profile update:', payload);
              if (payload.new && (payload.new as any).full_name) {
                setUserName((payload.new as any).full_name);
              }
            }
          )
          .subscribe();
          
        return channel;
      } else {
        setUserName(null);
        return null;
      }
    };

    let profileChannel: any = null;
    checkUser().then(channel => {
      profileChannel = channel;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
        profileChannel = null;
      }
      
      if (session?.user) {
        await fetchProfile(session.user.id);
        profileChannel = supabase
          .channel(`profile-${session.user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${session.user.id}`
            },
            (payload) => {
              if (payload.new && (payload.new as any).full_name) {
                setUserName((payload.new as any).full_name);
              }
            }
          )
          .subscribe();
      } else {
        setUserName(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
    };
  }, [pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 lg:px-20 py-4 flex items-center justify-between transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={180} />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/shop" 
            className={`text-sm font-medium transition-all duration-300 relative py-1 ${
              pathname === '/shop' ? "text-primary font-bold" : "text-slate-500 dark:text-slate-400 hover:text-primary"
            }`}
          >
            Shop
            {pathname === '/shop' && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transition-all" />
            )}
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-all duration-300 relative py-1 ${
              pathname === '/about' ? "text-primary font-bold" : "text-slate-500 dark:text-slate-400 hover:text-primary"
            }`}
          >
            About Us
            {pathname === '/about' && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transition-all" />
            )}
          </Link>
          <Link 
            href="/contact" 
            className={`text-sm font-medium transition-all duration-300 relative py-1 ${
              pathname === '/contact' ? "text-primary font-bold" : "text-slate-500 dark:text-slate-400 hover:text-primary"
            }`}
          >
            Contact Us
            {pathname === '/contact' && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transition-all" />
            )}
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search bar commented out */}
        {/* <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700/50">
          <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 w-32 lg:w-48 outline-none" placeholder="Search tech..." />
        </div> */}

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-center rounded-full size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all"
        >
          {mounted && resolvedTheme === 'dark' ? (
            <span className="material-symbols-outlined text-xl">light_mode</span>
          ) : mounted ? (
            <span className="material-symbols-outlined text-xl">dark_mode</span>
          ) : (
            <div className="size-5" />
          )}
        </button>

        {/* Wishlist */}
        <Link href="/wishlist" className="flex items-center justify-center rounded-full size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all relative">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: wishlistCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          {mounted && wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background-light dark:border-background-dark">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link href="/cart" className="flex items-center justify-center rounded-full size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-primary hover:text-white transition-all relative">
          <span className="material-symbols-outlined text-xl">shopping_bag</span>
          {mounted && itemCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse border-2 border-background-light dark:border-background-dark">
              {itemCount}
            </span>
          )}
        </Link>

        {/* Account — shows name when logged in */}
        <Link
          href={userName ? "/account" : "/login"}
          className="flex items-center gap-2 rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:bg-blue-600 pl-1 pr-3 py-1"
        >
          <span className="flex items-center justify-center size-8 rounded-full bg-white/20">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </span>
          {mounted && userName ? (
            <span className="text-sm font-semibold max-w-[100px] truncate">
              {userName.split(" ")[0]}
            </span>
          ) : (
            <span className="text-sm font-semibold">Sign In</span>
          )}
        </Link>
      </div>
    </header>
  );
}
