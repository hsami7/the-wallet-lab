"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { logout } from "@/app/actions/auth";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    const fetchProfile = async (userId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);

      if (profile?.full_name) {
        setUserName(profile.full_name);
        const names = profile.full_name.split(" ");
        const ini = names.map((n: any) => n[0]).join("").toUpperCase();
        setUserInitials(ini.slice(0, 2));
      } else {
        const name =
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          user?.email?.split("@")[0] ||
          null;
        setUserName(name);
        if (name) {
          const names = name.split(" ");
          const ini = names.map((n: any) => n[0]).join("").toUpperCase();
          setUserInitials(ini.slice(0, 2));
        }
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
            (payload: any) => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
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
            (payload: any) => {
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 lg:px-20 py-4 flex items-center justify-between transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden flex items-center justify-center p-2 text-slate-600 dark:text-slate-400"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Logo size={140} />
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

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center rounded-full size-9 lg:size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all"
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
          <Link href="/wishlist" className="flex items-center justify-center rounded-full size-9 lg:size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all relative">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: wishlistCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 lg:size-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background-light dark:border-background-dark">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link 
            id="cart-icon-target"
            href="/cart" 
            className="flex items-center justify-center rounded-full size-9 lg:size-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-primary hover:text-white transition-all relative"
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 lg:size-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse border-2 border-background-light dark:border-background-dark">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href={userName ? "/account" : "/login"}
            className="flex items-center gap-2 rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:bg-blue-600 pl-1 pr-2 lg:pr-3 py-1"
          >
            <span className="flex items-center justify-center size-7 lg:size-8 rounded-full bg-white/20">
              <span className="material-symbols-outlined text-[16px] lg:text-[18px]">person</span>
            </span>
            <span className="text-xs lg:text-sm font-semibold max-w-[60px] lg:max-w-[100px] truncate">
              {mounted && userName ? userName.split(" ")[0] : "Sign In"}
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 md:hidden">
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-500">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Logo size={140} forceFull />
                </Link>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="size-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {[
                  { label: "Shop", href: "/shop", icon: "shopping_basket" },
                  { label: "About Us", href: "/about", icon: "help" },
                  { label: "Contact Us", href: "/contact", icon: "mail" },
                  { label: "My Account", href: "/account", icon: "person" },
                  { label: "Whishlist", href: "/wishlist", icon: "favorite" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-semibold transition-all hover:bg-primary/10 hover:text-primary group"
                  >
                    <div className="size-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-primary/30 transition-all">
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                {userName ? (
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {userInitials || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[150px]">{userName}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{userEmail || "Signed In"}</p>
                      </div>
                    </div>
                    <form action={logout}>
                      <button type="submit" className="size-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center transition-colors hover:bg-red-100 dark:hover:bg-red-900/30">
                        <span className="material-symbols-outlined text-xl">logout</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 text-center">
                    <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Lab Special</p>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">20% OFF</h4>
                    <p className="text-xs text-slate-500">First Embroidery Order</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
