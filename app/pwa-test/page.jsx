"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import testPWAInstallation from "@/lib/pwa-test";

export default function PWATester() {
  const [installable, setInstallable] = useState(false);
  const [installState, setInstallState] = useState({});
  const [serviceWorkerState, setServiceWorkerState] = useState({});

  useEffect(() => {
    const pwaTest = testPWAInstallation();

    // Check installability
    const criteria = pwaTest.checkInstallability();
    setInstallState(criteria);

    // Check service worker
    pwaTest.checkServiceWorker().then((reg) => {
      setServiceWorkerState({
        registered: !!reg,
        scope: reg?.scope || "N/A",
        active: !!reg?.active,
        waiting: !!reg?.waiting,
      });
    });

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Store the event
      window.deferredPrompt = e;
      setInstallable(true);
      toast.success(
        'Install prompt detected! Click "Test Install" to show it.'
      );
      console.log("beforeinstallprompt fired", e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleManualInstall = async () => {
    const pwaTest = testPWAInstallation();
    const result = await pwaTest.triggerInstall();

    if (result) {
      toast.success("Installation started");
    } else {
      toast.error("Installation failed or was cancelled");
    }
  };

  const handleForceTrigger = () => {
    const pwaTest = testPWAInstallation();
    pwaTest.simulateBeforeInstallPrompt();
    toast("Synthetic install prompt triggered - check console");
  };

  const refreshCheck = () => {
    const pwaTest = testPWAInstallation();
    const criteria = pwaTest.checkInstallability();
    setInstallState(criteria);

    pwaTest.checkServiceWorker().then((reg) => {
      setServiceWorkerState({
        registered: !!reg,
        scope: reg?.scope || "N/A",
        active: !!reg?.active,
        waiting: !!reg?.waiting,
      });
    });

    toast("PWA checks refreshed");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PWA Installation Tester</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Installation Status</h2>
          <div className="mb-4">
            <p className="mb-2">
              <span className="font-semibold">Install Prompt Available:</span>{" "}
              <span className={installable ? "text-green-500" : "text-red-500"}>
                {installable ? "Yes ✅" : "No ❌"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Already Installed:</span>{" "}
              <span
                className={
                  installState.isStandalone ? "text-green-500" : "text-gray-500"
                }
              >
                {installState.isStandalone ? "Yes ✅" : "No"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Secure Context:</span>{" "}
              <span
                className={
                  installState.isSecureContext
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {installState.isSecureContext ? "Yes ✅" : "No ❌"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Service Worker Support:</span>{" "}
              <span
                className={
                  installState.hasServiceWorkerSupport
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {installState.hasServiceWorkerSupport ? "Yes ✅" : "No ❌"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Manifest:</span>{" "}
              <span
                className={
                  installState.hasManifest ? "text-green-500" : "text-red-500"
                }
              >
                {installState.hasManifest ? "Yes ✅" : "No ❌"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Browser:</span>{" "}
              {installState.isChrome
                ? "Chrome ✅"
                : installState.isEdge
                  ? "Edge ✅"
                  : installState.isSafari
                    ? "Safari ⚠️"
                    : installState.isFirefox
                      ? "Firefox ⚠️"
                      : "Unknown ❓"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleManualInstall}
              disabled={!installable}
              variant={installable ? "default" : "outline"}
              className={installable ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Test Install
            </Button>
            <Button onClick={refreshCheck} variant="outline">
              Refresh Status
            </Button>
            <Button
              onClick={handleForceTrigger}
              variant="outline"
              className="text-amber-600 border-amber-600"
            >
              Force Trigger (Debug)
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Service Worker Status</h2>
          <div className="mb-4">
            <p className="mb-2">
              <span className="font-semibold">Registered:</span>{" "}
              <span
                className={
                  serviceWorkerState.registered
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {serviceWorkerState.registered ? "Yes ✅" : "No ❌"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Scope:</span>{" "}
              <span className="text-gray-600">{serviceWorkerState.scope}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Active:</span>{" "}
              <span
                className={
                  serviceWorkerState.active ? "text-green-500" : "text-gray-500"
                }
              >
                {serviceWorkerState.active ? "Yes ✅" : "No"}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Waiting:</span>{" "}
              <span
                className={
                  serviceWorkerState.waiting
                    ? "text-amber-500"
                    : "text-gray-500"
                }
              >
                {serviceWorkerState.waiting ? "Yes ⚠️" : "No"}
              </span>
            </p>
          </div>

          <Button
            onClick={() => {
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker
                  .register("/sw.js", { scope: "/" })
                  .then((reg) => {
                    toast.success("Service worker registered successfully");
                    setTimeout(refreshCheck, 500);
                  })
                  .catch((err) => {
                    toast.error("Service worker registration failed");
                    console.error(err);
                  });
              } else {
                toast.error("Service workers not supported in this browser");
              }
            }}
            variant="outline"
          >
            Register Service Worker
          </Button>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Make sure you're using a supported browser (Chrome, Edge, Samsung
            Internet)
          </li>
          <li>The app must be served over HTTPS (except on localhost)</li>
          <li>
            You must have interacted with the page before installation (clicked
            something)
          </li>
          <li>The app must not be already installed</li>
          <li>You must have a valid manifest with proper icons</li>
          <li>You must have a service worker registered</li>
          <li>
            Some browsers have engagement heuristics (you need to use the site
            regularly)
          </li>
        </ul>
      </div>
    </div>
  );
}
