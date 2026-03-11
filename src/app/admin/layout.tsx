import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch profile to get the full name
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    profile = data;
    
    // Security check: If not an admin, kick them to the customer account page
    if (profile && profile.role !== "admin" && profile.role !== "Administrator") {
      redirect("/account");
    }
  }

  const fullName = profile?.full_name || "Admin User";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AdminSidebar 
        fullName={fullName} 
        initials={initials} 
        email={user?.email} 
      />

      {/* Right side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header (Client Component) */}
        <AdminHeader />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
