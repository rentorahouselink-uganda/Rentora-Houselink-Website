"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function MobileAppBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [appInstalled, setAppInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if user already dismissed the banner
    const isDismissed = sessionStorage.getItem("app-banner-dismissed");
    
    // We want to show this to EVERYONE (Desktop & Mobile) who hasn't dismissed it
    if (!isDismissed) {
      setIsVisible(true);
    }

    // 2. Detect if they are specifically on an Android phone
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    }

    // 3. Check if the app is actively installed on their device
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps()
        .then((apps: any[]) => {
          if (apps.some((a) => a.id === 'com.rentoraug.app')) {
            setAppInstalled(true);
          }
        })
        .catch(() => {
          // Fail silently if the browser blocks the check
        });
    }
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("app-banner-dismissed", "true");
    setIsVisible(false);
  };

  // ── Smart Link Logic ──
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.rentoraug.app";
  
  // Android Intent: Tries to open the app. If missing, automatically falls back to Play Store app natively.
  const androidIntentUrl = `intent://rentorahouselink.com/#Intent;scheme=https;package=com.rentoraug.app;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;

  // Use the native intent if the app is installed OR if they are on an Android device (to trigger Play Store app natively).
  // Otherwise (like on a MacBook), just link to the Play Store website.
  const linkHref = appInstalled || isAndroid ? androidIntentUrl : playStoreUrl;
  
  // Dynamic button text and targets based on installation status
  const buttonText = appInstalled ? "Open App" : "Download";
  const targetAttr = appInstalled || isAndroid ? "_self" : "_blank";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-between gap-4 border-t border-zinc-200 bg-white/95 p-4 backdrop-blur-md shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/95 animate-in slide-in-from-bottom-full md:bottom-6 md:left-auto md:right-6 md:w-auto md:min-w-[380px] md:rounded-md md:border md:p-5 md:shadow-xl">
      <div className="flex items-center gap-3">
        <button 
          onClick={handleDismiss} 
          className="grid h-8 w-8 shrink-0 place-items-center rounded-sm text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label="Dismiss app banner"
        >
          <XMarkIcon className="h-5 w-5" strokeWidth={1.5} />
        </button>
        
        {/* App Icon Container */}
        <div className="shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-700">
          <Image
            src="/logo_no_bg.png"
            alt="Rentora App Icon"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
            Rentora Houselink
          </span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {appInstalled ? "Better experience on the app" : "Get the Android App"}
          </span>
        </div>
      </div>
      
      <a
        href={linkHref}
        target={targetAttr}
        rel="noopener noreferrer"
        className="shrink-0 rounded-sm bg-emerald-600 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
      >
        {buttonText}
      </a>
    </div>
  );
}