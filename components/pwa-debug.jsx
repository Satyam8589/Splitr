"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

// Client-side only component to avoid hydration issues
const PWADebugContent = () => {
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Wait for everything to load
    const checkPWA = () => {
      try {
        const info = {
          // Basic PWA requirements
          isSecureContext: window.isSecureContext,
          hasServiceWorker: "serviceWorker" in navigator,
          hasManifest: !!document.querySelector('link[rel="manifest"]'),

          // Installation status
          isStandalone: window.matchMedia?.("(display-mode: standalone)")
            ?.matches,
          isSafariStandalone: !!window.navigator?.standalone,

          // Browser info
          userAgent: navigator.userAgent,

          // Service worker status
          serviceWorkerStatus: "pending",
        };

        if ("serviceWorker" in navigator) {
          navigator.serviceWorker
            .getRegistration()
            .then((registration) => {
              if (registration) {
                info.serviceWorkerStatus = "registered";
                info.serviceWorkerScope = registration.scope;
              } else {
                info.serviceWorkerStatus = "not registered";
              }
              setDebugInfo(info);
            })
            .catch((error) => {
              info.serviceWorkerStatus = "error";
              info.serviceWorkerError = error.toString();
              setDebugInfo(info);
            });
        } else {
          setDebugInfo(info);
        }
      } catch (error) {
        setDebugInfo({ error: error.toString() });
      }
    };

    // Run after a short delay to ensure everything is loaded
    const timer = setTimeout(checkPWA, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (debugInfo) {
      console.log("PWA Debug Info:", debugInfo);

      // Log the PWA installation requirements status
      const meetsCriteria =
        debugInfo.isSecureContext &&
        debugInfo.hasServiceWorker &&
        debugInfo.hasManifest &&
        debugInfo.serviceWorkerStatus === "registered";

      console.log(
        "PWA Installability:",
        meetsCriteria ? "✅ Meets criteria" : "❌ Does not meet criteria"
      );

      if (!debugInfo.isSecureContext) {
        console.warn("⚠️ Not in secure context (HTTPS required for PWA)");
      }

      if (!debugInfo.hasManifest) {
        console.warn("⚠️ No manifest detected");
      }

      if (debugInfo.serviceWorkerStatus !== "registered") {
        console.warn("⚠️ Service worker not properly registered");
      }
    }
  }, [debugInfo]);

  return null; // This component doesn't render anything
};

// Use dynamic import with ssr: false to avoid hydration issues
const PWADebug = dynamic(() => Promise.resolve(PWADebugContent), {
  ssr: false,
});

export default PWADebug;
