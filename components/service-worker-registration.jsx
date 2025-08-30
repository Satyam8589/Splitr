"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

// Client-side only component
const ServiceWorkerRegisterContent = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Use a small timeout to ensure it runs after everything else
      const timer = setTimeout(() => {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // No UI output
  return null;
};

// Use dynamic import with ssr: false to avoid hydration issues
const ServiceWorkerRegistration = dynamic(
  () => Promise.resolve(ServiceWorkerRegisterContent),
  {
    ssr: false,
  }
);

export default ServiceWorkerRegistration;
