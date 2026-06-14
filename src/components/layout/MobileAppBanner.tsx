"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function MobileAppBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [appInstalled, setAppInstalled] = useState(false);
  const [ready, setReady] = useState(false); // 👈 New state to prevent flicker

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("app-banner-dismissed");
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // 1. Check device types
    const isIOSMobile = /iPhone|iPad|iPod/i.test(userAgent);
    const android = /android/i.test(userAgent);
    
    if (android) setIsAndroid(true);
    if (!isDismissed && !isIOSMobile) setIsVisible(true);

    // 2. Check installation status and set Ready state
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps()
        .then((apps: any[]) => {
          if (apps.some((a) => a.id === 'com.rentoraug.app')) {
            setAppInstalled(true);
          }
        })
        .catch(() => {
          // Fail silently
        })
        .finally(() => {
          setReady(true); // 👈 Tell the UI it's safe to render
        });
    } else {
      // If browser doesn't support the API, mark as ready immediately
      setReady(true);
    }
  }, []);

  // Guard: Don't render anything until we know the installation status
  if (!isVisible || !ready) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("app-banner-dismissed", "true");
    setIsVisible(false);
  };

  // ── Smart Link Logic ──
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.rentoraug.app";
  const androidIntentUrl = `intent://rentorahouselink.com/#Intent;scheme=https;package=com.rentoraug.app;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;

  const linkHref = appInstalled || isAndroid ? androidIntentUrl : playStoreUrl;
  const buttonText = appInstalled ? "Open App" : "Download";
  const targetAttr = appInstalled || isAndroid ? "_self" : "_blank";

  return (
    <div className="fixed left-4 right-4 top-24 z-[100] flex items-center justify-between gap-4 rounded-md border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur-md transition-colors duration-300 animate-in fade-in slide-in-from-top-8 dark:border-zinc-800 dark:bg-zinc-950/95 md:left-6 md:right-auto md:w-auto md:min-w-[380px] md:shadow-xl">
      <div className="flex items-center gap-3">
        <button 
          onClick={handleDismiss} 
          className="grid h-8 w-8 shrink-0 place-items-center rounded-sm text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label="Dismiss app banner"
        >
          <XMarkIcon className="h-5 w-5" strokeWidth={1.5} />
        </button>
        
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