"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { AppleAuthUserPayload } from "@/lib/api/auth";

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
          disableAutoSelect?: () => void;
          cancel?: () => void;
        };
      };
    };
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope?: string;
          redirectURI: string;
          usePopup?: boolean;
          state?: string;
        }) => void;
        signIn: () => Promise<{
          authorization?: {
            id_token?: string;
            idToken?: string;
          };
          user?: AppleAuthUserPayload;
          id_token?: string;
        }>;
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
  const { loginWithGoogle, loginWithApple } = useAuth();

  const googleContainerRef = useRef<HTMLDivElement>(null);
  const googleInitRef = useRef(false);
  const appleInitRef = useRef(false);

  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [appleLoaded, setAppleLoaded] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "apple" | null
  >(null);
  const [error, setError] = useState("");

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? "";
  const appleRedirectUri =
    process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ?? window.location.origin;

  const isAppleConfigured = Boolean(appleClientId && appleRedirectUri);
  const title = useMemo(
    () => (mode === "login" ? "Sign in" : "Create account"),
    [mode],
  );

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
        setLoadingProvider("google");

        try {
          await loginWithGoogle(response.credential);
          router.push("/explore");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Google sign-in failed.",
          );
        } finally {
          setLoadingProvider(null);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    google.renderButton(googleContainerRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: "100%",
    });

    googleInitRef.current = true;
  }, [googleClientId, googleLoaded, loginWithGoogle, router]);

  useEffect(() => {
    if (!appleLoaded || !isAppleConfigured || appleInitRef.current) return;
    if (!window.AppleID?.auth) return;

    window.AppleID.auth.init({
      clientId: appleClientId,
      scope: "name email",
      redirectURI: appleRedirectUri,
      usePopup: true,
      state: "rentora-web",
    });

    appleInitRef.current = true;
  }, [appleClientId, appleLoaded, appleRedirectUri, isAppleConfigured]);

  async function handleAppleSignIn() {
    if (!window.AppleID?.auth) {
      setError("Apple sign-in is not available right now.");
      return;
    }

    setError("");
    setLoadingProvider("apple");

    try {
      const response = await window.AppleID.auth.signIn();
      const identityToken =
        response.authorization?.id_token ??
        response.authorization?.idToken ??
        response.id_token;

      if (!identityToken) {
        throw new Error("Apple did not return an identity token.");
      }

      await loginWithApple(identityToken, response.user);
      router.push("/explore");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apple sign-in failed.");
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <div className={className}>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGoogleLoaded(true)}
        onError={() => setError("Google sign-in could not be loaded.")}
      />
      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        strategy="afterInteractive"
        onLoad={() => setAppleLoaded(true)}
        onError={() => setError("Apple sign-in could not be loaded.")}
      />

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200 dark:bg-slate-800" />
          <span className="relative mx-auto block w-fit bg-slate-50 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-950 dark:text-slate-500">
            Or continue with
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div ref={googleContainerRef} className="min-h-[44px]" />

          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={!isAppleConfigured || loadingProvider === "apple"}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`${title} with Apple`}
          >
            {loadingProvider === "apple" ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            ) : (
              <span className="text-lg leading-none"></span>
            )}
            <span>Continue with Apple</span>
          </button>
        </div>

        {!googleClientId && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Google sign-in is not configured.
          </p>
        )}

        {!isAppleConfigured && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Apple sign-in is not configured.
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}