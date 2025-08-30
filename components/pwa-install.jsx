"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

// Use dynamic import with ssr: false to completely avoid server-side rendering
// This will prevent hydration errors by not rendering anything on the server
const DynamicInstallIcon = dynamic(() => import("./pwa-installer"), {
  ssr: false,
});

export default function PWAInstall() {
  // Log when this component mounts
  useEffect(() => {
    console.log("PWAInstall component mounted");
  }, []);

  return <DynamicInstallIcon />;
}
