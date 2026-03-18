"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function TrackingHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // 1. Capture UTM parameters
    const utm_source = searchParams.get("utm_source");
    const utm_medium = searchParams.get("utm_medium");
    const utm_campaign = searchParams.get("utm_campaign");
    const ref_user = searchParams.get("ref_user"); // For wishlist shares

    // 2. Persist UTMs in sessionStorage for the duration of the visit
    if (utm_source) sessionStorage.setItem("utm_source", utm_source);
    if (utm_medium) sessionStorage.setItem("utm_medium", utm_medium);
    if (utm_campaign) sessionStorage.setItem("utm_campaign", utm_campaign);
    if (ref_user) sessionStorage.setItem("ref_user", ref_user);

    // 3. Get actual UTMs (current or persisted)
    const active_source = utm_source || sessionStorage.getItem("utm_source");
    const active_medium = utm_medium || sessionStorage.getItem("utm_medium");
    const active_campaign = utm_campaign || sessionStorage.getItem("utm_campaign");

    // 4. Log the page view
    const logPageView = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("traffic_logs").insert({
        url: window.location.href,
        referrer: document.referrer || "direct",
        utm_source: active_source,
        utm_medium: active_medium,
        utm_campaign: active_campaign,
        session_id: getSessionId(),
        user_id: user?.id || null,
        metadata: {
          path: pathname,
          ref_user: ref_user || sessionStorage.getItem("ref_user"),
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          user_agent: navigator.userAgent
        }
      });
    };

    logPageView();
  }, [pathname, searchParams]);

  return null;
}

// Simple session ID generator
function getSessionId() {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("tracking_session_id");
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("tracking_session_id", sid);
  }
  return sid;
}

export default function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingHandler />
    </Suspense>
  );
}
