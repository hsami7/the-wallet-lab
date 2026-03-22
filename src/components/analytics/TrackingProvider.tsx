"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { logTrafficEvent } from "@/app/actions/analytics";

function TrackingHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Capture UTM parameters
    const utm_source = searchParams.get("utm_source");
    const utm_medium = searchParams.get("utm_medium");
    const utm_campaign = searchParams.get("utm_campaign");
    const ref_user = searchParams.get("ref_user");

    // 2. Persist UTMs
    if (utm_source) sessionStorage.setItem("utm_source", utm_source);
    if (utm_medium) sessionStorage.setItem("utm_medium", utm_medium);
    if (utm_campaign) sessionStorage.setItem("utm_campaign", utm_campaign);
    if (ref_user) sessionStorage.setItem("ref_user", ref_user);

    // 3. Log initial page view
    trackEvent("page_view", {
      path: pathname,
      referrer: document.referrer || "direct"
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Pro Global Tracker
 * Logs events to Supabase for advanced analytics.
 */
export const trackEvent = async (eventType: string, metadata: any = {}) => {
  if (typeof window === "undefined") return;
  
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const active_source = sessionStorage.getItem("utm_source");
  const active_medium = sessionStorage.getItem("utm_medium");
  const active_campaign = sessionStorage.getItem("utm_campaign");
  const ref_user = sessionStorage.getItem("ref_user");

  await logTrafficEvent({
    url: window.location.href,
    referrer: document.referrer || "direct",
    utm_source: active_source,
    utm_medium: active_medium,
    utm_campaign: active_campaign,
    session_id: getSessionId(),
    event_type: eventType,
    user_id: user?.id || null,
    metadata: {
      ...metadata,
      ref_user,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      user_agent: navigator.userAgent
    }
  });
};

// Expose to window for components that might not want to import
if (typeof window !== "undefined") {
  (window as any).trackEvent = trackEvent;
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
