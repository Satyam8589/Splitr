"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// This component is completely client-side only
const PWAInstallIcon = () => {
  console.log("PWAInstallIcon rendering");

  // For debugging - always show icon initially
  const [forceShow, setForceShow] = useState(true);

  useEffect(() => {
    console.log("PWAInstallIcon mounted");
    // After 5 seconds, we'll rely on the actual installable logic
    const timer = setTimeout(() => {
      setForceShow(false);
      console.log("Switching to real install detection logic");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if we're already in PWA mode
    const checkStandalone = () => {
      return (
        window.matchMedia?.("(display-mode: standalone)")?.matches ||
        window.navigator?.standalone === true
      );
    };

    if (checkStandalone()) {
      setIsInstalled(true);
      return;
    }

    // Store beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();

      // Store the event
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("Install prompt available");

      // Store in window for debugging
      if (typeof window !== "undefined") {
        window.pwaInstallPrompt = e;
        window.pwaInstallPromptCaptured = true;
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Handle successful installation
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsInstallable(false);
      toast.success("Splitr has been installed successfully!");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Check periodically for standalone mode
    const checkInterval = setInterval(() => {
      if (checkStandalone()) {
        setIsInstalled(true);
        clearInterval(checkInterval);
      }
    }, 2000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearInterval(checkInterval);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error("Installation not available");
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      // Clear the saved prompt
      setDeferredPrompt(null);

      if (outcome === "accepted") {
        setIsInstallable(false);
        toast.success("Installation started!");
      }
    } catch (e) {
      console.error("Installation error:", e);
      toast.error("Installation failed");
    }
  };

  // For debugging purposes
  console.log("PWA Install Status:", {
    isInstallable,
    isInstalled,
    forceShow,
    hasDeferredPrompt: !!deferredPrompt,
  });

  // Don't show anything if it's already installed
  if (isInstalled && !forceShow) {
    console.log("App is installed, hiding icon");
    return null;
  }

  // Only show the icon if the app is installable or we're forcing display
  if (!isInstallable && !forceShow) {
    console.log("App is not installable and not forcing display, hiding icon");
    return null;
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-xl cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
      onClick={handleInstallClick}
      title="Install Splitr App"
      style={{
        animation: "pulse 2s infinite",
        boxShadow: "0 0 15px rgba(16, 185, 129, 0.7)",
      }}
    >
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    </div>
  );
};

export default PWAInstallIcon;
