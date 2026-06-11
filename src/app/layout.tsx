import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/auth-context";
import { NotificationProvider } from "@/lib/notifications/notification-context";

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
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {/* ── Wrap your app with the Notification Context ── */}
          <NotificationProvider>
            <Header />
            {children}
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}