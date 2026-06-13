import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/auth-context";
import { NotificationProvider } from "@/lib/notifications/notification-context";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { HeaderCompactProvider } from "@/components/layout/header-compact-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── REAL-WORLD SEO OPTIMIZATION ─────────────────────────────────────────────
export const metadata: Metadata = {
  // Use metadataBase so Next.js can correctly resolve relative OG images
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rentorahouselink.com"
  ),
  title: {
    default: "Rentora Houselink Uganda | Exclusive Real Estate & Rentals",
    template: "%s | Rentora Houselink Uganda",
  },
  description:
    "Discover your perfect home with Rentora Houselink Uganda. Explore exclusive property listings, connect with verified landlords, and experience a seamless rental journey across Uganda.",
  keywords: [
    "real estate Uganda",
    "apartments for rent Kampala",
    "buy house Uganda",
    "rentals in Uganda",
    "apartments for sale Uganda",
    "houses for sale Uganda",
    "houses for rent Uganda",
    "property listings",
    "hostels in Uganda",
    "commercial spaces",
    "Rentora Houselink",
  ],
  authors: [{ name: "Rentora Houselink Uganda" }],
  creator: "Rentora Houselink Uganda",
  publisher: "Rentora Houselink Uganda",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Rentora Houselink Uganda | Exclusive Real Estate & Rentals",
    description:
      "Discover your perfect home with Rentora Houselink Uganda. Explore exclusive property listings and connect with verified landlords.",
    url: "/",
    siteName: "Rentora Houselink Uganda",
    locale: "en_UG",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Rentora Houselink Uganda - Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentora Houselink Uganda | Exclusive Real Estate & Rentals",
    description:
      "Discover your perfect home with Rentora Houselink Uganda. Explore exclusive property listings and connect with verified landlords.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        suppressHydrationWarning 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white [overflow-anchor:none]`}
      >
        {/* Fixed loader hex code to Emerald-500 (#10b981) for architectural brand consistency */}
        <NextTopLoader 
          color="#2563eb"
          initialPosition={0.08} 
          crawlSpeed={200} 
          height={3} 
          crawl={true} 
          showSpinner={false} 
          easing="ease" 
          speed={200} 
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <NotificationProvider>
              <HeaderCompactProvider>
                <Header />
                {children}
              </HeaderCompactProvider>
              <Footer />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}