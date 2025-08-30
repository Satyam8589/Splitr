// This file can be used to test PWA installation manually
// Add this to a page for debugging purposes

function testPWAInstallation() {
  // For Chrome/Edge testing only
  const simulateBeforeInstallPrompt = () => {
    // Creates a synthetic beforeinstallprompt event
    const event = new Event("beforeinstallprompt", {
      bubbles: true,
      cancelable: true,
    });

    // Add required properties
    event.prompt = async () => {
      console.log("Prompt method called");
      return Promise.resolve();
    };

    event.userChoice = Promise.resolve({ outcome: "accepted" });

    // Dispatch the event
    window.dispatchEvent(event);

    console.log("Synthetic beforeinstallprompt event dispatched");
  };

  // Log PWA installability criteria
  const checkInstallability = () => {
    const criteria = {
      // Is web app already installed?
      isStandalone: window.matchMedia("(display-mode: standalone)").matches,

      // Is this a secure context?
      isSecureContext: window.isSecureContext,

      // Service worker support
      hasServiceWorkerSupport: "serviceWorker" in navigator,

      // Manifest
      hasManifest: !!document.querySelector('link[rel="manifest"]'),

      // Display mode
      preferredDisplayMode: window.matchMedia("(display-mode: standalone)")
        .matches
        ? "standalone"
        : "browser",

      // Platform details
      platform: navigator.platform,
      userAgent: navigator.userAgent,

      // PWA specific
      isChrome:
        /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor),
      isSafari:
        /Safari/.test(navigator.userAgent) &&
        /Apple Computer/.test(navigator.vendor),
      isEdge: /Edg/.test(navigator.userAgent),
      isFirefox: /Firefox/.test(navigator.userAgent),
    };

    console.table(criteria);
    return criteria;
  };

  // Check service worker
  const checkServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration("/");
        console.log(
          "Service Worker Registration:",
          reg ? "✅ Registered" : "❌ Not registered"
        );
        if (reg) {
          console.log("- Scope:", reg.scope);
          console.log("- Active:", !!reg.active);
          console.log("- Installing:", !!reg.installing);
          console.log("- Waiting:", !!reg.waiting);
        }
        return reg;
      } catch (e) {
        console.error("Service Worker check failed:", e);
        return null;
      }
    } else {
      console.log("❌ Service Workers not supported");
      return null;
    }
  };

  // Try to trigger install manually
  const triggerInstall = async () => {
    try {
      const promptEvent = window.deferredPrompt;

      if (!promptEvent) {
        console.log("❌ No deferred prompt available");
        return false;
      }

      console.log(
        "✅ Deferred prompt available, trying to show install prompt..."
      );
      promptEvent.prompt();

      const choice = await promptEvent.userChoice;
      console.log(`User ${choice.outcome} the installation`);

      // Clear the deferred prompt
      window.deferredPrompt = null;

      return choice.outcome === "accepted";
    } catch (e) {
      console.error("Installation attempt failed:", e);
      return false;
    }
  };

  return {
    simulateBeforeInstallPrompt,
    checkInstallability,
    checkServiceWorker,
    triggerInstall,
  };
}

// Export for use in browser console
if (typeof window !== "undefined") {
  window.PWATest = testPWAInstallation();
}

export default testPWAInstallation;
