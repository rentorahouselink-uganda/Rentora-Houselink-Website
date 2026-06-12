"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type SocialAuthButtonsProps = {
  mode?: "login" | "register";
  className?: string;
};

export function SocialAuthButtons({
  mode = "login",
  className = "",
}: SocialAuthButtonsProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const googleContainerRef = useRef<HTMLDivElement>(null);
  const googleInitRef = useRef(false);

  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [error, setError] = useState("");

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  // Navigation fix: Next.js caches the GSI script after the first load, so
  // onLoad never fires again when you navigate back to this page.
  // Check on every mount — if the script is already there, set googleLoaded immediately.
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setGoogleLoaded(true);
    }
    return () => {
      // Reset on unmount so the next mount re-renders the button freshly.
      googleInitRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      !googleLoaded ||
      !googleClientId ||
      !googleContainerRef.current ||
      googleInitRef.current
    ) {
      return;
    }

    const google = window.google?.accounts?.id;
    if (!google) return;

    google.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response.credential) return;
        setError("");
        try {
          await loginWithGoogle(response.credential);
          router.push("/explore");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Google sign-in failed.",
          );
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

   google.renderButton(googleContainerRef.current, {
        theme: "outline",   // ← back to white, clean on both themes
        size: "large",
        text: mode === "login" ? "signin_with" : "signup_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: googleContainerRef.current.offsetWidth,
    });

    googleInitRef.current = true;
  }, [googleClientId, googleLoaded, loginWithGoogle, mode, router]);

  if (!googleClientId) return null;

  return (
    <div className={className}>
      <Script
        id="google-gsi-client"
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGoogleLoaded(true)}
        onError={() => setError("Google sign-in could not be loaded.")}
      />

      <div className="space-y-4">
        {/* Flex divider — doesn't depend on knowing the background colour */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            or continue with
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
        </div>

        {/* overflow-hidden + rounded-xl clips Google's iframe to match the rest of the UI */}
        <div
          ref={googleContainerRef}
          className="w-full min-h-[44px] overflow-hidden rounded-xl"
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}