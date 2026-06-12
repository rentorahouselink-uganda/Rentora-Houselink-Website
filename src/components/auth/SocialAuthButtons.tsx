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
      theme: "outline",
      size: "large",
      text: mode === "login" ? "signin_with" : "signup_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: "100%",
    });

    googleInitRef.current = true;
  }, [googleClientId, googleLoaded, loginWithGoogle, mode, router]);

  // No env var set yet — hide the whole section, login page shows
  // just the email/password form. Nothing breaks.
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
        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200 dark:bg-slate-800" />
          <span className="relative mx-auto block w-fit bg-slate-50 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-950 dark:text-slate-500">
            Or continue with
          </span>
        </div>

        {/* Google renders its own branded button into this div */}
        <div ref={googleContainerRef} className="min-h-[44px]" />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}