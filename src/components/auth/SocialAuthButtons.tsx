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
        theme: "outline",
        size: "large",
        text: mode === "login" ? "signin_with" : "signup_with",
        shape: "rectangular",
        logo_alignment: "left",
        // Max width for Google button is 400px to prevent visual misalignment
        width: Math.min(googleContainerRef.current.offsetWidth, 400),
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

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            or continue with
          </span>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Added flex justify-center so it behaves if its parent stretches beyond 400px */}
        <div
          ref={googleContainerRef}
          className="flex w-full justify-center min-h-[44px] overflow-hidden"
        />

        {error && (
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}