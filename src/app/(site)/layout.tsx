"use client";

import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile && (profile.role === "admin" || profile.role === "Administrator")) {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  if (isAdmin) {
    redirect("/admin");
    return null;
  }

  // Hide footer on specific routes
  const hideFooterRoutes = ["/cart", "/checkout"];
  const showFooter = !hideFooterRoutes.includes(pathname);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
