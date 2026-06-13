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

export const metadata: Metadata = {
  title: "Rentora Houselink",
  description: "Discover your perfect home with Rentora Houselink - your trusted partner in finding the best rental properties. Explore our extensive listings, connect with landlords, and experience a seamless rental journey. Your dream home is just a click away with Rentora Houselink.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Added suppressHydrationWarning here and updated legacy slate to pure zinc */}
      <body 
        suppressHydrationWarning 
        className="antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white [overflow-anchor:none]"
      >
        {/* Updated loader from legacy blue to the Emerald brand color */}
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